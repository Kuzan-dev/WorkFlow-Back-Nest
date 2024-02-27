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

  async getMantenimientosPorEstadoYFecha(
    estado: string,
    fecha: Date,
  ): Promise<Mantenimiento[]> {
    return this.mantenimientoModel.find({ estado, fecha });
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
    return programMant;
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
      // this.mantenimientoChanges.next('Mantenimiento updated'); //Emitir evento para notificar cambios

      return updateMant;
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
        //marca: repuesto.marca,
        //producto: repuesto.producto,
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
            estado: 'registrado',
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
      // this.mantenimientoChanges.next('Mantenimiento updated'); //Emitir evento para notificar cambios
      return updateOneMant;
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
      propietario: car.propietario,
      kmRegistroInicial: car.kmRegistroInicial,
      kmActual: car.kmActual,
      Puntaje: car.puntaje,
      Mantenimientos: mantenimientos,
    };
  }
}
