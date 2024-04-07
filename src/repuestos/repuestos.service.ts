import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { Repuesto } from './schemas/repuesto.schema';
import { VerifyRepuestoDto } from './dto/verify-repuesto.dto';
import { CreateRepuestoDto } from './dto/create-repuesto.dto';
import { NuevoRepuestoDto } from 'src/estadisticas/dto/nuevo-repuesto.dto';
import { UpdateRepuestoDto } from 'src/estadisticas/dto/actualizar-repuesto.dto';
import { IngresoRepuestosDto } from 'src/estadisticas/dto/ingreso-repuestos.dto';

@Injectable()
export class RepuestosService {
  constructor(
    @InjectModel(Repuesto.name)
    private readonly respuestoModel: Model<Repuesto>,
  ) {}

  async create(createRepuestoDto: CreateRepuestoDto): Promise<Repuesto> {
    const newRepuesto = await this.respuestoModel.create(createRepuestoDto);
    return newRepuesto;
  }

  async createMany(
    createRepuestosDto: NuevoRepuestoDto[],
    session: ClientSession,
  ): Promise<Repuesto[]> {
    const uniqueCheck = new Set(
      createRepuestosDto.map(
        (repuesto) => `${repuesto.marca}-${repuesto.producto}`,
      ),
    );
    if (uniqueCheck.size < createRepuestosDto.length) {
      throw new Error(
        'Esta ingresando el mismo repuestos dos veces, por favor verifique los datos (nuevos repuestos)',
      );
    }

    const newRepuestos = await Promise.all(
      createRepuestosDto.map(async (repuestoDto) => {
        const existingRepuesto = await this.respuestoModel
          .findOne({
            producto: repuestoDto.producto,
            marca: repuestoDto.marca,
          })
          .session(session);
        if (existingRepuesto) {
          throw new Error(
            `El repuesto con nombre "${repuestoDto.producto}" y marca "${repuestoDto.marca}" ya existe`,
          );
        }
        return this.respuestoModel.create([repuestoDto], {
          session,
        });
      }),
    );
    return newRepuestos.flat();
  }

  async actualizarRepuesto(
    repuestos: UpdateRepuestoDto[],
    session: ClientSession,
  ): Promise<any> {
    const uniqueCheck = new Set(repuestos.map((repuesto) => repuesto._id));
    if (uniqueCheck.size < repuestos.length) {
      throw new Error(
        'Esta ingresando el mismo repuestos dos veces, por favor verifique los datos (actualizar repuestos)',
      );
    }

    const operations = repuestos.map((repuesto) => ({
      updateOne: {
        filter: { _id: repuesto._id },
        update: {
          $set: { cantidad: repuesto.cantidad, precio: repuesto.precio },
        },
      },
    }));

    return this.respuestoModel.bulkWrite(operations, { session });
  }

