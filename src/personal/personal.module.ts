import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Personal, PersonalSchema } from './schemas/personal.schema';
import { PersonalService } from './personal.service';
import { PersonalResolver } from './personal.resolver';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    MongooseModule.forFeature([
      { name: Personal.name, schema: PersonalSchema },
    ]),
  ],
  providers: [PersonalService, PersonalResolver],
  exports: [PersonalService],
})
export class PersonalModule {}
