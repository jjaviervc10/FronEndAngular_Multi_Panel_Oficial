import { Component , OnInit} from '@angular/core';
import { EmpresaService } from '../../services/api/empresas.service';
import { EmpresaDTO , crearEmpresaDTO} from '../../models/EmpresaDTO';
import { ConfirmationService, MessageService} from 'primeng/api';
@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrl: './empresas.component.scss'
})
export class EmpresasComponent implements OnInit{

 // nuevaEmpresa: EmpresaDTO[] = [];
  empresas: any[] = [];  // Para almacenar las empresas obtenidas de la API
  selectedEmpresa: EmpresaDTO | null = null; // Ahora usa EmpresaDTO
  originalEmpresa: EmpresaDTO | null = null;  // Para almacenar la empresa original antes de la edición
  modifyEmpresa: EmpresaDTO | null = null;  // Ahora usar EmpresaDTO


  //Variable para controlar la visión del dialogo
  mostrarDialogoEmpresa : boolean = false;

  //Creacion de instancia apartir de EmpresaDTO

  nuevaEmpresa: crearEmpresaDTO={
    claveEmpresa : '',
    nombreEmpresa : '',
    activo: true,
    idUsuario: 0
  };

   // Variable para mostrar el confirm dialog
   displayConfirmation: boolean = false;
   dialogVisible: boolean = false;
   idEmpresa: number = 0;
   // Definimos la propiedad 'target' que se usará en el confirmPopup
   target: any[] = []; // O el tipo adecuado, si tienes un tipo específico
   // Definir las propiedades `message` y `icon`
   message: string = ''; // Aquí se asignará el mensaje que quieres mostrar en el ConfirmPopup
   icon: string = 'pi pi-exclamation-triangle'; // Aquí se asignará el icono

    // Inyecta el servicio de confirmación
  constructor(private empresaService: EmpresaService, private confirmationService: ConfirmationService,private messageService: MessageService) { }

    ngOnInit(): void {
      this.empresaService.getEmpresas().subscribe(
        (data) => {
          console.log('Empresas recibidas:', data);

          // Convertir las fechas de tipo string a Date
          this.empresas = data.map((empresa: EmpresaDTO) => {
            return {
              ...empresa,
              fechaAlta: empresa.fechaAlta ? new Date(empresa.fechaAlta) : null, // Convertir a Date
              fechaBaja: empresa.fechaBaja ? new Date(empresa.fechaBaja) : null,   // Convertir a Date si existe
              fechaServidor: empresa.fechaServidor ? new Date(empresa.fechaServidor) : null // Convertir a Date
            };
          });
        },
        (error) => {
          console.error('Error al obtener las empresas', error);
        }
      );
    }


    // Iniciar la edición de la fila
    onRowEditInit(empresa: EmpresaDTO): void {
        this.selectedEmpresa = { ...empresa }; // Copiar los datos de la empresa para editar
        this.originalEmpresa = { ...empresa }; // Guardar el estado original
        this.modifyEmpresa = { ...empresa };  // Copiar los datos para modificación
        console.log('Iniciar edición de empresa:', empresa);
    }

