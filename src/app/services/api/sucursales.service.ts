import {Injectable} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { dematerialize, Observable } from "rxjs";
import { SucursalDTO , crearSucursalDTO} from "../../models/SucursalDTO";

@Injectable({
  providedIn : 'root'
})
export class SucursalService{
  private apiUrl = 'http://localhost:9091/sucursales';

  constructor(private http: HttpClient){}

  //Obtener la lista de sucursal
  getSucursales(): Observable<SucursalDTO[]>{
    return this.http.get<SucursalDTO[]>(this.apiUrl);
  }

  //Método para actualizar una sucursal
  updateSucursal(idSucursal: number, sucursal: SucursalDTO): Observable<any>{
    if(sucursal.fechaAlta && !(sucursal.fechaAlta instanceof Date)){
      sucursal.fechaAlta = new Date(sucursal.fechaAlta);
      console.log('fechaAlta: ', sucursal.fechaAlta);
    }

    if(sucursal.fechaServidor && !(sucursal.fechaServidor instanceof Date)){
      sucursal.fechaServidor = new Date(sucursal.fechaServidor);
    }

   return this.http.put<any>(`${this.apiUrl}/${idSucursal}`, sucursal);
  }

  //Eliminar sucursal
  deleteSucursal(idSucursal:number):Observable<any>{
    return this.http.delete(`${this.apiUrl}/${idSucursal}`);
  }

  //Crear Sucursal
  postSucursal(sucursal: crearSucursalDTO): Observable<any>{
    return this.http.post<any>(this.apiUrl, sucursal);
  }
}
