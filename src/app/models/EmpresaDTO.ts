export interface EmpresaDTO{
  idEmpresa: number;
  nombreEmpresa: string;
  claveEmpresa: string;
  activo : boolean;
  fechaAlta: Date;
  fechaBaja: Date | null;
  fechaServidor: Date;
  idUsuario:number;

}
