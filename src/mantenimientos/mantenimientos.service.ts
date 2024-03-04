import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PrograMantenimientoDto } from './dto/create-mantenimiento.dto';
import {
  Mantenimiento,
  MantenimientoDocument,
} from './schemas/mantenimiento.schema';
import { CarsService } from 'src/cars/cars.service';
import { ExistsCarDto } from '../cars/dto/exists-card.dto';
import { UpdateMantenimientoDto } from './dto/update-mantenimiento.dto';
import { UpdateOneMantenimientoDto } from './dto/update-one-mantenimiento.dto';
import { RepuestosService } from 'src/repuestos/repuestos.service';
import { VerifyRepuestoDto } from '../repuestos/dto/verify-repuesto.dto';
import { CarInfoDto } from 'src/cars/dto/car-info.dto';
import { Subject } from 'rxjs';
import * as moment from 'moment-timezone';
import { pubSub } from 'src/shared/pubsub';

@Injectable()
export class MantenimientosService {
  private readonly mantenimientoChanges = new Subject<any>();
  constructor(
    @InjectModel(Mantenimiento.name)
    private readonly mantenimientoModel: Model<Mantenimiento>,
    private readonly carsService: CarsService,
    private readonly repuestosService: RepuestosService,
  ) {}

  async getCantidadMantenimientosPorEstado(estado: string): Promise<number> {
    return this.mantenimientoModel.countDocuments({ estado });
  }
  async getProgrammedMaintenanceDates(): Promise<Date[]> {
    const mantenimientos = await this.mantenimientoModel
      .find({ estado: 'programado' })
      .exec();
    const fechas = [];
    for (const mantenimiento of mantenimientos) {
      const fecha = moment(mantenimiento.fecha)
        .tz('America/Lima')
        .startOf('day')
        .toDate();
      if (!fechas.find((f) => f.getTime() === fecha.getTime())) {
        fechas.push(fecha);
      }
    }
    return fechas;
  }

  async getCantidadMantenimientosPorEstadoYFecha(
    estado: string,
    fecha: Date,
  ): Promise<number> {
    // Obtener el inicio del día
    const inicioDia = new Date(fecha);
    inicioDia.setHours(0, 0, 0, 0);

    // Obtener el fin del día
    const finDia = new Date(fecha);
    finDia.setHours(23, 59, 59, 999);

    // Realizar la consulta
    return this.mantenimientoModel.countDocuments({
      estado,
      fecha: {
        $gte: inicioDia,
        $lte: finDia,
      },
    });
  }

  async getMantenimientosPorEstadoYFecha(
    estado: string,
    fecha: Date,
  ): Promise<Mantenimiento[]> {
    const startOfDay = new Date(fecha);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(fecha);
    endOfDay.setHours(23, 59, 59, 999);

    return this.mantenimientoModel.find({
      estado,
      fecha: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });
  }

  async getMantenimientoPorId(id: string): Promise<Mantenimiento> {
    return this.mantenimientoModel.findById(id).exec();
  }

  async programar(
    programarManteniminetoDto: PrograMantenimientoDto,
  ): Promise<Mantenimiento> {
    const existsCarDto: ExistsCarDto = {
      placa: programarManteniminetoDto.placa,
    };
    const exists = await this.carsService.exists(existsCarDto);
    if (!exists) {
      throw new NotFoundException('Carro no existe');
    }

    const programMant = await this.mantenimientoModel.create({
      ...programarManteniminetoDto,
      estado: 'programado',
    });
    const mantToday = await this.getMantAPartirDeHoy();
    const allMantenimientos = await this.getMantenimientosDeHoy();
    const calendar = await this.getProgrammedMaintenanceCount();
    pubSub.publish('calendarTecnico', {
      calendarTecnico: { calendar, mantenimientos: allMantenimientos },
    });
    pubSub.publish('Actividades', { Actividades: mantToday });
    return programMant.id.toString();
  }

