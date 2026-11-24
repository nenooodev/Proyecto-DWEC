/**
 * Punto de entrada de la aplicación.
 *
 * Contiene la validación común de formularios y el comportamiento propio de
 * cada formulario (acceso y contacto con soporte). Las reglas concretas de
 * cada campo viven en validacion.js y leen sus límites del HTML.
 */

import { crear, obtenerTodos } from './almacen.js';
import {
  validarConfirmacion,
  validarContrasena,
  validarEmail,
  validarFecha,
  validarTelefono,
  validarUsuario,
} from './validacion.js';

const TIPOS_IGNORADOS = new Set([
  'button',
  'checkbox',
  'color',
  'file',
  'hidden',
  'image',
  'radio',
  'range',
  'reset',
  'submit',
]);

const SELECTOR_CAMPOS = 'input, textarea, select';
const COLECCION_CONTACTOS = 'contactos';

const VALIDADORES = {
  usuario: validarUsuario,
  contrasena: validarContrasena,
  repetir_contrasena: (campo) =>
    validarConfirmacion(campo, campo.form.elements.contrasena),
  fecha_nacimiento: validarFecha,
  correo: validarEmail,
  telefono: validarTelefono,
};

const normalizarValor = (campo) => {
  if (campo.type === 'password' || campo.type === 'date') {
    return campo.value;
  }

  return campo.value.trim();
};

const esCampoValidable = (campo) =>
  campo.matches(SELECTOR_CAMPOS) && !TIPOS_IGNORADOS.has(campo.type) && campo.name !== '';

const obtenerMensaje = (campo) => {
  const valor = normalizarValor(campo);

  if (campo.required && valor === '') {
    return 'Este campo es obligatorio';
  }

  if (valor === '') {
    return null;
  }

  if (campo.maxLength > 0 && valor.length > campo.maxLength) {
    return `No puede superar los ${campo.maxLength} caracteres`;
  }

  const validador = VALIDADORES[campo.name];
  if (typeof validador === 'function') {
    return validador(campo);
  }

  if (campo.type === 'email') {
    return validarEmail(campo);
  }

  if (campo.minLength > 0 && valor.length < campo.minLength) {
    return `Debe tener al menos ${campo.minLength} caracteres`;
  }

  if (campo.type === 'date') {
    if (campo.min && valor < campo.min) {
      return `La fecha no puede ser anterior al ${campo.min}`;
    }

    if (campo.max && valor > campo.max) {
      return `La fecha no puede ser posterior al ${campo.max}`;
    }
  }

  return null;
};

const aplicarEstado = (campo, mensaje) => {
  const error = document.getElementById(`error-${campo.id}`);

  if (error) {
    error.textContent = mensaje ?? '';
    error.hidden = mensaje === null;
  }

  campo.setAttribute('aria-invalid', mensaje === null ? 'false' : 'true');
};

const validarYMostrar = (campo) => {
  const mensaje = obtenerMensaje(campo);
  aplicarEstado(campo, mensaje);
  return mensaje;
};

const validarTocados = (campos) => {
  campos.forEach((campo) => {
    if (campo.dataset.tocado === 'true') {
      validarYMostrar(campo);
    }
  });
};

const limpiar = (campos) => {
  campos.forEach((campo) => {
    campo.dataset.tocado = 'false';
    aplicarEstado(campo, null);
  });
};

/**
 * Actualiza el contador asociado a un campo. El id del contador se lee del
 * atributo `data-contador` del propio campo, igual que el resto de límites.
 */
const configurarContador = (campo) => {
  const contador = document.getElementById(campo.dataset.contador);

  if (!contador) {
    return () => {};
  }

  const actualizar = () => {
    contador.textContent = `${campo.value.length}/${campo.maxLength}`;
  };

  campo.addEventListener('input', actualizar);
  actualizar();

  return actualizar;
};

const configurarAcceso = (formulario) => {
  const mensajeError = document.querySelector('#acceso-error');
  const campos = [...formulario.elements].filter(esCampoValidable);

  const mostrarError = (mensaje) => {
    mensajeError.textContent = mensaje;
    mensajeError.hidden = false;
  };

  const ocultarError = () => {
    mensajeError.textContent = '';
    mensajeError.hidden = true;
  };

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
    ocultarError();

    const errores = campos.filter((campo) => {
      campo.dataset.tocado = 'true';
      return validarYMostrar(campo) !== null;
    });

    if (errores.length > 0) {
      errores[0].focus();
      return;
    }

    const datos = new FormData(formulario);
    const usuario = datos.get('usuario').trim();
    const correo = datos.get('correo').trim().toLowerCase();
    const fechaNacimiento = datos.get('fecha_nacimiento');

    // Evitamos duplicados por nombre de usuario o correo.
    const usuarios = obtenerTodos('usuarios');
    const yaRegistrado = usuarios.some(
      (u) => u.usuario.toLowerCase() === usuario.toLowerCase() || u.correo === correo,
    );

    if (yaRegistrado) {
      mostrarError(
        'Ya existe un usuario con ese nombre o correo. Puedes gestionarlo en la vista de usuarios.',
      );
      formulario.elements.usuario.focus();
      return;
    }

    // Guardamos el usuario SIN contraseña: solo los datos del perfil.
    crear('usuarios', {
      id: Date.now(),
      usuario,
      correo,
      fechaNacimiento,
    });

    limpiar(campos);
    formulario.reset();
    window.location.href = 'index.html';
  });

  formulario.addEventListener('input', ocultarError);
};

const configurarContacto = (formulario) => {
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
      id: Date.now(),
      nombre: datos.get('nombre').trim(),
      correo: datos.get('correo').trim().toLowerCase(),
      telefono: datos.get('telefono').trim() || null,
      prefiereLlamada: prefieroLlamada.checked,
      motivo: datos.get('mensaje').trim(),
      fecha: new Date().toISOString(),
    });

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
};

const formatearFecha = (valor) => {
  const fecha = new Date(valor);

  return Number.isNaN(fecha.getTime())
    ? ''
    : fecha.toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
};

const crearFichaContacto = (contacto) => {
  const item = document.createElement('li');
  item.className = 'contacto-ficha';

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

  item.append(cabecera, datos, motivo);
  return item;
};

const cargarContactos = () => {
  const lista = document.querySelector('#lista-contactos');

  if (!lista) return;

  const contactos = obtenerTodos(COLECCION_CONTACTOS).slice().reverse();
  const vacio = document.querySelector('#contactos-vacio');
  const fragmento = document.createDocumentFragment();

  contactos.forEach((contacto) => fragmento.append(crearFichaContacto(contacto)));
  lista.append(fragmento);

  if (vacio) {
    vacio.hidden = contactos.length > 0;
  }
};

const formularioAcceso = document.querySelector('#formulario-acceso');
if (formularioAcceso) {
  configurarAcceso(formularioAcceso);
}

const formularioContacto = document.querySelector('#formulario-contacto');
if (formularioContacto) {
  configurarContacto(formularioContacto);
}

cargarContactos();
