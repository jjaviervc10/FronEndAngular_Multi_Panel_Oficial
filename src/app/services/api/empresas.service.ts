import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { dematerialize, Observable } from "rxjs";
import { EmpresaDTO } from "../../models/EmpresaDTO";


@Injectable({
providedIn : 'root'
})
export class EmpresaService{

  private apiUrl = 'http://localhost:8081/empresas';


  constructor(private http: HttpClient){}

  //metodo para obtenr la lista de empresa
  getEmpresas(): Observable<EmpresaDTO[]>{
    return this.http.get<EmpresaDTO[]>(this.apiUrl);
  }

  //actualizar una empresa
  updateEmpresa(idEmpresa: number, empresa: EmpresaDTO): Observable<any>{
    if(empresa.fechaAlta && !(empresa.fechaAlta instanceof Date)){
      empresa.fechaAlta = new Date (empresa.fechaAlta);
      console.log('fechaAlta: ', empresa.fechaAlta);
    }

    if(empresa.fechaServidor && !(empresa.fechaServidor instanceof dematerialize))
{ empresa.fechaServidor = new Date(empresa.fechaServidor);}

    return this.http.put<any>(`${this.apiUrl}/${idEmpresa}`, empresa);
  }


  //Eliminar empresa
  deleteEmpresa(idEmpresa: number): Observable<any>{
    return this.http.delete(`${this.apiUrl}/${idEmpresa}`);
  }
}
