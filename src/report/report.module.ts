import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { CarsModule } from 'src/cars/cars.module';
import { UsersModule } from 'src/users/users.module';
import { MantenimientosModule } from 'src/mantenimientos/mantenimientos.module';
import { ReportController } from './report.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, CarsModule, UsersModule, MantenimientosModule],
  providers: [ReportService],
  controllers: [ReportController],
})
export class ReportModule {}
