/* eslint-disable @typescript-eslint/no-unused-vars */
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FacturasService } from './facturas.service';
import { CreateFacturaDto } from './dto/create-factura.dto';

@Resolver()
export class FacturasResolver {
  constructor(private readonly facturasService: FacturasService) {}

  @Mutation((returns) => String)
  async createFactura(
    @Args('createFacturaInput') createFacturaDto: CreateFacturaDto,
  ) {
    const id = await this.facturasService.create(createFacturaDto);
    return id;
  }
}
