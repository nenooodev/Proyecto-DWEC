import {
  crear,
  leer,
  obtenerTodos,
  actualizar,
  borrar,
  obtenerPorId,
} from './almacen.js';
import {
  esCampoValidable,
  aplicarEstado,
  validarYMostrar,
  validarTocados,
  limpiar,
  configurarContador,
} from './formularios.js';
import { validarTelefono } from './validacion.js';

export const COLECCION_CONTACTOS = 'contactos';

const COOKIE_NOMBRE_CAMPO = 'contacto_nombre';
const COOKIE_CORREO_CAMPO = 'contacto_correo';
const SEGUNDOS_DE_CADUCIDAD = 7 * 24 * 60 * 60;

const leerCookie = (nombre) => {
  const cookie = document.cookie
    .split('; ')
    .find((parte) => parte.startsWith(`${nombre}=`));

  return cookie ? decodeURIComponent(cookie.split('=').slice(1).join('=')) : '';
};

const guardarRecordatorio = (nombre, correo) => {
  const caducidad = new Date(Date.now() + SEGUNDOS_DE_CADUCIDAD * 1000).toUTCString();

  document.cookie = `${COOKIE_NOMBRE_CAMPO}=${encodeURIComponent(nombre)}; expires=${caducidad}; path=/`;
  document.cookie = `${COOKIE_CORREO_CAMPO}=${encodeURIComponent(correo)}; expires=${caducidad}; path=/`;
};

const aplicarRecordatorio = (formulario) => {
  const nombre = leerCookie(COOKIE_NOMBRE_CAMPO);
  const correo = leerCookie(COOKIE_CORREO_CAMPO);

  if (nombre) {
    formulario.elements.nombre.value = nombre;
  }

  if (correo) {
    formulario.elements.correo.value = correo;
  }
};

export const formatearFecha = (valor) => {
  const fecha = new Date(valor);

  return Number.isNaN(fecha.getTime())
    ? ''
    : fecha.toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
};

export const crearFichaContacto = (contacto, idx) => {
  const item = document.createElement('li');
  item.className = 'contacto-ficha';
  item.dataset.id = idx + 1;

  const cabecera = document.createElement('div');
  cabecera.className = 'contacto-ficha__cabecera';

  const nombre = document.createElement('p');
  nombre.className = 'contacto-ficha__nombre';
  nombre.textContent = contacto.nombre;

  const fecha = document.createElement('time');
  fecha.className = 'contacto-ficha__fecha';
  fecha.dateTime = contacto.fecha ?? '';
  fecha.textContent = formatearFecha(contacto.fecha);

  cabecera.append(nombre, fecha);

  const datos = document.createElement('div');
  datos.className = 'contacto-ficha__datos';

  const correo = document.createElement('p');
  correo.textContent = `Correo: ${contacto.correo}`;
  datos.append(correo);

  if (contacto.telefono) {
    const telefono = document.createElement('p');
    telefono.textContent = `Teléfono: ${contacto.telefono}`;
    datos.append(telefono);
  }

  if (contacto.prefiereLlamada) {
    const preferencia = document.createElement('p');
    preferencia.className = 'contacto-ficha__preferencia';
    preferencia.textContent = 'Prefiere que le llamen';
    datos.append(preferencia);
  }

  const motivo = document.createElement('p');
  motivo.className = 'contacto-ficha__motivo';
  motivo.textContent = contacto.motivo;

  const acciones = document.createElement('div');
  acciones.className = 'contacto-ficha__acciones';

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
  item.append(cabecera, datos, motivo, acciones);

  return item;
};

export const cargarContactos = () => {
  const lista = document.querySelector('#lista-contactos');

  if (!lista) return;

  while (lista.firstChild) {
    lista.firstChild.remove();
  }

  const contactos = obtenerTodos(COLECCION_CONTACTOS).slice().reverse();
  const vacio = document.querySelector('#contactos-vacio');
  const fragmento = document.createDocumentFragment();

  contactos.forEach((contacto, idx) =>
    fragmento.append(crearFichaContacto(contacto, idx)),
  );
  lista.append(fragmento);

  if (vacio) {
    vacio.hidden = contactos.length > 0;
  }
};

// ---------------------------------------------------------------------------
// Modal de edición de un mensaje de contacto
// ---------------------------------------------------------------------------
let elementoModalContacto = null;

const abrirModalContacto = (contacto) => {
  cerrarModalContacto();
  crearModalContacto(contacto);
};

