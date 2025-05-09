// src/app/services/inactivity-monitor.service.ts

/*import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InactivityMonitorService {
  private timeout: any;
  private inactivityTimeout = 2 * 60 * 1000; // 2 minutos

  constructor(private authService: AuthService, private router: Router) {}

  startMonitoring(): void {
    const currentRoute = this.router.url;

     // Solo comienza el monitoreo si el usuario está autenticado
     if (this.authService.isAuthenticated() && currentRoute !== '/login') {
      console.log("Valor: -> 1 true");
      this.resetTimeout(); // Inicia el temporizador de inactividad
         console.log("Valor del startMonitoreo:" + this.authService.isAuthenticated);
      // Escucha los eventos de usuario (movimiento del mouse, teclas presionadas) para reiniciar el temporizador
      window.addEventListener('mousemove', this.resetTimeout.bind(this));
      window.addEventListener('keydown', this.resetTimeout.bind(this));
    }
  }

  stopMonitoring(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    window.removeEventListener('mousemove', this.resetTimeout.bind(this));
    window.removeEventListener('keydown', this.resetTimeout.bind(this));
  }

  private resetTimeout() {
    if (this.timeout) {
      clearTimeout(this.timeout);  // Cancela cualquier temporizador anterior
    }
    this.timeout = setTimeout(() => this.logoutUser(), this.inactivityTimeout); // Configura el temporizador para cerrar sesión
  }

  private logoutUser(): void {
    // Cierra la sesión del usuario
    this.authService.logout();
    alert('Tu sesión ha expirado por inactividad.');
    this.router.navigate(['/login']);
  }
}*/
// src/app/services/inactivity-monitor.service.ts

import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './auth.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InactivityMonitorService {
  private timeout: any;
  private inactivityTimeout = 2 * 60 * 1000; // 2 minutos
  private isMonitoring = false;
  private routerSubscription: Subscription | undefined;

  constructor(private authService: AuthService, private router: Router) {
    // Escuchar navegación para decidir cuándo monitorear
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.evaluateMonitoring());
  }

  private evaluateMonitoring(): void {
    const shouldMonitor = this.authService.isAuthenticated() && this.router.url !== '/login';

    if (shouldMonitor && !this.isMonitoring) {
      this.startMonitoring();
    } else if (!shouldMonitor && this.isMonitoring) {
      this.stopMonitoring();
    }
  }

  private startMonitoring(): void {
    this.isMonitoring = true;
    console.log(' Monitoreo INICIADO');

    this.resetTimeout();
    window.addEventListener('mousemove', this.resetTimeout);
    window.addEventListener('keydown', this.resetTimeout);
  }

  private stopMonitoring(): void {
    this.isMonitoring = false;
    console.log(' Monitoreo DETENIDO');

    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    window.removeEventListener('mousemove', this.resetTimeout);
    window.removeEventListener('keydown', this.resetTimeout);
  }

  private resetTimeout = () => {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => this.logoutUser(), this.inactivityTimeout);
  };

  private logoutUser(): void {
    this.authService.logout();
    alert('Tu sesión ha expirado por inactividad.');
    this.router.navigate(['/login']);
  }

  // Por limpieza
  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
    this.stopMonitoring();
  }
}
