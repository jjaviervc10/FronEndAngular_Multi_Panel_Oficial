// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable,BehaviorSubject } from 'rxjs';
import { UsuarioDTO } from '../models/UsuarioDTO';


// Interfaz para la respuesta del login
interface AuthResponse {
  token: string;         // El token JWT que recibimos
  usuario: any;          // Los detalles del usuario (sin la contraseña)
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
 // private apiUrl = 'http://localhost:9091/api/usuarios/login'; // Cambia esta URL según tu backend de Spring Boot
  private authStatus = new BehaviorSubject<boolean>(this.isAuthenticated());
 private apiUrl = 'https://demobackendspringboot-production.up.railway.app/api/usuarios/login';
  constructor(private http: HttpClient, private router: Router) {}

  // Función de login que retorna un Observable de tipo AuthResponse
  login(username: string, password: string): Observable<AuthResponse> {
    const credentials = { usuario: username, pass: password };
    return this.http.post<AuthResponse>(this.apiUrl, credentials);
  }

  // Función para hacer logout, elimina el token y redirige al login
  logout(): void {
    localStorage.removeItem('auth_token'); // Eliminar el token JWT del localStorage
    this.authStatus.next(false);//Notificar logout
    this.router.navigate(['/login']);      // Redirige al login después de cerrar sesión
    console.log("Entra el logout para salir de sesion , valor :-> 0");

  }

  // Verifica si el usuario está autenticado (es decir, si existe el token JWT)
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token'); // Retorna true si el token existe
  }

  // Función para obtener el token JWT almacenado
  getToken(): string | null {
    return localStorage.getItem('auth_token');

  }

  // Método para obtener los datos del usuario
  getUsuario(): UsuarioDTO | null {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload); // decodifica Base64
      return JSON.parse(decoded);    // ahora sí, parseamos JSON
    } catch (error) {
      console.error('Error al decodificar el token JWT:', error);
      return null;
    }
  }
  // Función para guardar el token JWT en el localStorage
  saveToken(token: string): void {
    localStorage.setItem('auth_token', token);
    this.authStatus.next(true);//notificar login
  }

  //Permitimos a otros componentes suscribirse al estado de autenticacion
  getAuthStatus():Observable<boolean>{
    return this.authStatus.asObservable();
  }
}
