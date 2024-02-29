import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Personal, PersonalSchema } from './schemas/personal.schema';
import { PersonalService } from './personal.service';
import { PersonalResolver } from './personal.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Personal.name, schema: PersonalSchema },
    ]),
  ],
  providers: [PersonalService, PersonalResolver],
})
export class PersonalModule {}
