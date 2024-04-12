import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { ReportService } from './report.service';
// Importaciones de seguridad
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { RolesRestGuard } from '../auth/roles-rest.guard';
import { Roles } from '../auth/roles.decorator';
//Necesaria para la interface
import { Request as ExpressRequest } from 'express';

interface UserPayload {
  username: string;
  // Añade aquí cualquier otra propiedad que pueda tener el objeto user
}

interface Request extends ExpressRequest {
  user: UserPayload;
}

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @UseGuards(JwtAuthGuard, RolesRestGuard)
  @Roles('admin', 'cliente')
  @Get()
  async generateReport(
    @Req() req: Request,
    @Query('fechaDesde') fechaDesde: string,
    @Query('fechaHasta') fechaHasta: string,
    @Res() res: Response,
  ) {
    try {
      const username = req.user.username;
      const defaultFechaDesde = new Date('2020-01-01');
      const defaultFechaHasta = new Date('3000-01-01');
      const report = await this.reportService.generateReport2(
        username,
        fechaDesde ? new Date(fechaDesde) : defaultFechaDesde,
        fechaHasta ? new Date(fechaHasta) : defaultFechaHasta,
      );
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=report-${username}.pdf`,
      );
      res.end(report, 'binary');
    } catch (error) {
      res.status(500).send({ message: 'Error generating report' });
    }
  }
}
