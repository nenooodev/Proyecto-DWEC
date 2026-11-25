/**
 * Gestión de usuarios (usuarios.html)
 * Listado de usuarios registrados en localStorage con acciones de edición y
 * borrado. El mismo formulario sirve para crear y editar: al editar, se
 * rellena con los datos del usuario. La contraseña no se guarda nunca, así
 * que en modo edición esos campos se ocultan (no hay nada que rellenar).
 */

import { obtenerTodos, obtenerPorId, crear, actualizar, borrar } from './almacen.js';
import {
  esCampoValidable,
  aplicarEstado,
  validarYMostrar,
  validarTocados,
  limpiar,
} from './formularios.js';
const COLECCION = 'usuarios';

const formulario = document.querySelector('#formulario-usuario');
const lista = document.querySelector('#lista-usuarios');
const avisoVacio = document.querySelector('#usuarios-vacio');
const tituloTarjeta = document.querySelector('#titulo-formulario-usuario');
const botonEnviar = document.querySelector('#boton-enviar-usuario');
const botonCancelar = document.querySelector('#boton-cancelar-edicion');
const camposContrasena = document.querySelector('#campos-contrasena');

const camposFormulario = [...formulario.elements].filter(esCampoValidable);

// Campos que se validan en cada momento: al editar, la contraseña está oculta
// y no debe intervenir en la validación.
const camposActivos = () =>
  camposFormulario.filter(
    (campo) => !camposContrasena.contains(campo) || !camposContrasena.hidden,
  );

// ---------------------------------------------------------------------------
// Estado de edición: null = creando, id numérico = editando ese usuario.
// ---------------------------------------------------------------------------
let idEnEdicion = null;

function iniciales(nombreUsuario) {
  return nombreUsuario
    .replace(/[^a-z0-9]/gi, '')
    .slice(0, 2)
    .toUpperCase();
}

// ---------------------------------------------------------------------------
// Listado
// ---------------------------------------------------------------------------
function crearFicha(usuario) {
  const ficha = document.createElement('li');
  ficha.className = 'usuario-ficha';
  ficha.dataset.id = usuario.id;

  const avatar = document.createElement('span');
  avatar.className = 'usuario-ficha__avatar';
  avatar.setAttribute('aria-hidden', 'true');
  avatar.textContent = iniciales(usuario.usuario);

  const datos = document.createElement('div');
  datos.className = 'usuario-ficha__datos';

  const nombre = document.createElement('p');
  nombre.className = 'usuario-ficha__nombre';
  nombre.textContent = usuario.usuario;

  const correo = document.createElement('p');
  correo.className = 'usuario-ficha__correo';
  correo.textContent = usuario.correo;

  datos.append(nombre, correo);

  const acciones = document.createElement('div');
  acciones.className = 'usuario-ficha__acciones';

  const botonEditar = document.createElement('button');
  botonEditar.type = 'button';
  botonEditar.className = 'boton boton--secundario boton--compacto';
  botonEditar.dataset.accion = 'editar';
  botonEditar.textContent = 'Editar';

  const botonEliminar = document.createElement('button');
  botonEliminar.type = 'button';
  botonEliminar.className = 'boton boton--peligro boton--compacto';
  botonEliminar.dataset.accion = 'eliminar';
  botonEliminar.textContent = 'Eliminar';

  acciones.append(botonEditar, botonEliminar);
  ficha.append(avatar, datos, acciones);
  return ficha;
}

function renderizarLista() {
  const usuarios = obtenerTodos(COLECCION);
  lista.innerHTML = '';
  usuarios.forEach((usuario) => lista.appendChild(crearFicha(usuario)));
  avisoVacio.hidden = usuarios.length > 0;
}

// ---------------------------------------------------------------------------
// Formulario: crear / editar
// ---------------------------------------------------------------------------
function aplicarModoEdicion() {
  const enEdicion = idEnEdicion !== null;
  camposContrasena.hidden = enEdicion;
  botonCancelar.hidden = !enEdicion;
  tituloTarjeta.textContent = enEdicion ? 'Editar usuario' : 'Nuevo usuario';
  botonEnviar.textContent = enEdicion ? 'Guardar cambios' : 'Crear usuario';
}

function resetearFormulario() {
  idEnEdicion = null;
  limpiar(camposFormulario);
  formulario.reset();
  aplicarModoEdicion();
}

// Validación al salir del campo (blur) y al escribir, pero solo una vez que el
// campo ha sido tocado, igual que en el formulario de acceso.
camposFormulario.forEach((campo) => {
  campo.dataset.tocado = 'false';
  aplicarEstado(campo, null);

  campo.addEventListener('blur', () => {
    campo.dataset.tocado = 'true';
    validarTocados(camposActivos());
  });

  campo.addEventListener('input', () => {
    if (campo.dataset.tocado === 'true') {
      validarTocados(camposActivos());
    }
  });
});

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();

  const campos = camposActivos();
  campos.forEach((campo) => {
    campo.dataset.tocado = 'true';
  });

  const errores = campos.filter((campo) => validarYMostrar(campo) !== null);

  if (errores.length > 0) {
    errores[0].focus();
    return;
  }

  const datos = new FormData(formulario);
  const usuario = datos.get('usuario').trim();
  const correo = datos.get('correo').trim().toLowerCase();
  const fechaNacimiento = datos.get('fecha_nacimiento');

  // Duplicados por nombre o correo (ignorando al usuario que se está editando).
  const duplicado = obtenerTodos(COLECCION).some(
    (u) =>
      u.id !== idEnEdicion &&
      (u.usuario.toLowerCase() === usuario.toLowerCase() || u.correo === correo),
  );

  if (duplicado) {
    aplicarEstado(
      formulario.elements.usuario,
      'Ya existe otro usuario con ese nombre o correo.',
    );
    formulario.elements.usuario.focus();
    return;
  }

  if (idEnEdicion === null) {
    crear(COLECCION, { id: Date.now(), usuario, correo, fechaNacimiento });
  } else {
    // No incluimos `condiciones`: al actualizar se conserva el valor guardado.
    actualizar(COLECCION, idEnEdicion, { usuario, correo, fechaNacimiento });
  }

  resetearFormulario();
  renderizarLista();
});

botonCancelar.addEventListener('click', () => {
  resetearFormulario();
});

// ---------------------------------------------------------------------------
// Acciones del listado (delegación de eventos)
// ---------------------------------------------------------------------------
lista.addEventListener('click', (evento) => {
  const boton = evento.target.closest('button[data-accion]');
  if (!boton) return;

  const ficha = boton.closest('.usuario-ficha');
  const id = Number(ficha.dataset.id);
  const usuario = obtenerPorId(COLECCION, id);
  if (!usuario) return;

  if (boton.dataset.accion === 'editar') {
    idEnEdicion = id;
    limpiar(camposFormulario);
    formulario.querySelector('[name="usuario"]').value = usuario.usuario;
    formulario.querySelector('[name="correo"]').value = usuario.correo;
    formulario.querySelector('[name="fecha_nacimiento"]').value =
      usuario.fechaNacimiento ?? '';
    aplicarModoEdicion();
    formulario.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (boton.dataset.accion === 'eliminar') {
    const confirmado = window.confirm(`¿Eliminar a ${usuario.usuario}?`);
    if (!confirmado) return;
    borrar(COLECCION, id);
    if (idEnEdicion === id) resetearFormulario();
    renderizarLista();
  }
});

// ---------------------------------------------------------------------------
// Arranque
// ---------------------------------------------------------------------------
aplicarModoEdicion();
renderizarLista();
