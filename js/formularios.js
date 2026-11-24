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

export {
  esCampoValidable,
  obtenerMensaje,
  aplicarEstado,
  validarYMostrar,
  validarTocados,
  limpiar,
  configurarContador,
};