  async registrar(
    updateMantDto: UpdateMantenimientoDto,
  ): Promise<Mantenimiento> {
    const session = await this.mantenimientoModel.db.startSession();
    session.startTransaction();
    try {
      const mantenimiento = await this.mantenimientoModel
        .findById(updateMantDto._id)
        .session(session);
      if (!mantenimiento) {
        throw new NotFoundException(
          `Mantenimiento with ID ${updateMantDto._id} not found`,
        );
      }

      const repuestos = updateMantDto.repuestos.map((repuesto: any) => ({
        id: repuesto.id,
        marca: repuesto.marca,
        producto: repuesto.producto,
        cantidad: Number(repuesto.cantidad),
      }));

      const verifyRepuestoDto: VerifyRepuestoDto = { repuestos };

      const canProceed = await this.repuestosService.verify(
        verifyRepuestoDto,
        session,
      );

      if (!canProceed) {
        throw new BadRequestException('Repuestos verification failed');
      }

      const updateMant = await this.mantenimientoModel.findByIdAndUpdate(
        updateMantDto._id,
        {
          ...updateMantDto,
          estado: 'pendiente',
        },
        { new: true, session },
      );
      // Obtener la placa del carro del mantenimiento
      const placa = mantenimiento.placa;

      const updateKmDto = {
        placa,
        kmActual: updateMantDto.kmMedido,
      };
      await this.carsService.updateKm(updateKmDto);
      await session.commitTransaction();
      const mantToday = await this.getMantAPartirDeHoy();
      const allMantenimientos = await this.getMantenimientosDeHoy();
      const calendar = await this.getProgrammedMaintenanceCount();
      pubSub.publish('calendarTecnico', {
        calendarTecnico: { calendar, mantenimientos: allMantenimientos },
      });
      pubSub.publish('Actividades', { Actividades: mantToday });
      return updateMant.id.toString(); //Enviamos el ID como string
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async registrarNuevo(
    updateOneMantDto: UpdateOneMantenimientoDto,
  ): Promise<Mantenimiento> {
    const existsCarDto: ExistsCarDto = { placa: updateOneMantDto.placa };
    const exists = await this.carsService.exists(existsCarDto);
    if (!exists) {
      throw new NotFoundException('Carro no existe');
    }
    const session = await this.mantenimientoModel.db.startSession();
    session.startTransaction();
    try {
      const repuestos = updateOneMantDto.repuestos.map((repuesto: any) => ({
        id: repuesto.id,
        //cantidadReserva: Number(repuesto.cantidadReserva),
        marca: repuesto.marca,
        producto: repuesto.producto,
        cantidad: Number(repuesto.cantidad),
        // precio: Number(repuesto.precio),
      }));

      const verifyRepuestoDto: VerifyRepuestoDto = { repuestos };

      const canProceed = await this.repuestosService.verify(
        verifyRepuestoDto,
        session,
      );
      if (!canProceed) {
        throw new BadRequestException('Repuestos verification failed');
      }
      const [updateOneMant] = await this.mantenimientoModel.create(
        [
          {
            ...updateOneMantDto,
            estado: 'pendiente',
          },
        ],
        { new: true, session },
      );

      // Actualizar kmActual después de que todas las demás operaciones se hayan completado con éxito
      const updateKmDto = {
        placa: updateOneMantDto.placa,
        kmActual: updateOneMantDto.kmMedido,
      };
      await this.carsService.updateKm(updateKmDto);
      await session.commitTransaction();
      const mantToday = await this.getMantAPartirDeHoy();
      const allMantenimientos = await this.getMantenimientosDeHoy();
      const calendar = await this.getProgrammedMaintenanceCount();
      pubSub.publish('calendarTecnico', {
        calendarTecnico: { calendar, mantenimientos: allMantenimientos },
      });
      pubSub.publish('Actividades', { Actividades: mantToday });
      return updateOneMant.id.toString();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async filtrarMantenimientosPorPlaca(
    placa: string,
  ): Promise<MantenimientoDocument[]> {
    return this.mantenimientoModel.find({ placa }).exec();
  }

  async getInfoByPlaca(placa: string): Promise<any[]> {
    const mantenimientos = await this.filtrarMantenimientosPorPlaca(placa);
    return mantenimientos.map((mantenimiento) => ({
      id: mantenimiento._id,
      fecha: mantenimiento.fecha,
      tipo: mantenimiento.tipo,
      repuestosUsados: mantenimiento.repuestos.length,
    }));
  }

  async findInfoForPlaca(existsCarDto: ExistsCarDto): Promise<CarInfoDto> {
    const car = await this.carsService.findCarInfo(existsCarDto);
    const mantenimientos = await this.getInfoByPlaca(car.placa);

    return {
      id: car._id,
      placa: car.placa,
      fechaSoat: car.fechaSoat,
      vigenciaContrato: car.vigenciaContrato,
      cliente: car.cliente,
      tipoContrato: car.tipoContrato,
      propietario: car.propietario,
      kmRegistroInicial: car.kmRegistroInicial,
      kmActual: car.kmActual,
      Puntaje: car.puntaje,
      Mantenimientos: mantenimientos,
    };
  }

  async revision(
    id: string,
    cambiosSolicitados: string,
  ): Promise<Mantenimiento> {
    const session = await this.mantenimientoModel.db.startSession();
    session.startTransaction();
    try {
      const mantenimiento = await this.mantenimientoModel
        .findById(id)
        .session(session);
      if (!mantenimiento) {
        throw new NotFoundException(`Mantenimiento with ID ${id} not found`);
      }

      const repuestos = mantenimiento.repuestos
        .filter((repuesto: any) => repuesto.id)
        .map((repuesto: any) => ({
          id: repuesto.id,
          marca: repuesto.marca,
          producto: repuesto.producto,
          cantidad: repuesto.cantidad,
        }));

      const verifyRepuestoDto: VerifyRepuestoDto = { repuestos };

      const canProceed = await this.repuestosService.correctRevi(
        verifyRepuestoDto,
        session,
      );

      if (!canProceed) {
        throw new BadRequestException('Repuestos correction failed');
      }

      mantenimiento.estado = 'revision';
      mantenimiento.cambiosSolicitados = cambiosSolicitados;
      const updatedMant = await mantenimiento.save({ session });

      await session.commitTransaction();

      const mantToday = await this.getMantAPartirDeHoy();
      const allMantenimientos = await this.getMantenimientosDeHoy();
      const calendar = await this.getProgrammedMaintenanceCount();
      pubSub.publish('calendarTecnico', {
        calendarTecnico: { calendar, mantenimientos: allMantenimientos },
      });
      pubSub.publish('Actividades', { Actividades: mantToday });
      return updatedMant;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async completarMantenimiento(
    id: string,
    diagnosticoFinal: string,
  ): Promise<string> {
    const updatedMantenimiento =
      await this.mantenimientoModel.findByIdAndUpdate(
        id,
        {
          diagnosticoFinal,
          estado: 'completado',
        },
        { new: true },
      );

    if (!updatedMantenimiento) {
      throw new NotFoundException(`Mantenimiento with ID ${id} not found`);
    }
    const mantToday = await this.getMantAPartirDeHoy();
    const allMantenimientos = await this.getMantenimientosDeHoy();
    const calendar = await this.getProgrammedMaintenanceCount();
    pubSub.publish('calendarTecnico', {
      calendarTecnico: { calendar, mantenimientos: allMantenimientos },
    });
    pubSub.publish('Actividades', { Actividades: mantToday });
    return updatedMantenimiento.id.toString();
  }

  async getMantenimientosExceptoEstado(
    estado: string,
  ): Promise<Mantenimiento[]> {
    return this.mantenimientoModel.find({ estado: { $ne: estado } }).exec();
  }

  async getMantenimientosDeHoy(): Promise<Mantenimiento[]> {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    console.log('Fecha del servidor: ', new Date());
    console.log('Inicio del día: ', startOfToday);
    console.log('Fin del día: ', endOfToday);

    const mantenimientos = await this.mantenimientoModel
      .find({
        fecha: { $gte: startOfToday, $lte: endOfToday },
        tipo: { $nin: ['expirado', 'completado'] },
      })
      .exec();

    //console.log('Mantenimientos encontrados: ', mantenimientos);

    // Asegurarse de que siempre se devuelva un array
    return mantenimientos || [];
  }
  async getCalendarHome(): Promise<[number, number]> {
    const today = new Date();
    const cantidadProgramada =
      await this.getCantidadMantenimientosPorEstadoYFecha('programada', today);
    const cantidadPendiente =
      await this.getCantidadMantenimientosPorEstadoYFecha('pendiente', today);
    const cantidadRevision =
      await this.getCantidadMantenimientosPorEstadoYFecha('revision', today);
    const cantidadCompletada =
      await this.getCantidadMantenimientosPorEstadoYFecha('completado', today);
    const cantidadTotal =
      cantidadCompletada +
      cantidadPendiente +
      cantidadRevision +
      cantidadProgramada;
    return [cantidadProgramada, cantidadTotal];
  }

  async getProgrammedMaintenanceCount(): Promise<
    { dayMes: string; cantidad: number }[]
  > {
    const today = new Date();
    const twoMonthsLater = new Date();
    twoMonthsLater.setMonth(today.getMonth() + 2);

    const mantenimientos = await this.mantenimientoModel
      .find({
        estado: 'programado',
        fecha: {
          $gte: today,
          $lte: twoMonthsLater,
        },
      })
      .exec();

    const counts = mantenimientos.reduce((acc, mantenimiento) => {
      const dayMes = mantenimiento.fecha.toISOString().split('T')[0]; // Formatea la fecha a 'YYYY-MM-DD'
      if (!acc[dayMes]) {
        acc[dayMes] = 0;
      }
      acc[dayMes]++;
      return acc;
    }, {});

    return Object.entries(counts).map(([dayMes, cantidad]) => ({
      dayMes: dayMes.split('-').reverse().join('/'), // Cambia el formato de 'YYYY-MM-DD' a 'DD/MM/YYYY'
      cantidad: Number(cantidad),
    }));
  }

  async getMantAPartirDeHoy(): Promise<Mantenimiento[]> {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // console.log('Fecha del servidor: ', new Date());
    // console.log('Inicio del día: ', startOfToday);

    const mantenimientos = await this.mantenimientoModel
      .find({
        fecha: { $gte: startOfToday },
        tipo: { $nin: ['expirado', 'completado'] },
      })
      .exec();

    //console.log('Mantenimientos encontrados: ', mantenimientos);

    // Asegurarse de que siempre se devuelva un array
    return mantenimientos || [];
  }

  async getConsumedRepuestos(startDate: Date, months: number): Promise<any> {
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() - months);

    const mantenimientos = await this.mantenimientoModel.aggregate([
      {
        $match: {
          fecha: { $gte: endDate, $lte: startDate },
          estado: 'completado',
        },
      },
      {
        $unwind: '$repuestos',
      },
      {
        $group: {
          _id: {
            month: { $month: '$fecha' },
            year: { $year: '$fecha' },
            producto: '$repuestos.producto',
          },
          cantidadConsumida: { $sum: '$repuestos.cantidad' },
        },
      },
      {
        $sort: { cantidadConsumida: -1 },
      },
    ]);

    const results = [];
    for (const mant of mantenimientos) {
      const key = `${mant._id.month}/${mant._id.year}`;
      let monthData = results.find((item) => item.mesYear === key);
      if (!monthData) {
        monthData = {
          mesYear: key,
          otros: { producto: 'otros', cantidadConsumida: 0 },
        };
        results.push(monthData);
      }
      if (Object.keys(monthData).length <= 6) {
        monthData[`prod${Object.keys(monthData).length - 1}`] = {
          producto: mant._id.producto,
          cantidadConsumida: mant.cantidadConsumida,
        };
      } else {
        monthData.otros.cantidadConsumida += mant.cantidadConsumida;
      }
    }

    return results;
  }
}
