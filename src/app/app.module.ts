// src/app/app.module.ts
import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { LoginComponent } from './home/login/login.component';
import { InicioComponent } from './home/inicio/inicio.component';
import { AppRoutingModule } from './app-routing.module'; // Importamos AppRoutingModule
import { PickList, PickListModule } from 'primeng/picklist';
// Importa el FocusTrapModule desde PrimeNG
import { FocusTrapModule } from 'primeng/focustrap';
import { CheckboxModule } from 'primeng/checkbox';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { AutoFocusModule } from 'primeng/autofocus';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { HttpClientModule } from '@angular/common/http'; // Importa HttpClientModule
import { AuthService } from './services/auth.service';
import { InactivityMonitorService } from './services/inactivity-monitor.service';
import { GalleriaModule } from 'primeng/galleria';
import { SidebarComponent } from './template/sidebar/sidebar.component';
import { SidebarModule } from 'primeng/sidebar';
import { HeaderComponent } from './template/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Importar el módulo de animaciones
import { EmpresasComponent } from './catalogo/empresas/empresas.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ChipModule } from 'primeng/chip';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { TableModule } from 'primeng/table';  // Importamos TableModule

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    InicioComponent,
    SidebarComponent,
    HeaderComponent,
    EmpresasComponent
  ],
  imports: [
    PickListModule,
    BrowserModule,
    AppRoutingModule, // Usamos AppRoutingModule aquí
    FocusTrapModule,
    CheckboxModule,
    ButtonModule,
    IconFieldModule,
    AutoFocusModule,
    FormsModule,
    InputTextModule,
    InputIconModule,
    HttpClientModule,
    GalleriaModule,
    SidebarModule,
    BrowserAnimationsModule,
    ChipModule,
    AvatarModule,
    AvatarGroupModule,
    TableModule,

  ],
  providers: [ConfirmationService,MessageService,AuthService, InactivityMonitorService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Agregar esto
})
export class AppModule {

}
