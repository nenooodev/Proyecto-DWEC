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

export const validarUsuario = (valor) =>
  valor.length >= 4 ? null : 'El usuario debe tener al menos 4 caracteres';

export const validarContrasena = (valor) =>
  valor.length >= 8 &&
  [...valor].some((caracter) => /[A-ZÁÉÍÓÚÑ]/.test(caracter)) &&
  [...valor].some((caracter) => /\d/.test(caracter))
    ? null
    : 'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número';

export const validarFecha = (valor) => {
  if (!valor || Number.isNaN(new Date(valor).getTime())) {
    return 'Introduce una fecha válida';
  }

  if (new Date(valor) > new Date()) {
    return 'La fecha no puede ser futura';
  }

  const anios = obtenerAnios(valor);
  if (anios < 12 || anios > 120) {
    return 'Debes tener entre 12 y 120 años';
  }

  return null;
};

export const validarTelefono = (valor) =>
  /^(?:\+34\s?)?[6789]\d{8}$/.test(valor.trim())
    ? null
    : 'Introduce un teléfono válido de 9 dígitos';

export const validarEmail = (valor) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim()) ? null : 'Introduce un email válido';

export const validarConfirmacion = (valor, valor2) =>
  valor === valor2 ? null : 'Los valores no coinciden';
