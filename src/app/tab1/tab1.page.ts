import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServicesService } from '../services/services.service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit{


  zonasArqueologicas: any[] = [];
  zonas: any;
  searchTerm: string = '';
  zonasFiltradas: any;


  constructor(private http: HttpClient, private db: ServicesService) {
    this.ObtenerZonas()
  }
  ngOnInit(): void {
    this.filtrarZonas();
    this.getZonas();
  }

  ObtenerZonas(){
    this.db.getDB().subscribe(
      (respuesta) => {
        console.log(respuesta)
        this.zonas = respuesta
        this.obtenerSoloZonas(this.zonas.estado)
        console.log(this.zonas.estado)
      },
      (error) => {
        console.error(error)
      }
    )
  }

  obtenerSoloZonas(data: any) {

    for(const estado in data){
      for(const zonas in data[estado]){
        const zona = data[estado][zonas];
        this.zonasArqueologicas.push({
          nombre: zona.nombre,
          descripcion: zona.descripcion
        });
      }
    }

    console.log('Zonas Aqueologicas', this.zonasArqueologicas)
  }

    /* Funcion para filtrar y buscar contactos por su nombre */
    getZonas(){
      this.db.getZones().subscribe((data: any) => {
        this.zonas = data;
        console.log(this.zonas);
      });
    }

      filtrarZonas() {
        if (this.searchTerm.trim() === '') {

          this.zonasFiltradas = this.zonas;
        }
        else {
          this.zonasFiltradas = this.zonas!.filter((zona: any) =>
          this.normalizarTexto(zona).includes(this.normalizarTexto(this.searchTerm))
        );
          console.log(this.zonasFiltradas);
        }
      }
      private normalizarTexto(texto: string): string {
        return texto
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();
      }


}
