export interface MantenimientoInfo {
  id: string;
  fecha: Date;
  tipo: string;
  repuestosUsados: number;
}

export interface CarInfoDto {
  id: string;
  placa: string;
  fechaSoat: Date;
  vigenciaContrato: Date;
  cliente: string;
  tipoContrato: string;
  propietario: string;
  kmActual: number;
  kmRegistroInicial: number;
  Puntaje: number;
  Mantenimientos: MantenimientoInfo[];
}
