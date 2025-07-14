import { MessageService, ConfirmationService } from 'primeng/api';
import { Component,OnInit } from '@angular/core';
import { PerfilesService} from '../../services/api/perfiles.service';
import { AccesoDTO} from '../../models/AccesoDTO'
import { PerfilDTO } from '../../models/PerfilDTO';

//Definimos la interfaz para los perfiles
export interface Perfil{
  idPerfil : number;
  nombrePerfil: string;
  descripcionPerfil: string;
}


@Component({
  selector: 'app-perfiles',
  templateUrl: './perfiles.component.html',
  styleUrl: './perfiles.component.scss',
  providers: [ConfirmationService]
})

export class PerfilesComponent  implements OnInit{

  perfiles: any[] = []; //Para almacenar los perfiles obtenidos
  selectedPerfil:Perfil | null = null;
  originalPerfil: Perfil | null = null;
  modifyPerfil: Perfil | null = null;

  //Variables para manejar los accesos
  accesosDisponibles: any [] = []; //Lista para accesos disponibles
  accesosAsignados: any [] = []; //Lista de accesos seleccionados

  target: any [] = [];
  message: string = '';
  icon: string = 'pi pi-exclamation-trinagle';

  dialogVisible: boolean = false;
  dialogoVisible: boolean = false;
  idPerfil: number =0;
  idUsuario: number = 0;

  constructor(private perfilesService: PerfilesService, private confirmationService: ConfirmationService, private messageService: MessageService){}

  ngOnInit(): void {
      this.perfilesService.getPerfiles().subscribe(
        (data) => {
          console.log('Perfiles recibidos: ', data);
          this.perfiles = data;
        },
        (error) => {
          console.error('Error al obtener los perfiles', error);
        }
      );
  }



  //Iniciar edición de la fila

  onRowEditInit(perfil: Perfil): void{
    this.selectedPerfil = {...perfil};//Copiar los datos
    this.originalPerfil = {...perfil};//Guardar estado original
    this.modifyPerfil = {...perfil};//Cpoiar datos modificados
    console.log('Iniciar edición de perfil:', perfil);
  }

  //Cancelar la edición de la fila
  onRowEditCancel():void{
    if(this.selectedPerfil && this.originalPerfil){
      //Restauracion a los datos oriiginales
      this.selectedPerfil = {...this.originalPerfil};
      console.log('Edición cancelada, restaurados los adatos originales:', this.selectedPerfil);
       this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Edición cancelada, restaurados los datos originales',
        life: 2500,  // en milisegundos
        styleClass: 'mi-toast-custom'
      });
    }
  }

 //Guardar los cambios después de la edición
 onRowEditSave(perfil : Perfil): void{
  if(this.selectedPerfil){
    console.log('Datos editados que se guardaran:', perfil);

    //Llamada la servicio para actualizar el perfil
    this.perfilesService.updatePerfil(perfil.idPerfil, perfil).subscribe(
      (response) =>{
        console.log('Perfil actualizado en el backend: ', response);
         this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Perfil actualizado',
          life: 2500,  // en milisegundos
          styleClass: 'mi-toast-custom'
        });

        //Se busca el índice del perfil seleccionado en la lista
        const index = this.perfiles.findIndex(perf => perf.idPerfil === perfil.idPerfil);

        if(index !==-1){
          //Actualización del perfil editado en la lista con los nuevos datos
          this.perfiles[index] = {...perfil};//Actualizacion en la lista con el uevo perfil

        }
        console.log('Lista de perfiles actualizada: ', this.perfiles);
        this.selectedPerfil = null;
      },
       (error) =>{
        console.error('Error al actualizar el Perfil', error);
       }

    );
  }

 }

  //Método que realiza la eliminación de un perfil
eliminarPerfil(idPerfil:number){
  this.perfilesService.deletePerfil(idPerfil).subscribe(
    (response) =>{
      console.log('Perfil '+ idPerfil + ' eliminado con éxito');
      console.log('Perfil eliminado en el backend:', response);

      //Actualizamos la lista de perfiles después de la eliminación
      this.perfiles = this.perfiles.filter(perf => perf.idPerfil !== idPerfil);
    },
    (error)=>{
      console.log('Error al eliminar el perfil:', error);
    }
  )
}


  onReject() {
  console.log('Acción de rechazo ejecutada');
  this.dialogVisible = false;  // Aquí puedes controlar si quieres ocultar el diálogo
}
onAccept() {
  console.log('Confirmación aceptada para eliminar la empresa con ID:', this.idPerfil);
  this.eliminarPerfil(this.idPerfil);
}

