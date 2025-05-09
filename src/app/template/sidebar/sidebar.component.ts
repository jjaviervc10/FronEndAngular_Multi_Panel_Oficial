import { Component,OnInit,ViewEncapsulation, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { Router,NavigationEnd } from '@angular/router';  // Importamos Router
import { AuthService} from '../../services/auth.service'; // Importamos AuthService
//import { IdleService } from '../../core/services/idle.service';  // Asegúrate de importar IdleService
import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit,OnDestroy{

  visible: boolean = false; // Estado del sidebar (si está abierto o cerrado)
  sidebarTimer: any = null;
  private routerSubscription: Subscription | undefined;
  private authSubscription: Subscription = new Subscription;
// Arreglo para los íconos fijos en el sidebar
iconsFixed = [
  { iconClass: 'pi pi-briefcase',route: '/empresas', clicked: false },
  { iconClass: 'pi pi-user', clicked: false },
  { iconClass: 'pi pi-building', clicked: false },
  { iconClass: 'pi pi-fw pi-sign-out', route:'/login', clicked: false},
  {iconClass: 'pi pi-home',  clicked:false}
];

 // Definir los ítems del menú para PrimeNG

 menuItems: MenuItem[] = [
  { label: 'Empresas', icon: 'pi pi-briefcase',  command: () => this.router.navigate(['/empresas']) },
  { label: 'Perfiles', icon: 'pi pi-user', command: () => console.log('Clic en Perfiles') },
  { label: 'Sucursales', icon: 'pi pi-building', command: () => console.log('Clic en Sucursales') },
  { label: 'Cerrar sesión', icon: 'pi pi-fw pi-sign-out',command:() => this.router.navigate(['/inicio']) },
  { label: 'Inicio', icon: 'pi pi-home', command: () => console.log('Clic en Inicio') }
];


constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    console.log('menuItems:', this.menuItems);
    // Verificar si el usuario está autenticado al cargar el componente
    this.authService.getAuthStatus().subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.visible = true; // Mostrar el sidebar si el usuario está autenticado
        this.showSidebar(); // Llamar a showSidebar para asegurar que se muestre
      } else {
        this.visible = false; // Ocultar el sidebar si el usuario no está autenticado
      }
    });
  }

  // Función para cambiar el estado del sidebar
  toggleSidebar() {
    this.visible = !this.visible;
  }
   // Muestra el sidebar cuando el mouse entra
   showSidebar() {
    this.visible = false; // Abre el sidebar
  }

  // Oculta el sidebar cuando el mouse sale
  hideSidebar() {
    this.visible = true; // Cierra el sidebar
  }

  // Función para manejar el clic en un ítem del menú
 /* onMenuItemClick(event: any) {
    // Para hacer la navegación del menú
    console.log('Item clicked:', event);
    event.preventDefault(); // Prevenir comportamiento por defecto
    this.router.navigate([event.item.route]); // Navegar según la ruta especificada
  }*/

    onMenuItemClick(item: any) {
      console.log('Item clicked:', item);

      if (item.route) {
        this.router.navigate([item.route]);
      } else if (item.command) {
        item.command();  // Ejecuta la función asociada, si no hay ruta
      }
    }

   // Función de logout
 logout() {
  console.log('Cerrando sesión...');
  this.router.navigate(['/login']);  // Redirigir al login

}

  // Función para alternar el estado de "clicado" de un ícono fijo
  toggleClick(icon: any) {
    console.log("Icono clicado:", icon.iconClass);
    if (icon.iconClass === 'pi pi-fw pi-sign-out') {
    //  this.logout();  // Si el icono es de cerrar sesión, llamar a logout
      this.authService.logout();
    } else {
      this.router.navigate([icon.route]); // Redirigir a la ruta asociada
    }
  }

openSidebar() {
  this.visible = true;

  // Limpia cualquier temporizador anterior si se vuelve a activar
  if (this.sidebarTimer) {
    clearTimeout(this.sidebarTimer);
  }

  // Cierra el sidebar después de 5 segundos
  this.sidebarTimer = setTimeout(() => {
    this.visible = false;
    this.sidebarTimer = null; // Limpia la referencia
  }, 3000);
}

/*private stopMonitoring(): void {
  this.isMonitoring = false;
  console.log(' Monitoreo DETENIDO');

  if (this.timeout) {
    clearTimeout(this.timeout);
  }
  window.removeEventListener('mousemove', this.resetTimeout);
  window.removeEventListener('keydown', this.resetTimeout);
}*/
 // Por limpieza
 ngOnDestroy(): void {
  ///this.routerSubscription?.unsubscribe();
  if (this.authSubscription) this.authSubscription.unsubscribe();
  //this.stopMonitoring();
}
}
