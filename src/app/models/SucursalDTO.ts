export interface SucursalDTO{
  idSucursal: number;
  nombreSucursal:string;
   ciudad : string;
   estado : string;
   activo: boolean;
   fechaAlta : Date;
   fechaBaja : Date;
   fechaServidor : Date;
   idUsuario : number;
   //Información solo de idEmpresa
  idEmpresa: number;

}

export interface crearSucursalDTO{
  nombreSucursal:string;
   ciudad : string;
   estado : string;
   activo: boolean;
   idEmpresa : number;
}
