const leer = (coleccion) => {
  try {
    return JSON.parse(localStorage.getItem(coleccion)) ?? [];
  } catch {
    return [];
  }
};

const escribir = (coleccion, datos) =>
  localStorage.setItem(coleccion, JSON.stringify(datos));

export const obtenerTodos = (coleccion) => leer(coleccion);

export const obtenerPorId = (coleccion, id) =>
  leer(coleccion).find((item) => String(item.id) === String(id)) ?? null;

export const crear = (coleccion, dato) => {
  const datos = leer(coleccion);
  datos.push(dato);
  escribir(coleccion, datos);
  return dato;
};

export const actualizar = (coleccion, id, dato) => {
  const datos = leer(coleccion);
  const indice = datos.findIndex((item) => String(item.id) === String(id));

  if (indice === -1) return null;

  datos[indice] = { ...datos[indice], ...dato };
  escribir(coleccion, datos);
  return datos[indice];
};

export const borrar = (coleccion, id) => {
  const datos = leer(coleccion);
  const restantes = datos.filter((item) => String(item.id) !== String(id));

  escribir(coleccion, restantes);
  return restantes.length !== datos.length;
};
