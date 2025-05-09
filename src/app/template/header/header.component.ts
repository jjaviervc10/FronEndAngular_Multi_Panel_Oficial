import { AuthGuard} from './../../guards/auth.guard';
import { Component,OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',

  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{

  usuario: any;

  constructor(private AuthService: AuthService){}

  ngOnInit(): void {
    // Obtener los datos del usuario almacenados en localStorage
    this.usuario = this.AuthService.getUsuario();
    console.log("Uusario en sesion", this.usuario);
  }

 }


