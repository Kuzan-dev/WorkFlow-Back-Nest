import { Injectable } from '@nestjs/common';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { CarsService } from 'src/cars/cars.service';
import { UsersService } from 'src/users/users.service';
import { MantenimientosService } from 'src/mantenimientos/mantenimientos.service';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable()
export class ReportService {
  constructor(
    private readonly carsService: CarsService,
    private readonly userService: UsersService,
    private readonly mantenimientoService: MantenimientosService,
  ) {}

  async generateReport2(
    username: string,
    fechaDesde: Date,
    fechaHasta: Date,
  ): Promise<Buffer> {
    try {
      // Obtén el usuario por su nombre de usuario
      const cliente = await this.userService.findClientByUsername(username);

      // Si el usuario no existe, lanza un error
      if (!cliente) {
        throw new Error('Cliente no encontrado');
      }

      const placas = await this.carsService.findPlatesByClient(cliente);

      // Si no hay placas lanza un error
      if (!placas) {
        throw new Error('Cliente no encontrado');
      }

      // Obtén los mantenimientos para las placas en el rango de fechas especificado
      const mantenimientos =
        await this.mantenimientoService.findByPlatesAndDateRange(
          placas,
          fechaDesde,
          fechaHasta,
        );

      // Genera las secciones del informe
      const sections = (
        await this.createSections(placas, mantenimientos)
      ).flat();

      // Resto del código
      const docDefinition = {
        content: [
          { text: 'Informe de Mantenimiento Vehicular', style: 'header' },
          ...sections,
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 2], // Margen inferior de 2
          },
          subheader: {
            fontSize: 14,
            bold: true,
            margin: [0, 10, 0, 5], // Margen inferior de 5
          },
          textin: {
            fontSize: 12,
            margin: [0, 0, 0, 4], // Margen derecho de 4
          },
        },
      };

      console.log(JSON.stringify(docDefinition, null, 2));
      const pdfDocGenerator = pdfMake.createPdf(docDefinition);
      return new Promise((resolve, reject) => {
        pdfDocGenerator.getBuffer((buffer) => {
          if (buffer) {
            resolve(buffer);
          } else {
            reject(new Error('Error generating PDF'));
          }
        });
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createSections(placas, mantenimientos) {
    return Promise.all(
      placas.map(async (placa) => {
        // Encuentra los mantenimientos para esta placa
        const mantenimientosPlaca = mantenimientos.filter(
          (m) => m.placa === placa,
        );

        // Si no hay mantenimientos para esta placa, devuelve una sección vacía
        if (mantenimientosPlaca.length === 0) {
          return [{ text: '' }];
        }

        // Usa el primer mantenimiento para obtener la información que es común a todos los mantenimientos
        const mantenimiento = mantenimientosPlaca[0];

        // Obtén el coche y el cliente
        const car = await this.carsService.getCarInfo(placa);
        const fechaSoat = car.fechaSoat
          ? car.fechaSoat.toLocaleDateString()
          : 'No disponible';

        return [
          {
            text: `Placa del Vehículo: ${mantenimiento.placa}`,
            style: 'subheader',
          },
          {
            text: [
              { text: 'Vigencia SOAT: ', style: 'textin', bold: true },
              `${fechaSoat}\n`,
              { text: 'Kilometraje Actual: ', style: 'textin', bold: true },
              `${car.kmActual} km\n`,
              { text: 'Detalles de Mantenimiento:', style: 'subheader' },
            ],
            lineHeight: 1.5, // Ajuste de interlineado
          },
          this.createTable(mantenimientosPlaca), // Pasa los mantenimientos para esta placa a createTable
        ];
      }),
    );
  }

  createTable(mantenimientos) {
    // Primero, definimos la fila de encabezado
    const header = [
      'Placa',
      'Fecha Inicio',
      'Fecha Termino',
      'Tipo de Mantenimiento',
      'Repuestos Usados',
    ];

    // Luego, mapeamos los mantenimientos a filas de la tabla
    const body = mantenimientos.map((mantenimiento) => {
      // Asegúrate de que todas las propiedades existen antes de acceder a ellas
      const placa = mantenimiento.placa || '';
      const fechaInicio = mantenimiento.fechaInicio
        ? mantenimiento.fechaInicio.toLocaleDateString()
        : 'No disponible';
      const fechaFin = mantenimiento.fechaFin
        ? mantenimiento.fechaFin.toLocaleDateString()
        : 'No disponible';
      const tipo = mantenimiento.tipo || '';
      const repuestos = mantenimiento.repuestos
        ? mantenimiento.repuestosAjuste
            .map(
              (repuesto) =>
                `${repuesto.producto}-${repuesto.marca} (${repuesto.cantidad})`,
            )
            .join(', ')
        : '';

      // Imprime la fila antes de devolverla
      console.log([placa, fechaInicio, fechaFin, tipo, repuestos]);

      return [placa, fechaInicio, fechaFin, tipo, repuestos];
    });

    // Finalmente, devolvemos la tabla completa
    return {
      table: {
        headerRows: 1,
        widths: [50, 80, 80, 130, 140],
        heights: 18,
        body: [header, ...body],
      },
    };
  }
}
