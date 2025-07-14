import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { dematerialize, Observable } from "rxjs";
import { EmpresaDTO , crearEmpresaDTO} from "../../models/EmpresaDTO";


@Injectable({
providedIn : 'root'
})
export class EmpresaService{

  private apiUrl = 'https://demobackendspringboot-production.up.railway.app/empresas';
 // private apiUrl = 'http://localhost:9091/empresas';


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

  //Crear una empresa
  postEmpresa(empresa: crearEmpresaDTO): Observable<any> {
    return this.http.post<any>(this.apiUrl, empresa);
  }


  //Eliminar empresa
  deleteEmpresa(idEmpresa: number): Observable<any>{
    return this.http.delete(`${this.apiUrl}/${idEmpresa}`);
  }
}
