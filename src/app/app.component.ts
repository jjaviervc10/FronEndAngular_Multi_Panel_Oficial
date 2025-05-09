// src/app/app.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart,NavigationEnd  } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from './services/auth.service';
import { InactivityMonitorService } from './services/inactivity-monitor.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  currentRoute: string = '';
  isLoginPage: boolean = false;
  private authSubscription: Subscription = new Subscription;
  private routerSubscription: Subscription = new Subscription;




  constructor(
    private authService: AuthService,
    private inactivityService: InactivityMonitorService,
    private router: Router
  ) {


    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
          this.isLoginPage = event.url.includes('login');
          if (this.isLoginPage) {
            document.body.classList.add('login-page');
            console.log('Se ha navegado a la página de login');
            console.log('Ruta actual:', this.router.url);
          } else {
            document.body.classList.remove('login-page');
            console.log('Se ha navegado fuera de la página de login');
            console.log('Ruta actual else:', this.router.url);
          }
      }
    });

  }





  ngOnInit(): void {
    // Escuchar cambios en la autenticación
    this.authSubscription = this.authService.getAuthStatus().subscribe((status) => {
      this.isAuthenticated = status;
      console.log('Estado de autenticación actualizado: ', this.isAuthenticated);
    });



  }


  ngDoCheck(): void {
    // Este método se ejecuta más frecuentemente, lo que permite reaccionar a cambios de estado
    if (this.authService.isAuthenticated() !== this.isAuthenticated) {
      this.isAuthenticated = this.authService.isAuthenticated();
      console.log('Estado de autenticación actualizado en ngDoCheck: ', this.isAuthenticated);
    }
  }

  ngOnDestroy(): void {
    // Limpiar las suscripciones para evitar memory leaks
    if (this.authSubscription) this.authSubscription.unsubscribe();
   // if (this.routerSubscription) this.routerSubscription.unsubscribe();
   // this.inactivityService.stopMonitoring();
  }
}
