/* eslint-disable @typescript-eslint/no-unused-vars */
import { Mutation, Resolver, Args } from '@nestjs/graphql';
import { RepuestosService } from './repuestos.service';
import { CreateRepuestoDto } from './dto/create-repuesto.dto';
import { VerifyRepuestoDto } from './dto/verify-repuesto.dto';

@Resolver()
export class RepuestosResolver {
  constructor(private readonly repuestoService: RepuestosService) {}

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