//Función para mostrar el popup de confirmación antes de eliminar
confirm(event: Event, idPerfil: number): void{

  this.idPerfil = idPerfil;//Guardamos el id del perfil seleccionado
 this.message = '¿Estas seguro de eliminar este perfil?'; //Definir el mensaje dinámicamente

  this.confirmationService.confirm({
    target: event.target as EventTarget,// Vincula el evento al popup
    message: this.message, //Usal la propiedad
    icon: this.icon,
    acceptLabel: 'Sí, eliminar perfil',
    rejectLabel: 'No, cancelar eliminación',
    accept:() => {
      //Acción aceptada: eliminar perfil
      this.eliminarPerfil(idPerfil);
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Perfil eliminado con éxito',
        life: 2500,  // en milisegundos
        styleClass: 'mi-toast-custom'
      });
    },
    reject:()=>{
      //Acción rechazada mostrar mensaje de rechazo
      this.messageService.add({
        severity:'error',
        summary: 'Rechazado',
        detail: 'La acción ga sido rechazada',
        life: 2500,  // en milisegundos
        styleClass: 'mi-toast-custom'
      });
    }
  });
}

 // Método para mostrar el diálogo y obtener los accesos disponibles
 mostrarDialogo(idPerfil: number): void {
  this.idPerfil = idPerfil;
  // Usar el idPerfil para obtener los accesos disponibles para ese perfil
  this.perfilesService.getAccesosDisponibles(idPerfil).subscribe(
    (accesos: AccesoDTO[]) => {
      console.log('Accesos disponibles:', accesos);
       console.log('Accesos disponibles para perfil :', idPerfil);
      // Transformar los accesos al formato esperado para el pickList
      this.accesosDisponibles = accesos.map(acceso => ({
        label: acceso.nombreAcceso,  // Nombre del acceso
        value: acceso.idAcceso      // Id de acceso
      }));

      // Verificar si los accesosDisponibles están correctamente llenos
      console.log('Accesos transformados:', this.accesosDisponibles);
    },
    (error) => {
      console.error('Error al obtener los accesos', error);
    }
  );

  this.perfilesService.getAccesosAsignados(idPerfil).subscribe(
    (accesosAsignado : AccesoDTO[]) =>{
      console.log('Accesos asiganados para Perfil : ' + idPerfil, accesosAsignado);

      //Transformar los accesosAsignados al formato esperado para la pickList
      this.accesosAsignados = accesosAsignado.map(accesoAsignado =>({
           label: accesoAsignado.nombreAcceso, //Nombre del acceso
           value: accesoAsignado.idAcceso //Id acceso

      }));

      //Se verifica si los accesosAsignados están correctamente llenos
      console.log('AccesosAsignads transformados: ', this.accesosAsignados);
    },
    (error) => {
      console.error('Error al obtener los accesos', error);
    }
  )

  // Abrir el diálogo
  this.dialogoVisible = true;
}


 /*onChange(event:any){
  //Desmarcar los items seleccionados en ambas listas cuando se mueven

  console.log('Elementos cambiados:' , event);
 }*/

 onChange(event: any): void {
  this.idUsuario = 5;

  const nuevosIds = event.target.map((a: any) => a.value); // target = accesos asignados actualizados

  this.perfilesService.updateAccesosAsignados(this.idPerfil, nuevosIds, this.idUsuario).subscribe(
    () => {
      console.log('Accesos actualizados correctamente', nuevosIds);
    },
    (error) => {
      console.error('Error al actualizar accesos', error);
    }
  );
}


 // Método que se llama cuando un acceso se mueve a la lista de disponibles (Source)
 onMoveToSource(event: any): void {
  const accesosMovidos = event.items; // Los accesos que se movieron
  const idsAccesos = accesosMovidos.map((acceso: any) => acceso.value);

  this.idUsuario = 5;


  this.perfilesService.updateAccesosAsignados(this.idPerfil, this.accesosAsignados.map(a => a.value), this.idUsuario).subscribe(
    () => {
      console.log('idPerfil: '+ this.idPerfil + '.  Accesos Verificacion actualizados correctamente al mover a la lista de disponibles ', this.accesosDisponibles);
      console.log('idPerfil: '+ this.idPerfil + '.  Accesos actualizados correctamente al mover a la lista de disponibles ', accesosMovidos);
    },
    (error) => {
      console.error('Error al actualizar accesos al mover a la lista de disponibles', error);
    }
  );
}

// Método que se llama cuando un acceso se mueve a la lista de asignados (Target)
onMoveToTarget(event: any): void {
  const accesosMovidos = event.items; // Los accesos que se movieron
  const idsAccesos = accesosMovidos.map((acceso: any) => acceso.value);

  this.idUsuario = 5;

  this.perfilesService.updateAccesosAsignados(this.idPerfil, this.accesosAsignados.map(a => a.value), this.idUsuario).subscribe(
    () => {
      console.log('idPerfil: '+ this.idPerfil + '.  Accesos Verificacion actualizados correctamente al mover a la lista de asignados ', this.accesosAsignados);
      console.log('idPerfil: '+ this.idPerfil + '.  Accesos actualizados correctamente al mover a la lista de asignados ', accesosMovidos);
    },
    (error) => {
      console.error('Error al actualizar accesos al mover a la lista de asignados', error);
    }
  );
}
/*onMoveToSource(event: any){
  console.log('Lista Source Perfiles: ', this.accesosDisponibles);
  console.log('Elementos cambiados de Target a Source: ' + event + 'para el idPerfil: ' + this.idPerfil)
}

onMoveToTarget(event: any){
  console.log('Lista Target Perfiles ', this.accesosAsignados);
  console.log('Elementos cambiados de Source a Target: ' + event + 'para el idPerfil: ' + this.idPerfil);
}
*/
 hoverItem(event: MouseEvent) {
  const target = event.target as HTMLElement;
  target.style.backgroundColor = '#cc0000'; // Cambia el fondo cuando el mouse pasa
}

removeHover(event: MouseEvent) {
  const target = event.target as HTMLElement;
  target.style.backgroundColor = ''; // Restaura el color de fondo cuando el mouse sale
}

 // Método que permite alternar la selección
 toggleSelection(item: any) {
  item.selected = !item.selected;
}

}
