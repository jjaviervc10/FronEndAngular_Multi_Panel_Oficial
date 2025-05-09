import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './home/login/login.component';
import { InicioComponent } from './home/inicio/inicio.component';
import{AuthGuard} from './guards/auth.guard';
import { EmpresasComponent } from './catalogo/empresas/empresas.component';
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'inicio', component: InicioComponent, canActivate: [AuthGuard] },
  {path:'empresas', component: EmpresasComponent, canActivate: [AuthGuard]  },// p/vista empresas
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],  // Aquí es donde se configuran las rutas
  exports: [RouterModule]  // Esto permite que RouterModule esté disponible en todo el proyecto
})
export class AppRoutingModule {}
