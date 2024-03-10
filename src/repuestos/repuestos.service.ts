import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Repuesto } from './schemas/repuesto.schema';
import { VerifyRepuestoDto } from './dto/verify-repuesto.dto';
import { CreateRepuestoDto } from './dto/create-repuesto.dto';

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
  async findAll(): Promise<Repuesto[]> {
    const repuestos = await this.respuestoModel.find();
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
}
