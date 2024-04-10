import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import * as moment from 'moment';
import { exec } from 'child_process';
import * as fs from 'fs';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { Mantenimiento } from '../mantenimientos/schemas/mantenimiento.schema';
import * as credentials from '../../keyfile.json';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectModel(Mantenimiento.name)
    private mantenimientoModel: Model<Mantenimiento>,
  ) {}

  @Cron('0 * * * *') // Se ejecutara el minuto 0 de cada hora de cada día
  async handleCron() {
    this.logger.debug('El cron job se ejecuto');

    // Buscar todos los mantenimientos ESTADO = programados
    const mantenimientos = await this.mantenimientoModel
      .find({ estado: 'programado' })
      .exec();
    // Iterar sobre los mantenimientos
    mantenimientos.forEach(async (mantenimiento) => {
      const fechaProgramada = moment(mantenimiento.fecha);
      const now = moment();
      // Si la fecha programada es menor a la fecha actual
      if (now.diff(fechaProgramada, 'hours') > 24) {
        mantenimiento.estado = 'expirado';
        await mantenimiento.save();
      }
    });
  }

  @Cron(CronExpression.EVERY_10_MINUTES) // Se ejecutara el primer día de cada mes a la medianoche
  async handleBackupCron() {
    this.logger.debug('El cron job de copia de seguridad se ejecutó');

    // Realizar una copia de seguridad de la base de datos
    exec(
      'mongodump --out /backups/mongodump-$(date +%Y-%m-%d)',
      async (error, stdout, stderr) => {
        if (error) {
          this.logger.error(
            `Error al realizar la copia de seguridad de la base de datos: ${error}`,
          );
          return;
        }

        this.logger.debug(
          'Copia de seguridad de la base de datos realizada con éxito',
        );

        const { client_id, client_secret, redirect_uris } = credentials.web;

        const client = new OAuth2Client(
          client_id,
          client_secret,
          redirect_uris[0],
        );

        const drive = google.drive({
          version: 'v3',
          auth: client,
        });
        // Subir la copia de seguridad a Google Drive
        const fileMetadata = {
          name: 'mongodump-$(date +%Y-%m-%d)',
          parents: ['11KbYsZbRrzuGCiCmj-UJWEUcJkhwPte1'],
        };
        const media = {
          mimeType: 'application/gzip',
          body: fs.createReadStream(
            `/backups/mongodump-$(date +%Y-%m-%d).tar.gz`,
          ),
        };
        drive.files.create(
          {
            requestBody: fileMetadata,
            media: media,
            fields: 'id',
          },
          (err, file) => {
            if (err) {
              this.logger.error(
                `Error al subir la copia de seguridad a Google Drive: ${err}`,
              );
              return;
            }

            this.logger.debug(
              'Copia de seguridad subida a Google Drive con éxito',
            );
          },
        );
      },
    );
  }
}
