import { crear, obtenerTodos } from './almacen.js';
import {
  esCampoValidable,
  aplicarEstado,
  validarYMostrar,
  validarTocados,
  limpiar,
} from './formularios.js';
import {
  validarConfirmacion,
  validarContrasena,
  validarEmail,
  validarFecha,
  validarUsuario,
} from './validacion.js';

/**
 * Configuración del formulario de acceso (login).
 */

const toggleContrasena = (e) => {
  if (e.target.closest('.campo__boton-ojo')) {
    const ojo = e.target.closest('.campo__boton-ojo');
    const input = ojo.parentElement.querySelector('input');
    input.type === 'text' ? (input.type = 'password') : (input.type = 'text');
  }
};

export const configurarAcceso = (formulario) => {
  const mensajeError = document.querySelector('#acceso-error');
  const campos = [...formulario.elements].filter(esCampoValidable);
  const casillaCondiciones = formulario.elements.condiciones;
  const errorCondiciones = document.querySelector('#error-aceptar-condiciones');

  const mostrarError = (mensaje) => {
    mensajeError.textContent = mensaje;
    mensajeError.hidden = false;
  };

  const ocultarError = () => {
    mensajeError.textContent = '';
    mensajeError.hidden = true;
  };

  const mostrarErrorCondiciones = (mensaje) => {
    errorCondiciones.textContent = mensaje;
    errorCondiciones.hidden = false;
    casillaCondiciones.setAttribute('aria-invalid', 'true');
  };

  const ocultarErrorCondiciones = () => {
    errorCondiciones.textContent = '';
    errorCondiciones.hidden = true;
    casillaCondiciones.setAttribute('aria-invalid', 'false');
  };

  casillaCondiciones.addEventListener('change', ocultarErrorCondiciones);

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

    if (!casillaCondiciones.checked) {
      mostrarErrorCondiciones('Debes aceptar las condiciones de la aplicación');
      casillaCondiciones.focus();
      return;
    }

    const datos = new FormData(formulario);
    const usuario = datos.get('usuario').trim();
    const correo = datos.get('correo').trim().toLowerCase();
    const fechaNacimiento = datos.get('fecha_nacimiento');

    // Evitamos duplicados por nombre o correo.
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
      condiciones: true,
    });

    limpiar(campos);
    formulario.reset();
    window.location.href = 'index.html';
  });

  formulario.addEventListener('input', ocultarError);
  document.addEventListener('click', toggleContrasena);
};
