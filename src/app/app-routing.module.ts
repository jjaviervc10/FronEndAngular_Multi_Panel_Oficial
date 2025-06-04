import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './home/login/login.component';
import { InicioComponent } from './home/inicio/inicio.component';
import{AuthGuard} from './guards/auth.guard';
import { EmpresasComponent } from './catalogo/empresas/empresas.component';
import { SucursalesComponent } from './catalogo/sucursales/sucursales.component';
import { PerfilesComponent } from './catalogo/perfiles/perfiles.component';
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'inicio', component: InicioComponent, canActivate: [AuthGuard] },
  {path:'empresas', component: EmpresasComponent, canActivate: [AuthGuard]  },// p/vista empresas
  {path:'sucursales', component: SucursalesComponent, canActivate: [AuthGuard] },
   {path: 'perfiles', component: PerfilesComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],  // Aquí es donde se configuran las rutas
  exports: [RouterModule]  // Esto permite que RouterModule esté disponible en todo el proyecto
})
export class AppRoutingModule {}
