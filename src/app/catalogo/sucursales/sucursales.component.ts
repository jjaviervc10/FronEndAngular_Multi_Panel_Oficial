import { EmpresaService } from './../../services/api/empresas.service';
import { EmpresaDTO } from '../../models/EmpresaDTO';
import { SucursalService } from '../../services/api/sucursales.service';
import { Component, OnInit } from '@angular/core';
import {TableModule} from 'primeng/table';
import { SucursalDTO , crearSucursalDTO} from '../../models/SucursalDTO';
import { ConfirmationService, MessageService  } from 'primeng/api';  // Importa el servicio

// Definir la interfaz para la sucursal
export interface Sucursal {
  idSucursal: number;
  nombreSucursal: string;
  ciudad: string;
  estado: string;
}

@Component({
  selector: 'app-sucursales',
  templateUrl: './sucursales.component.html',
  styleUrl: './sucursales.component.scss',
  providers: [ConfirmationService,MessageService],

})
export class SucursalesComponent implements OnInit{

  empresas: EmpresaDTO[] = []; // Lista de empresas para el dropdown
  sucursales: any[] = [];// Para almacenar las sucursales obtenidas
  selectedSucursal : SucursalDTO | null = null; //Ahora usamos SucucursalDTO
  originalSucursal : SucursalDTO | null = null; // Para almacenar la sucursal antes de la edición
  modifySucursal : SucursalDTO | null = null;// Ahora usamos SucursalDTO

  idSucursal: number = 0;
  dialogVisible: boolean = false;

  //Variable que controla la visualización del Dialogp
  mostrarDialogoSucursal : boolean = false;

  //Cración de instancia apartir de SucursalDTO
  nuevaSucursal: crearSucursalDTO = {
    nombreSucursal: '',
    estado : '',
    ciudad : '',
    activo: true,
    idEmpresa : 0
   };

    // Definimos la propiedad 'target' que se usará en el confirmPopup
    target: any[] = []; // O el tipo adecuado, si tienes un tipo específico
    // Definir las propiedades `message` y `icon`
    message: string = ''; // Aquí se asignará el mensaje que quieres mostrar en el ConfirmPopup
    icon: string = 'pi pi-exclamation-triangle'; // Aquí se asignará el icono

  constructor( private empresaService: EmpresaService,private sucursalService : SucursalService, private confirmationService: ConfirmationService,
    private messageService: MessageService ){ }



  ngOnInit(): void {
    this.sucursalService.getSucursales().subscribe(
      (data) => {
        console.log('Sucursales recibidas:', data);



        //Convertir las fechas de tipo String a Date
      /*  this.sucursales = data.map((sucursal: SucursalDTO)=>{
          return{
            ...sucursal,

            fechaAlta: sucursal.fechaAlta ? new Date(sucursal.fechaAlta): null,// Convertir a date
            fechaBaja: sucursal.fechaBaja ? new Date(sucursal.fechaBaja): null, //Convertir a date si existe
            fechaServidor : sucursal.fechaServidor ? new Date (sucursal.fechaServidor): null //Convertir a date
          };
        });
      },*/

      // Filtrar elementos nulos o inválidos antes de mapear
      this.sucursales = (data || [])
        .filter((sucursal: SucursalDTO | null) => sucursal !== null)
        .map((sucursal: SucursalDTO) => {
          return {
            ...sucursal,
            fechaAlta: sucursal.fechaAlta ? new Date(sucursal.fechaAlta) : null,
            fechaBaja: sucursal.fechaBaja ? new Date(sucursal.fechaBaja) : null,
            fehcaServidor: sucursal.fechaServidor ? new Date(sucursal.fechaServidor) : null
          };
        });
    },

      (error)=> {
        console.error('Error al obtener las sucursales', error);

      }
    );

      this.empresaService.getEmpresas().subscribe({

      next: (data) => {
        this.empresas = data;
      },
        error :(err) =>
          console.error('Error al obtener las empresas', err)
        }
      );
  }


  //Iniciar la edición de la fila
  onRowEditInit(sucursal : SucursalDTO): void{
      this.selectedSucursal = {...sucursal};//Copiar los datos de la sucursal a editar
      this.originalSucursal = {...sucursal};//Guardar el estado original
      this.modifySucursal = {...sucursal};//Copiar los datos de modificación
      console.log('Iniciar edición de sucursl: ', sucursal);

  }


