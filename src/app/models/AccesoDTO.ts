export interface AccesoDTO{
  idAcceso : number;
  nombreAcceso: string;
  orden: number;
  activo: boolean;
  idModulo : number | null;
  idAplicacion : number | null;
}
