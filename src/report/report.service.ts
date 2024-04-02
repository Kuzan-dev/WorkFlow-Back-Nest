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

      // Codigo que si funca
      const docDefinition = {
        content: [
          {
            columns: [
              {
                image:
                  'data:image/png;base64,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',
                width: 80,
              },
              [
                {
                  text: 'Informe de Mantenimiento \n Vehicular',
                  color: '#000000',
                  width: '*',
                  fontSize: 25,
                  bold: true,
                  alignment: 'right',
                  margin: [0, 0, 0, 15],
                },
                {
                  stack: [
                    {
                      columns: [
                        {
                          text: [
                            { text: 'Fecha: ', bold: true, color: '#3169B1' },
                            {
                              text: '24/03/2024',
                              bold: true,
                              color: '#3169B1',
                            },
                          ],
                          alignment: 'right',
                        },
                      ],
                    },
                  ],
                },
              ],
            ],
          },
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
        const fechaRevi = car.fechaRevision
          ? car.fechaSoat.toLocaleDateString()
          : 'No disponible';

        return [
          {
            text: `Datos del Vehículo`,
            color: '#000000',
            bold: true,
            fontSize: 18,
            alignment: 'left',
            margin: [0, 10, 0, 10],
          },
          {
            columns: [
              {
                text: [
                  { text: 'Vigencia del SOAT:' },
                  { text: ` ${fechaSoat}` },
                ],
                alignment: 'left',
                margin: [0, 10, 0, 10],
              },
              {
                text: [
                  { text: 'Placa: ' },
                  { text: ` ${mantenimiento.placa}` },
                ],
                alignment: 'left',
                margin: [0, 10, 0, 10],
              },
            ],
          },
          {
            columns: [
              {
                text: [
                  { text: 'Kilometraje Actual: ' },
                  { text: ` ${car.kmActual} km` },
                ],
                alignment: 'left',
                margin: [0, 5, 0, 10],
              },
              {
                text: [
                  { text: 'Ultima Revision: ' },
                  { text: ` ${fechaRevi}` },
                ],
                alignment: 'left',
                margin: [0, 5, 0, 10],
              },
            ],
          },
          '\n\n',
          {
            width: '100%',
            alignment: 'left',
            text: 'Detalles de Mantenimiento:',
            bold: true,
            margin: [0, 0, 0, 10],
            fontSize: 15,
          },
          {
            width: '100%',
            alignment: 'left',
            text: 'Mantenimientos obtenidos:',
            margin: [0, 0, 0, 10],
            fontSize: 12,
          },
          this.createTable(mantenimientosPlaca), // Pasa los mantenimientos para esta placa a createTable
        ];
      }),
    );
  }

  createTable(mantenimientos) {
    // Primero, definimos la fila de encabezado
    const header = [
      {
        text: 'Placa',
        fillColor: '#eaf2f5',
        border: [false, true, false, true],
        margin: [0, 5, 0, 5],
        textTransform: 'uppercase',
      },
      {
        text: 'Fecha Inicio',
        fillColor: '#eaf2f5',
        border: [false, true, false, true],
        margin: [0, 5, 0, 5],
        textTransform: 'uppercase',
      },
      {
        text: 'Fecha Termino',
        fillColor: '#eaf2f5',
        border: [false, true, false, true],
        margin: [0, 5, 0, 5],
        textTransform: 'uppercase',
      },
      {
        text: 'Tipo de Mantenimiento',
        fillColor: '#eaf2f5',
        border: [false, true, false, true],
        margin: [0, 5, 0, 5],
        textTransform: 'uppercase',
      },
      {
        text: 'Repuestos Usados',
        fillColor: '#eaf2f5',
        border: [false, true, false, true],
        margin: [0, 5, 0, 5],
        textTransform: 'uppercase',
      },
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

      return [
        {
          text: placa,
          border: [false, false, false, true],
          margin: [0, 5, 0, 5],
          alignment: 'left',
        },
        {
          text: fechaInicio,
          border: [false, false, false, true],
          alignment: 'right',
          margin: [0, 5, 0, 5],
        },
        {
          text: fechaFin,
          border: [false, false, false, true],
          alignment: 'right',
          margin: [0, 5, 0, 5],
        },
        {
          text: tipo,
          border: [false, false, false, true],
          alignment: 'right',
          margin: [0, 5, 0, 5],
        },
        {
          text: repuestos,
          border: [false, false, false, true],
          alignment: 'right',
          margin: [0, 5, 0, 5],
        },
      ];
    });

    // Finalmente, devolvemos la tabla completa
    return {
      layout: {
        defaultBorder: false,
        hLineWidth: function () {
          return 1;
        },
        vLineWidth: function () {
          return 1;
        },
        hLineColor: function (i) {
          if (i === 1 || i === 0) {
            return '#bfdde8';
          }
          return '#eaeaea';
        },
        vLineColor: function () {
          return '#eaeaea';
        },
        hLineStyle: function () {
          return null;
        },
        paddingLeft: function () {
          return 10;
        },
        paddingRight: function () {
          return 10;
        },
        paddingTop: function () {
          return 2;
        },
        paddingBottom: function () {
          return 2;
        },
        fillColor: function () {
          return '#fff';
        },
      },
      table: {
        headerRows: 1,
        widths: [50, 65, 65, 85, 140],
        heights: 18,
        body: [header, ...body],
      },
    };
  }
}
