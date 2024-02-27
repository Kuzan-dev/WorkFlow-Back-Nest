/* eslint-disable @typescript-eslint/no-unused-vars */
import { Mutation, Resolver, Args, Query } from '@nestjs/graphql';
import { RepuestosService } from './repuestos.service';
import { CreateRepuestoDto } from './dto/create-repuesto.dto';
import { VerifyRepuestoDto } from './dto/verify-repuesto.dto';
import { RepuestoDto, RepuestoType } from './dto/repuesto.dto';

@Resolver()
export class RepuestosResolver {
  constructor(private readonly repuestoService: RepuestosService) {}

  @Query((returns) => [RepuestoType], { name: 'obtener_todos_los_repuestos' })
  async findAll(): Promise<RepuestoType[]> {
    const repuestos = await this.repuestoService.findAll();
    return repuestos.map((repuesto) => ({
      id: repuesto._id,
      producto: repuesto.producto,
      marca: repuesto.marca,
      cantidad: repuesto.cantidad,
      cantidadReserva: repuesto.cantidadReserva,
      precio: repuesto.precio,
    }));
  }

  @Mutation((returns) => Boolean)
  async createRepuesto(
    @Args('createRepuestoInput') createRepuestoDto: CreateRepuestoDto,
  ) {
    await this.repuestoService.create(createRepuestoDto);
    return true;
  }

  @Mutation((returns) => Boolean)
  async verifyRepuesto(
    @Args('verifyRepuestoInput') verifyRepuestoDto: VerifyRepuestoDto,
  ) {
    await this.repuestoService.verify(verifyRepuestoDto);
    return true;
  }
}
