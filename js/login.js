/**
 * Acceso (login.html)
 * Al enviar el formulario se registra el usuario en localStorage.
 * IMPORTANTE: la contraseña NO se guarda nunca en el navegador (ni siquiera
 * hasheada): en una app real viajaría cifrada al servidor, que es quien la
 * almacena de forma segura. Aquí solo validamos que cumpla las reglas.
 */

import { crear, obtenerTodos } from './almacen.js';
import {
  validarUsuario,
  validarContrasena,
  validarFecha,
  validarEmail,
  validarConfirmacion,
} from './validacion.js';

const COLECCION = 'usuarios';

const formulario = document.querySelector('#formulario-acceso');
const mensajeError = document.querySelector('#acceso-error');

function mostrarError(mensaje) {
  mensajeError.textContent = mensaje;
  mensajeError.hidden = false;
}

function ocultarError() {
  mensajeError.textContent = '';
  mensajeError.hidden = true;
}

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();
  ocultarError();

  const datos = new FormData(formulario);
  const usuario = datos.get('usuario').trim();
  const correo = datos.get('correo').trim().toLowerCase();
  const contrasena = datos.get('contrasena');
  const repetirContrasena = datos.get('repetir_contrasena');
  const fechaNacimiento = datos.get('fecha_nacimiento');

  // Validamos todos los campos y mostramos el primer error encontrado.
  if (validarUsuario(usuario)) {
    mostrarError(validarUsuario(usuario));
  }
  if (validarEmail(correo)) {
    mostrarError(validarEmail(correo));
  }

  if (validarContrasena(contrasena)) {
    mostrarError(validarContrasena(contrasena));
  }
  if (validarConfirmacion(contrasena, repetirContrasena)) {
    mostrarError(validarConfirmacion(contrasena, repetirContrasena));
  }
  if (validarFecha(fechaNacimiento)) {
    mostrarError(validarFecha(fechaNacimiento));
  }

  // Evitamos duplicados por nombre de usuario o correo.
  const usuarios = obtenerTodos(COLECCION);
  const yaRegistrado = usuarios.some(
    (u) => u.usuario.toLowerCase() === usuario.toLowerCase() || u.correo === correo,
  );
  if (yaRegistrado) {
    mostrarError(
      'Ya existe un usuario con ese nombre o correo. Puedes gestionarlo en la vista de usuarios.',
    );
  }

  // Guardamos el usuario SIN contraseña: solo los datos del perfil.
  crear(COLECCION, {
    id: Date.now(),
    usuario,
    correo,
    fechaNacimiento,
  });

  formulario.reset();
  window.location.href = 'index.html';
});
