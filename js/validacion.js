const obtenerAnios = (valor) => {
  const nacimiento = new Date(valor);
  const hoy = new Date();
  const anios =
    hoy.getFullYear() -
    nacimiento.getFullYear() -
    Number(
      hoy.getMonth() < nacimiento.getMonth() ||
        (hoy.getMonth() === nacimiento.getMonth() &&
          hoy.getDate() < nacimiento.getDate()),
    );

  return anios;
};

const valorDe = (campo) => {
  if (campo.type === 'password' || campo.type === 'date') {
    return campo.value;
  }

  return campo.value.trim();
};

export const validarUsuario = (campo) => {
  if (campo.minLength <= 0) {
    return null;
  }

  const valor = valorDe(campo);

  return valor.length >= campo.minLength
    ? null
    : `El usuario debe tener al menos ${campo.minLength} caracteres`;
};

export const validarContrasena = (campo) => {
  const valor = campo.value;
  const cumpleLongitud = campo.minLength <= 0 || valor.length >= campo.minLength;
  const cumpleMayuscula = [...valor].some((caracter) => /[A-ZÁÉÍÓÚÑ]/.test(caracter));
  const cumpleNumero = [...valor].some((caracter) => /\d/.test(caracter));

  if (cumpleLongitud && cumpleMayuscula && cumpleNumero) {
    return null;
  }

  if (campo.minLength > 0) {
    return `La contraseña debe tener al menos ${campo.minLength} caracteres, una mayúscula y un número`;
  }

  return 'La contraseña debe tener una mayúscula y un número';
};

/**
 * Valida una fecha usando los límites `min` y `max` del propio campo. Si el
 * campo no define alguno de ellos, esa comprobación no se aplica.
 */
export const validarFecha = (campo) => {
  const valor = campo.value;

  if (!valor || Number.isNaN(new Date(valor).getTime())) {
    return 'Introduce una fecha válida';
  }

  const fecha = new Date(valor);

  if (campo.max && fecha > new Date(campo.max)) {
    return `Debes tener al menos ${obtenerAnios(campo.max)} años`;
  }

  if (campo.min && fecha < new Date(campo.min)) {
    return `No puedes tener más de ${obtenerAnios(campo.min)} años`;
  }

  return null;
};

export const validarTelefono = (campo) =>
  /^(?:\+34\s?)?[6789]\d{8}$/.test(campo.value.trim())
    ? null
    : 'Introduce un teléfono válido de 9 dígitos';

export const validarEmail = (campo) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campo.value.trim())
    ? null
    : 'Introduce un email válido';

export const validarConfirmacion = (campo, campoConfirmacion) =>
  campo.value === campoConfirmacion.value ? null : 'Los valores no coinciden';
