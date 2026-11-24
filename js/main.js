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

const VALIDADORES = {
  usuario: validarUsuario,
  contrasena: validarContrasena,
  repetir_contrasena: (campo) =>
    validarConfirmacion(campo, campo.form.elements.contrasena),
  fecha_nacimiento: validarFecha,
  correo: validarEmail,
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

    formulario.reset();
    limpiar(campos);
    mensajeExito.hidden = false;
  });

  formulario.addEventListener('input', () => {
    mensajeExito.hidden = true;
  });
};

const formularioAcceso = document.querySelector('#formulario-acceso');
if (formularioAcceso) {
  configurarAcceso(formularioAcceso);
}

const formularioContacto = document.querySelector('#formulario-contacto');
if (formularioContacto) {
  configurarContacto(formularioContacto);
}