  // Cancelar la edición de la fila y restaurar los valores originales
  onRowEditCancel(): void {
    if (this.selectedEmpresa && this.originalEmpresa) {
      // Restaurar los datos originales de la empresa
      this.selectedEmpresa = { ...this.originalEmpresa };
      console.log('Edición cancelada, restaurados los datos originales:', this.selectedEmpresa);
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Edición cancelada, restaurados los datos originales',
        life: 2500,  // en milisegundos
        styleClass: 'mi-toast-custom'
      });
    }
  }

  // Guardar los cambios después de la edición
  onRowEditSave(empresa: EmpresaDTO): void {
    if (this.selectedEmpresa) {

      // Verificar y convertir las fechas si es necesario
      if (empresa.fechaAlta && !(empresa.fechaAlta instanceof Date)) {
        empresa.fechaAlta = new Date(empresa.fechaAlta);
      }
      if (empresa.fechaBaja && !(empresa.fechaBaja instanceof Date) && empresa.fechaBaja !== null) {
        empresa.fechaBaja = new Date(empresa.fechaBaja);
      }
      if (empresa.fechaServidor && !(empresa.fechaServidor instanceof Date)) {
        empresa.fechaServidor = new Date(empresa.fechaServidor);
      }

      console.log('Datos editados que se van a guardar:', empresa);

      // Llamada al servicio para actualizar la empresa
      this.empresaService.updateEmpresa(empresa.idEmpresa, empresa).subscribe(
        (response) => {
          console.log('Empresa actualizada en el backend:', response);
          this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Empresa actualizada',
          life: 2500,  // en milisegundos
          styleClass: 'mi-toast-custom'
        });
          // Aquí buscamos el índice de la empresa seleccionada en la lista
          const index = this.empresas.findIndex(emp => emp.idEmpresa === empresa.idEmpresa);

          if (index !== -1) {
            // Actualizamos la empresa editada en la lista con los datos nuevos
            this.empresas[index] = { ...empresa };  // Reemplazar la empresa en la lista con los datos editados
          }

          console.log('Lista de empresas actualizada:', this.empresas);
          this.selectedEmpresa = null;
        },
        (error) => {
          console.error('Error al actualizar la empresa:', error);
          this.messageService.add({
          severity: 'warn',
          summary: 'Advertencia',
          detail: 'No se actualizo la empresa',
          life: 2500,  // en milisegundos
          styleClass: 'mi-toast-custom'
          });
        }
      );
    }
  }

  mostrarDialogo(idEmpresa: number) {
    this.dialogVisible = true;
    this.idEmpresa = idEmpresa;
  }


 // Método que realiza la eliminación de la empresa
 eliminarEmpresa(idEmpresa: number) {
  this.empresaService.deleteEmpresa(idEmpresa).subscribe(
    (response) => {
      console.log('Empresa ' + idEmpresa + ' eliminada con exito');
      console.log('Empresa eliminada en el backend:', response);
      // Aquí puedes actualizar la lista de empresas después de la eliminación
      this.empresas = this.empresas.filter(emp => emp.idEmpresa !== idEmpresa);
    },
    (error) => {
      console.error('Error al eliminar la empresa:', error);
    }
  );
}


  onReject() {
    console.log('Acción de rechazo ejecutada');
    this.dialogVisible = false;  // Aquí puedes controlar si quieres ocultar el diálogo
  }
  onAccept() {
    console.log('Confirmación aceptada para eliminar la empresa con ID:', this.idEmpresa);
    this.eliminarEmpresa(this.idEmpresa);
  }



 // Función para mostrar el popup de confirmación antes de eliminar
 confirm(event: Event, idEmpresa: number): void {
  this.idEmpresa = idEmpresa;  // Guardamos el id de la empresa seleccionada
  this.message = '¿Estás seguro de eliminar esta empresa?';  // Definir el mensaje dinámicamente

  this.confirmationService.confirm({
    target: event.target as EventTarget,  // Vincula el evento al popup
    message: this.message,  // Usa la propiedad `message` en el popup
    icon:  this.icon,        // Usa la propiedad `icon` en el popup
    acceptLabel: 'Sí, eliminar empresa',  // Cambiar el texto del botón de aceptar
    rejectLabel: 'No, cancelar eliminación',  // Cambiar el texto del botón de rechazar
    accept: () => {
      // Acción aceptada: eliminar la empresa
      this.eliminarEmpresa(idEmpresa);
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Empresa eliminada con éxito',
        life: 2500,  // en milisegundos
        styleClass: 'mi-toast-custom'
      });
    },
    reject: () => {
      // Acción rechazada: mostrar mensaje de rechazo
      this.messageService.add({
        severity: 'error',
        summary: 'Estatus: ',
        detail: 'La acción ha sido rechazada',
        life: 2500,  // en milisegundos
        styleClass: 'mi-toast-custom'
      });
    }
  });
}


abrirDialogo() {
  this.nuevaEmpresa = {
    claveEmpresa: '',
    nombreEmpresa: '',
    activo: true,
    idUsuario: 0,
  }
  this.mostrarDialogoEmpresa = true;
  console.log('Acccion dialog :' +  this.mostrarDialogoEmpresa);
}

crearEmpresa() {
  this.empresaService.postEmpresa(this.nuevaEmpresa).subscribe({
    next: () => {
        this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Empresa creada con éxito',
        life: 2500,  // en milisegundos
        styleClass: 'mi-toast-custom'
      });
      this.mostrarDialogoEmpresa = false;
      // Recarga la tabla si es necesario
      this.cargarEmpresas();
    },
    error: (err) => { console.error('Error al crear empresa:', err);
    this.messageService.add({
      severity: 'error',
        summary: 'Error',
        detail: 'Hubo un error al crear la empresa',
        life: 2500,  // en milisegundos
        styleClass: 'mi-toast-custom'
    })
   }
  });
}

  cargarEmpresas() {
    this.empresaService.getEmpresas().subscribe((data) => {
      this.empresas = data;
    });
  }

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