  //Cancelar la edición de la fila y restaurar los valores originales
  onRowEditCancel():void{
    if(this.selectedSucursal && this.originalSucursal){
      //Restaurar los datos originales de la sucursal
      this.selectedSucursal = { ...this.originalSucursal};
      console.log('Edición cancelada, restaurados los datos originales: ', this.selectedSucursal);
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Edición cancelada, restaurados los datos originales',
        life: 2500,  // en milisegundos
        styleClass: 'mi-toast-custom'
      });
    }

  }


  //Guardar los cambios después de la edición
  onRowEditSave(sucursal: SucursalDTO): void{
    if (this.selectedSucursal){
      console.log('Datos editados que se van a guardar: ', sucursal);

      //Verificamos y convertimos las fechas si es necesario al foromato deseado
      if(sucursal.fechaAlta && !(sucursal.fechaAlta  instanceof Date)){
        sucursal.fechaAlta = new Date(sucursal.fechaAlta);
      }

      if(sucursal.fechaBaja && !(sucursal.fechaBaja instanceof Date)){
        sucursal.fechaBaja = new Date(sucursal.fechaBaja);
      }

      if(sucursal.fechaServidor && !(sucursal.fechaServidor instanceof Date)){
        sucursal.fechaServidor = new Date(sucursal.fechaServidor);
      }
      console.log('Datos editados que se van a guardar: ', sucursal);

      //Lla,da al servicio para actualizar la sucursal
      this.sucursalService.updateSucursal(sucursal.idSucursal, sucursal).subscribe(
        (response) =>{
          console.log('Sucursal actualizada en el backend: ', response);

          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Sucursal editada y actualizada',
            life: 2500,  // en milisegundos
            styleClass: 'mi-toast-custom'
         });

          //Aquí buscamos el índice de la empresa seleccionada en la lisya
          const index = this.sucursales.findIndex(suc => suc.idSucursal === sucursal.idSucursal);

          if(index !== -1){
            //Actualizamos la sucursal editada en la lista con los datos nuevos
            this.sucursales[index] = {...sucursal};//Reemplazar la sucursal en la lista con los datos editados

          }
           console.log('Lisa de sucursales actualizada: ', this.sucursales);
           this.selectedSucursal = null;

        },
        (error)=>{
          console.error('Error al actualizar la sucursal: ', error);
        }
      );

    }
  }

   //Método que realiza la eliminación de la sucursal
   eliminarSucursal(idSucursal: number){
    this.sucursalService.deleteSucursal(idSucursal).subscribe(
      (response) => {
        console.log('Sucursal' +  idSucursal + '  eliminada con éxito');
        console.log('Sucursal eliminada en el backend:', response);
        //Aquí se puede actualizar la lista de sucursales depués de la eliminación
        this.sucursales = this.sucursales.filter(suc => suc.idSucursal !== idSucursal);
      },
      (error)=>{
        console.error('Error al eliminar la sucursal: ', error);
      }
    )
  }

  onReject(){
    console.log('Acción de rechazo ejecutada');
    this.dialogVisible = false; //Controlamos la aparición del dialogo
  }

  onAccept(){
    console.log('Confirmación aceptada para eliminar la sucursal con ID: ', this.idSucursal);
    this.eliminarSucursal(this.idSucursal);
  }


  //Función para mostrar el popup de confirmación antes de eliminar
  confirm(event: Event, idSucursal: number): void{
    this.idSucursal = idSucursal; //Guardamos el id de la sucursal seleccionada
    this.message = '¿Estás seguro de elimar esta sucursal?';//Definir el mensaje dinámicamente

    this.confirmationService.confirm({
      target: event.target as EventTarget, //Vincula el evento al popup
      message : this.message, //Usa la propiedad 'message' en el pupup
      icon: this.icon,  //Usa la propiedad 'icon' en el popup
      acceptLabel: 'Sí, eliminar sucursal', //
      rejectLabel: 'No, cancelar eliminación', //

      accept:() => {
        //Acción aceptada: eliminar la sucursal
        this.eliminarSucursal(this.idSucursal);
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Sucursal eliminada con éxito',
          life: 2500,  // en milisegundos
          styleClass: 'mi-toast-custom'
        });
      },
      reject:()=>{
        //Acción rechazada: mostrar mensaje de rechazo
        this.messageService.add({
           severity:'error',
           summary: 'Rechazo',
           detail: 'La acción ha sido rechazada',
           life: 2500,  // en milisegundos
           styleClass: 'mi-toast-custom'
        });;
      }


    });

  }

  abrirDialogo(){
   this.nuevaSucursal = {
      nombreSucursal : '' ,
      estado : '',
      ciudad : '',
      activo: true,
      idEmpresa : 0
    }
    this.mostrarDialogoSucursal = true;
    console.log('Accioón dialog: '+ this.mostrarDialogoSucursal);
  }

  crearSucursal(){
    this.sucursalService.postSucursal(this.nuevaSucursal).subscribe({
      next: () => {
        this.mostrarDialogoSucursal = false;
        //Recargamos tabla de Sucursales para que se muestre en tiempo real la actualización
        this.cargarSucursales();
      }
    });
  }

  cargarSucursales(){
    this.sucursalService.getSucursales().subscribe((data) =>{
      this.sucursales = data;
    });
  }

}
