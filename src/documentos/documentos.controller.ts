import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Query,
  Get,
  Res,
  Param,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as fs from 'fs';
import { DocumentosService } from './documentos.service';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';

const allowedMimetypes = [
  'application/pdf', // PDF
  'image/jpeg', // JPEG images
  'image/png', // PNG images
  'image/gif', // GIF images
  'image/heic', // HEIC images (iOS)
  'image/heif', // HEIF images (iOS)
];

const fileFilter = (req, file, callback) => {
  if (!allowedMimetypes.includes(file.mimetype)) {
    return callback(new Error('Invalid file type.'), false);
  }
  callback(null, true);
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const path = `./uploads/${req.query.query1}/${req.query.query2}`;
    fs.mkdirSync(path, { recursive: true });
    cb(null, path);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

@Controller('documentos')
export class DocumentosController {
  constructor(private readonly documentosService: DocumentosService) {}

  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'files', maxCount: 20 }], {
      storage,
      fileFilter,
    }),
  )
  async uploadFiles(
    @UploadedFiles() files: { files: Express.Multer.File[] },
    @Query('query1') query1: string,
    @Query('query2') query2: string,
  ) {
    console.log('Files:', files); // Log the files
    console.log('Query1:', query1); // Log the query1
    console.log('Query2:', query2); // Log the query2
    const paths = await this.documentosService.saveFiles(files, query1, query2);
    console.log('Paths:', paths); // Log the paths
  }

  @Get('download/*')
  async getFile(@Res() res: Response, @Param() params: any) {
    const filePath = params[0]; // La ruta completa del archivo se almacena en params[0]
    const path = join(process.cwd(), filePath);
    fs.access(path, fs.constants.F_OK, (err) => {
      if (err) {
        console.error('El archivo no existe');
        res.status(404).send('Archivo no encontrado');
      } else {
        const file = createReadStream(path);
        file.on('error', (err) => {
          console.error('Error al leer el archivo', err);
          res.status(500).send('Error al leer el archivo');
        });
        file.pipe(res);
      }
    });
  }
}
