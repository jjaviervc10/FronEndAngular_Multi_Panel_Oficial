import { Component , OnInit} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
 // standalone: true,
 // imports: [],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent implements OnInit {

  //Arreglo de imagenes con campos itemImageSrc y thmbnailImageSrc
  images:any[] | undefined;

  //Indice activo para el slider
  _activeIndex: number = 2;

  //Opciones para hacer la galeria adaptable a diferentes tamaños de pantalla
  responsiveOptions: any[]=[
    {
      breakpoint: '1024px',
      numVisible: 5
  },
  {
      breakpoint: '768px',
      numVisible: 3
  },
  {
      breakpoint: '560px',
      numVisible: 1
  }
  ];

  constructor() {}

  ngOnInit(){
   this.images = [
    {
      src: 'assets/images/fondo.png',  // Ruta de la imagen
      thumbnailImageSrc: 'assets/images/fondo.png',
      alt: 'Imagen de prueba',
      title: 'Imagen de prueba'
    },
    {
      src: 'assets/images/Jersey_24_25.jpg',
      thumbnailImageSrc: 'assets/images/Jersey_24_25.jpg',
      alt: 'Image 3',
      title: 'Image 3'
    },
    {
      src: 'assets/images/Screenshot 2025-02-14 102259.png',
      thumbnailImageSrc: 'assets/images/Screenshot 2025-02-14 102259.png',
      alt: 'Image 4',
      title: 'Image 4'
    },
    {
      src: 'assets/images/Screenshot 2025-03-13 140535.png',
      thumbnailImageSrc:'assets/images/Screenshot 2025-03-13 140535.png',
      alt:'Image 4',
      title: 'Image 5'

    },
    {
       src: 'assets/images/Screenshot 2025-04-07 151030.png',
       thumbnailImageSrc: 'assets/images/Screenshot 2025-04-07 151030.png',
       alt:'Image 5',
       tittle: 'Image 6'
    }
  ];

}

get activeIndex(): number {
  return this._activeIndex;
}

// Establecer el índice activo para controlar la imagen visible
set activeIndex(newValue: number) {
  if (this.images && 0 <= newValue && newValue <= this.images.length - 1) {
    this._activeIndex = newValue;
  }
}

// Funciones para avanzar o retroceder en la galería
next() {
  this.activeIndex++;
}

prev() {
  this.activeIndex--;
}
}