  async ingresarRepuestos(dto: IngresoRepuestosDto): Promise<any> {
    const session = await this.respuestoModel.db.startSession();
    session.startTransaction();
    try {
      let newRepuestos;
      let updatedRepuestos;

      if (dto.repuestosNuevos && dto.repuestosNuevos.length > 0) {
        newRepuestos = await this.createMany(dto.repuestosNuevos, session);
      }

      if (dto.repuestosActualizar && dto.repuestosActualizar.length > 0) {
        updatedRepuestos = await this.actualizarRepuesto(
          dto.repuestosActualizar,
          session,
        );
      }

      await session.commitTransaction();
      return { newRepuestos, updatedRepuestos };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async findAll(): Promise<Repuesto[]> {
    const repuestos = await this.respuestoModel
      .find()
      .collation({ locale: 'es', strength: 2 })
      .sort({ producto: 1 });
    return repuestos;
  }
  async findById(_id: string): Promise<Repuesto> {
    const repuesto = await this.respuestoModel.findById(_id);
    if (!repuesto) {
      throw new HttpException('Repuesto not found', HttpStatus.NOT_FOUND);
    }
    return repuesto;
  }

  async verify(
    verifyRepuestoDto: VerifyRepuestoDto,
    session?: any,
  ): Promise<boolean> {
    const transactionSession =
      session || (await this.respuestoModel.db.startSession());
    const isNewSession = !session;
    if (isNewSession) {
      transactionSession.startTransaction();
    }
    try {
      const repuestos = verifyRepuestoDto.repuestos;

      await Promise.all(
        repuestos.map(async (repuesto) => {
          const foundRepuesto = await this.respuestoModel
            .findById(repuesto.id)
            .session(transactionSession);
          if (foundRepuesto && foundRepuesto.cantidad >= repuesto.cantidad) {
            foundRepuesto.cantidadReserva += repuesto.cantidad;
            foundRepuesto.cantidad -= repuesto.cantidad;
            await foundRepuesto.save({ session: transactionSession });
          } else {
            throw new HttpException(
              `Repuesto ${repuesto.id} no encontrado o cantidad insuficiente`,
              HttpStatus.NOT_FOUND,
            );
          }
        }),
      );
      if (isNewSession) {
        await transactionSession.commitTransaction();
      }
      return true;
    } catch (error) {
      if (isNewSession) {
        await transactionSession.abortTransaction();
      }
      throw error;
    } finally {
      if (isNewSession) {
        transactionSession.endSession();
      }
    }
  }
  async correctRevi(
    verifyRepuestoDto: VerifyRepuestoDto,
    session?: any,
  ): Promise<boolean> {
    const transactionSession =
      session || (await this.respuestoModel.db.startSession());
    if (!session) {
      transactionSession.startTransaction();
    }
    try {
      const repuestos = verifyRepuestoDto.repuestos;

      await Promise.all(
        repuestos.map(async (repuesto) => {
          console.log('Buscando repuesto con ID:', repuesto.id);
          const foundRepuesto = await this.respuestoModel
            .findById(repuesto.id)
            .session(transactionSession);
          console.log('Repuesto encontrado:', foundRepuesto);
          if (
            foundRepuesto &&
            foundRepuesto.cantidadReserva >= repuesto.cantidad
          ) {
            foundRepuesto.cantidadReserva -= repuesto.cantidad;
            foundRepuesto.cantidad += repuesto.cantidad;
            await foundRepuesto.save({ session: transactionSession });
            console.log('Repuesto actualizado:', foundRepuesto);
          } else {
            throw new HttpException(
              `Repuesto ${repuesto.id} no encontrado o cantidad insuficiente`,
              HttpStatus.NOT_FOUND,
            );
          }
        }),
      );

      if (!session) {
        await transactionSession.commitTransaction();
      }
      console.log('Transacción completada con éxito');
      return true;
    } catch (error) {
      console.log('Error en la transacción:', error);
      if (!session) {
        await transactionSession.abortTransaction();
      }
      throw error;
    } finally {
      if (!session) {
        transactionSession.endSession();
      }
    }
  }

  async finalizarRep(
    verifyRepuestoDto: VerifyRepuestoDto,
    session?: any,
  ): Promise<boolean> {
    const transactionSession =
      session || (await this.respuestoModel.db.startSession());
    if (!session) {
      transactionSession.startTransaction();
    }
    try {
      const repuestos = verifyRepuestoDto.repuestos;

      await Promise.all(
        repuestos.map(async (repuesto) => {
          console.log('Buscando repuesto con ID:', repuesto.id);
          const foundRepuesto = await this.respuestoModel
            .findById(repuesto.id)
            .session(transactionSession);
          console.log('Repuesto encontrado:', foundRepuesto);
          if (
            foundRepuesto &&
            foundRepuesto.cantidadReserva >= repuesto.cantidad
          ) {
            foundRepuesto.cantidadReserva -= repuesto.cantidad;
            await foundRepuesto.save({ session: transactionSession });
            console.log('Repuesto actualizado:', foundRepuesto);
          } else {
            throw new HttpException(
              `Repuesto ${repuesto.id} no encontrado o cantidad insuficiente`,
              HttpStatus.NOT_FOUND,
            );
          }
        }),
      );

      if (!session) {
        await transactionSession.commitTransaction();
      }
      console.log('Transacción completada con éxito');
      return true;
    } catch (error) {
      console.log('Error en la transacción:', error);
      if (!session) {
        await transactionSession.abortTransaction();
      }
      throw error;
    } finally {
      if (!session) {
        transactionSession.endSession();
      }
    }
  }

  async searchRepuesto(
    search: string,
    page?: number,
  ): Promise<{ repuestos: Repuesto[]; totalPages: number }> {
    const limit = 8;

    let skip;
    let needPagination = true;

    if (page === undefined || page === null) {
      needPagination = false;
    } else {
      skip = page && page > 0 ? (page - 1) * limit : 0;
    }

    let query = {};

    // Si la cadena de búsqueda no está vacía, divide la cadena de búsqueda en palabras y busca en ambos campos, producto y marca
    if (search !== '') {
      const words = search.split(' ').map((word) => new RegExp(word, 'i'));
      query = {
        $or: [{ producto: { $in: words } }, { marca: { $in: words } }],
      };
    }

    const totalDocuments = await this.respuestoModel.countDocuments(query);
    const totalPages = needPagination ? Math.ceil(totalDocuments / limit) : 1;

    let findQuery = this.respuestoModel.find(query);

    if (needPagination) {
      findQuery = findQuery.skip(skip).limit(limit);
    }

    const repuestos = await findQuery.exec();

    return {
      repuestos,
      totalPages,
    };
  }
}
