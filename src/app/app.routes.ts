// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './home/login/login.component';
import { InicioComponent } from './home/inicio/inicio.component';

export const routes: Routes = [
  { path: '', component: LoginComponent }, // Página de login por defecto
  { path: 'login', component: LoginComponent },
  { path: 'inicio', component: InicioComponent }
];

export class  AppRoutingModule {}

