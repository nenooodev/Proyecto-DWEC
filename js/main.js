/**
 * Punto de entrada de la aplicación.
 *
 * Se encarga solo de localizar los formularios de la pantalla activa y delegar
 * en los módulos de configuración de cada formulario.
 */

import { configurarAcceso } from './acceso.js';
import { configurarContacto, cargarContactos } from './contacto.js';

const formularioAcceso = document.querySelector('#formulario-acceso');
if (formularioAcceso) {
  configurarAcceso(formularioAcceso);
}

const formularioContacto = document.querySelector('#formulario-contacto');
if (formularioContacto) {
  configurarContacto(formularioContacto);
}

cargarContactos();
