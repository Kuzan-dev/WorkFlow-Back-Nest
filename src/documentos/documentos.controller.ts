import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Query,
  Get,
  Res,
  Param,
  Delete,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as fs from 'fs';
import { DocumentosService } from './documentos.service';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';

// Importaciones de seguridad
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { RolesRestGuard } from '../auth/roles-rest.guard';
import { Roles } from '../auth/roles.decorator';
import * as mimeTypes from 'mime-types';

const allowedMimetypes = [
  'application/pdf', // PDF
  'image/jpeg', // JPEG images
  'image/png', // PNG images
  'image/gif', // GIF images
  'image/heic', // HEIC images (iOS)
  'image/heif', // HEIF images (iOS)
  'application/msword', // Word 2003 and earlier
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // Word 2007 and later
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

  @UseGuards(JwtAuthGuard, RolesRestGuard)
  @Roles('admin', 'tecnico')
  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'files', maxCount: 20 }], {
      storage,
      fileFilter,
      limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
    }),
  )
  async uploadFiles(
    @UploadedFiles() files: { files: Express.Multer.File[] },
    @Query('query1') query1: string,
    @Query('query2') query2: string,
    @Res() res: Response,
  ) {
    try {
      console.log('Files:', files); // Log the files
      console.log('Query1:', query1); // Log the query1
      console.log('Query2:', query2); // Log the query2
      const paths = await this.documentosService.saveFiles(
        files,
        query1,
        query2,
      );
      console.log('Paths:', paths); // Log the paths
      res.status(200).send('Archivo subido con éxito');
    } catch (error) {
      console.error('Error subiendo archivos:', error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard, RolesRestGuard)
  @Roles('admin', 'tecnico', 'cliente')
  @Get('download/*')
  async getFile(@Res() res: Response, @Param() params: any) {
    try {
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
          res.type(mimeTypes.lookup(path));
          file.pipe(res);
          res.status(200).send('Archivo descargado con éxito');
        }
      });
    } catch (error) {
      console.error('Error descargando archivos:', error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard, RolesRestGuard)
  @Roles('admin', 'tecnico')
  @Delete('delete/*')
  async deleteFile(@Res() res: Response, @Param() params: any) {
    try {
      const filePath = params[0]; // La ruta completa del archivo se almacena en params[0]
      const path = join(process.cwd(), filePath);
      fs.unlink(path, (err) => {
        if (err) {
          console.error('Error al eliminar el archivo', err);
          res.status(500).send('Error al eliminar el archivo');
        } else {
          res.send('Archivo eliminado con éxito');
        }
      });
      const parts = filePath.split('/');
      const query1 = parts[1];
      const query2 = parts[2];
      await this.documentosService.deleteFileReference(
        query1,
        query2,
        filePath,
      );
    } catch (error) {
      console.error('Error eliminando archivos:', error);
      throw error;
    }
  }
}