const crearModalContacto = (contacto) => {
  const modal = document.createElement('div');
  modal.className = 'modal';
  elementoModalContacto = modal;

  const fondo = document.createElement('div');
  fondo.className = 'modal__fondo';
  fondo.dataset.accion = 'cerrar';

  const caja = document.createElement('div');
  caja.className = 'modal__caja modal__caja--contacto';

  const cabecera = document.createElement('header');
  cabecera.className = 'modal__cabecera';

  const titulo = document.createElement('h2');
  titulo.id = 'titulo-edicion-contacto';
  titulo.className = 'modal__titulo';
  titulo.textContent = 'Editar mensaje';

  const botonCerrar = document.createElement('button');
  botonCerrar.type = 'button';
  botonCerrar.className = 'modal__cerrar';
  botonCerrar.dataset.accion = 'cerrar';
  botonCerrar.setAttribute('aria-label', 'Cerrar');
  const iconoCerrar = document.createElement('img');
  iconoCerrar.className = 'modal__icono-cerrar';
  iconoCerrar.src = 'assets/icons/cerrar.svg';
  iconoCerrar.alt = '';
  botonCerrar.append(iconoCerrar);
  cabecera.append(titulo, botonCerrar);

  const cuerpo = document.createElement('div');
  cuerpo.className = 'modal__cuerpo';

  const motivo = document.createElement('textarea');
  motivo.className = 'campo__entrada campo__entrada--area';
  motivo.id = 'editar-motivo-contacto';
  motivo.name = 'motivo_edicion';
  motivo.rows = 3;
  motivo.value = contacto.motivo ?? '';
  motivo.maxLength = 500;
  motivo.minLength = 20;

  const botonGuardar = document.createElement('button');
  botonGuardar.type = 'button';
  botonGuardar.className = 'modal__boton modal__boton--primario';
  botonGuardar.dataset.accion = 'guardar';
  botonGuardar.textContent = 'Guardar cambios';

  const botonCancelar = document.createElement('button');
  botonCancelar.type = 'button';
  botonCancelar.className = 'modal__boton';
  botonCancelar.dataset.accion = 'cancelar';
  botonCancelar.textContent = 'Cancelar';

  const acciones = document.createElement('div');
  acciones.className = 'modal__acciones';
  acciones.append(botonGuardar, botonCancelar);
  cuerpo.append(motivo, acciones);
  caja.append(cabecera, cuerpo, acciones);
  modal.append(fondo, caja);

  fondo.addEventListener('click', (evento) => {
    if (!evento.target.closest('.modal__caja')) {
      cerrarModalContacto();
    }
  });

  botonCerrar.addEventListener('click', cerrarModalContacto);
  botonCancelar.addEventListener('click', cerrarModalContacto);
  botonGuardar.addEventListener('click', () => {
    guardarEdicionContacto(modal, contacto);
  });

  document.body.append(modal);

  return modal;
};

const cerrarModalContacto = () => {
  if (!elementoModalContacto) return;
  elementoModalContacto.remove();
  elementoModalContacto = null;
};

const guardarEdicionContacto = (modal, contacto) => {
  const motivo = modal.querySelector('[name="motivo_edicion"]').value.trim();
  actualizar(COLECCION_CONTACTOS, contacto.id, {
    ...contacto,
    motivo,
    fecha: new Date().toISOString(),
  });

  cerrarModalContacto();
  cargarContactos();
};

const listaContactos = document.querySelector('#lista-contactos');
if (listaContactos) {
  listaContactos.addEventListener('click', (evento) => {
    const boton = evento.target.closest('button[data-accion]');
    if (!boton) return;

    const ficha = boton.closest('.contacto-ficha');
    const id = ficha ? Number(ficha.dataset.id) : NaN;
    const contacto = ficha ? obtenerPorId(COLECCION_CONTACTOS, id) : null;
    if (!contacto) return;

    if (boton.dataset.accion === 'editar') {
      abrirModalContacto(contacto);
      return;
    }

    if (boton.dataset.accion === 'eliminar') {
      const confirmado = window.confirm('¿Eliminar este mensaje de contacto?');
      if (!confirmado) return;
      borrar(COLECCION_CONTACTOS, id);
      cargarContactos();
    }
  });
}

export const configurarContacto = (formulario) => {
  const mensajeExito = document.querySelector('#contacto-exito');
  const campos = [...formulario.elements].filter(esCampoValidable);
  const telefono = formulario.elements.telefono;
  const prefieroLlamada = formulario.elements.prefiero_llamada;
  const mensaje = formulario.elements.mensaje;
  const actualizarContador = mensaje ? configurarContador(mensaje) : () => {};

  const actualizarTelefonoObligatorio = () => {
    telefono.required = prefieroLlamada.checked;
  };

  actualizarTelefonoObligatorio();

  prefieroLlamada.addEventListener('change', () => {
    actualizarTelefonoObligatorio();
    telefono.dataset.tocado = 'true';
    validarYMostrar(telefono);
  });

  campos.forEach((campo) => {
    campo.dataset.tocado = 'false';
    aplicarEstado(campo, null);

    campo.addEventListener('blur', () => {
      campo.dataset.tocado = 'true';
      validarTocados(campos);
    });

    campo.addEventListener('input', () => {
      if (campo.dataset.tocado === 'true') {
        validarTocados(campos);
      }
    });
  });

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    mensajeExito.hidden = true;

    const errores = campos.filter((campo) => {
      campo.dataset.tocado = 'true';
      return validarYMostrar(campo) !== null;
    });

    if (errores.length > 0) {
      errores[0].focus();
      return;
    }

    const datos = new FormData(formulario);

    crear(COLECCION_CONTACTOS, {
      id: leer(COLECCION_CONTACTOS).length + 1,
      nombre: datos.get('nombre').trim(),
      correo: datos.get('correo').trim().toLowerCase(),
      telefono: datos.get('telefono').trim() || null,
      prefiereLlamada: prefieroLlamada.checked,
      motivo: datos.get('mensaje').trim(),
      fecha: new Date().toISOString(),
    });

    guardarRecordatorio(
      datos.get('nombre').trim(),
      datos.get('correo').trim().toLowerCase(),
    );

    formulario.reset();
    actualizarTelefonoObligatorio();
    actualizarContador();
    limpiar(campos);
    mensajeExito.textContent =
      'Hemos recibido tu motivo de contacto. Te responderemos lo antes posible.';
    mensajeExito.hidden = false;
  });

  formulario.addEventListener('input', () => {
    mensajeExito.hidden = true;
  });

  aplicarRecordatorio(formulario);
};
