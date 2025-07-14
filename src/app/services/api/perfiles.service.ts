import {Injectable} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { PerfilDTO } from "../../models/PerfilDTO";
//import { Perfil } from


@Injectable({providedIn : 'root'})
export class PerfilesService{
  private apiUrl = 'http://localhost:9091/perfiles';
  private accesosDisponiblesUrl= 'http://localhost:9091/rperfilaccesos/accesosDisponibles'
  private accesosAsignadosUrl= 'http://localhost:9091/rperfilaccesos/accesosAsignados'
 private updateRPAccesosUrl = 'http://localhost:9091/rperfilaccesos/updateAccesos';

  constructor (private http: HttpClient){}

  //Método para obtener la lista de perfies
  getPerfiles(): Observable<PerfilDTO[]>{
    return this.http.get<PerfilDTO[]>(this.apiUrl);
  }

  //Eliminar Perfil
deletePerfil(idPerfil: number): Observable<any>{
  return this.http.delete(`${this.apiUrl}/${idPerfil}`);
}

// Método para actualizar un perfil existente
  updatePerfil(id: number, perfil: PerfilDTO): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, perfil);
  }

  //Obtener accesos accesos Disponibles
  getAccesosDisponibles(idPerfil: number): Observable<any>{
    return this.http.get<PerfilDTO[]>(`${this.accesosDisponiblesUrl}/${idPerfil}`)

  }


  //Obtener accesos Asignados
  getAccesosAsignados(idPerfil: number) : Observable<any>{
    return this.http.get<PerfilDTO[]>(`${this.accesosAsignadosUrl}/${idPerfil}`)
  }

  //Actualizamos cada que se presente el evento de asiganacion/desasignacion de un accesos a un perfil especifico
    updateAccesosAsignados(idPerfil: number, accesosAsignados: number[], idUsuario: number): Observable<void> {
 // const headers = new HttpHeaders().set('Content-Type', 'application/json');

   const body = {
    idUsuario,
    accesosAsignados
  };
  console.log('Datos que se enviarán: ', accesosAsignados); // Verifica los datos antes de enviar
  return this.http.put<void>(`${this.updateRPAccesosUrl}/${idPerfil}`, body);

}


}

