import {
  Args,
  Mutation,
  Resolver,
  Query,
  Subscription,
  Int,
} from '@nestjs/graphql';
import { PersonalService } from './personal.service';
import { SalarioFechaInput } from './dto/create-personal.input';
import { PersonalDto } from './dto/create-personal.dto';
import { pubSub } from 'src/shared/pubsub';
import { UsersService } from 'src/users/users.service';
import { PersonalUserInput } from './dto/create-personalUser.dto';
import { UpdatePersonalInput } from './dto/update-personal.dto';
import { PersonalResult } from './dto/search-personal.dto';

@Resolver()
export class PersonalResolver {
  constructor(
    private readonly personalService: PersonalService,
    private userService: UsersService,
  ) {}

  @Mutation(() => String, {
    name: 'crear_Personal',
    description:
      'Esta Función registra un nuevo persoanl en la base de datos y retorna el id del documento creado',
  })
  async createPersonal(
    @Args('input') input: PersonalUserInput,
  ): Promise<string> {
    if (!input.user || input.user === null) {
      return 'faltaUser';
    }
    const personalInfo = await this.personalService.createPersonal(
      input.personal,
    );
    await this.userService.create(input.user);
    return personalInfo;
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

  @Query(() => PersonalResult, {
    name: 'buscar_Pesonal',
    description:
      'Esta función retorna la información del personal en base a su nombre',
  })
  async searchPersonal(
    @Args('nombre') nombre: string,
    @Args('page', { type: () => Int, nullable: true }) page: number,
  ): Promise<PersonalResult> {
    return this.personalService.searchPersonal(nombre, page);
  }

  @Mutation(() => Boolean, {
    name: 'actualizar_Info_Personal',
    description:
      'Esta función actualiza uno o mas parametros de un personal en la base de datos',
  })
  async updateInfoPersonal(
    @Args('id') id: string,
    @Args('input', { type: () => UpdatePersonalInput })
    input: Partial<UpdatePersonalInput>,
    @Args('salarioFecha', { type: () => SalarioFechaInput, nullable: true })
    salarioFecha?: SalarioFechaInput,
  ): Promise<boolean> {
    await this.personalService.updateInfoPersonal(id, input);
    if (salarioFecha) {
      await this.personalService.addSalarioFecha(id, salarioFecha);
    }
    return true;
  }
}
