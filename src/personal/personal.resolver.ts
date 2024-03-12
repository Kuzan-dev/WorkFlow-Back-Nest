import { Args, Mutation, Resolver, Query, Subscription } from '@nestjs/graphql';
import { PersonalService } from './personal.service';
import { PersonalInput, SalarioFechaInput } from './dto/create-personal.input';
import { PersonalDto } from './dto/create-personal.dto';
import { pubSub } from 'src/shared/pubsub';

@Resolver()
export class PersonalResolver {
  constructor(private readonly personalService: PersonalService) {}

  @Mutation(() => String, {
    name: 'crear_Personal',
    description:
      'Esta Función registra un nuevo persoanl en la base de datos y retorna el id del documento creado',
  })
  async createPersonal(@Args('input') input: PersonalInput): Promise<string> {
    return this.personalService.createPersonal(input);
  }

  @Mutation(() => PersonalDto, {
    name: 'Agregar_Salario_Fecha',
    description:
      'Esta Función agrega un nuevo salario y una fecha al personal en la base de datos y retorna el documento actualizado',
  })
  async addSalarioFecha(
    @Args('id') id: string,
    @Args('salarioFecha', { type: () => SalarioFechaInput })
    salarioFecha: SalarioFechaInput,
  ): Promise<PersonalDto> {
    return this.personalService.addSalarioFecha(id, salarioFecha);
  }

  @Mutation(() => Boolean, {
    name: 'borrar_Personal',
    description:
      'Esta Función elimina un personal de la base de datos y retorna un booleano indicando si se eliminó correctamente o no',
  })
  async deletePersonal(@Args('id') id: string): Promise<boolean> {
    return this.personalService.deletePersonal(id);
  }

  @Query(() => [PersonalDto], {
    name: 'obtener_Todo_Personal',
    description:
      'Esta Función retorna la información de todo el personal en la base de datos',
  })
  async getAllPersonal(): Promise<PersonalDto[]> {
    return this.personalService.getAllPersonal();
  }

  @Query(() => PersonalDto, {
    name: 'obtener_Personal_Por_Id',
    description: 'Esta Función retorna la información de un personal por su id',
  })
  async getPersonalById(@Args('id') id: string): Promise<PersonalDto> {
    return this.personalService.getPersonalById(id);
  }

  @Subscription(() => [PersonalDto], { name: 'Personal' })
  personalAll() {
    return pubSub.asyncIterator('Personal');
  }

  @Query(() => [PersonalDto], {
    name: 'buscar_Pesonal',
    description:
      'Esta Función retorna la información del personal en base a su nombre',
  })
  async searchPersonal(@Args('nombre') nombre: string): Promise<PersonalDto[]> {
    return this.personalService.searchPersonal(nombre);
  }
}
