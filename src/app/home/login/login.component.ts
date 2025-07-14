import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { InactivityMonitorService } from '../../services/inactivity-monitor.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']  // Corregido 'styleUrl' a 'styleUrls'
})
export class LoginComponent {

  username: string = '';  // Variable para el nombre de usuario
  password: string = '';  // Variable para la contraseña

  mostrarCredenciales: boolean = false;


  constructor(
    private authService: AuthService,
    private router: Router,
    private inactivityMonitor: InactivityMonitorService
  ) {}

  onLogin() {
    if (this.username && this.password) {
      // Llamamos al servicio de autenticación con los datos del formulario
      this.authService.login(this.username, this.password).subscribe({
        next: (response) => {  // El 'response' ahora es de tipo AuthResponse
          const { token, usuario } = response;  // Extraemos el token y el usuario de la respuesta

          // Si la autenticación es exitosa, guardamos el token en el localStorage
          localStorage.setItem('auth_token', token);

          // Aquí puedes guardar más detalles del usuario si es necesario
          localStorage.setItem('user_info', JSON.stringify(usuario));

          // Redirigimos a la página de inicio
          this.router.navigate(['/inicio']);
        },
        error: (err) => {
          // Si hay un error, muestra un mensaje de error
          console.error('Error de autenticación', err);
          alert('Credenciales incorrectas');
        }
      });
    } else {
      alert('Por favor ingrese usuario y contraseña');
    }
  }
}
