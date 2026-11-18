import { PTIS, solicitudes } from './datos.js';

const obtenerIniciales = (nombreCompleto) => {
  const [nombre, primerApellido] = nombreCompleto.trim().split(/\s+/);

  return `${nombre[0]}${primerApellido[0]}`.toUpperCase();
};

const crearFichaSolicitud = (solicitud) => {
  const item = document.createElement('li');
  item.dataset.id = solicitud.id;

  const enlace = document.createElement('a');
  enlace.className = 'ficha-solicitud';

  const avatar = document.createElement('span');
  avatar.className = 'ficha-solicitud__avatar';
  avatar.ariaHidden = 'true';
  avatar.textContent = obtenerIniciales(solicitud.alumno.nombre);

  const detalle = document.createElement('div');
  detalle.className = 'ficha-solicitud__detalle';

  const nombre = document.createElement('p');
  nombre.className = 'ficha-solicitud__nombre';
  nombre.textContent = solicitud.alumno.nombre;

  const motivo = document.createElement('p');
  motivo.className = 'ficha-solicitud__motivo';
  motivo.textContent = solicitud.titulo;

  const meta = document.createElement('p');
  meta.className = 'ficha-solicitud__meta';

  const iconoReloj = document.createElement('img');
  iconoReloj.src = 'assets/icons/reloj-tenue.svg';
  iconoReloj.alt = '';

  const hora = document.createElement('time');
  hora.dateTime = solicitud.hora;
  hora.textContent = solicitud.hora;

  const separador = document.createElement('img');
  separador.src = 'assets/icons/separador.svg';
  separador.alt = '';

  meta.append(iconoReloj, hora, separador, solicitud.localizacion);

  detalle.append(nombre, motivo, meta);
  enlace.append(avatar, detalle);
  item.append(enlace);

  return item;
};

const cargarSolicitudes = () => {
  const lista = document.querySelector('.solicitudes__lista');

  if (!lista) return;

  const fragmento = document.createDocumentFragment();

  solicitudes.forEach((solicitud) => {
    fragmento.append(crearFichaSolicitud(solicitud));
  });

  lista.append(fragmento);
};

const crearFichaPtis = (ptis) => {
  const item = document.createElement('li');
  item.dataset.id = ptis.id;
  item.className = 'ficha-ptis';

  const enlace = document.createElement('a');

  const persona = document.createElement('div');
  persona.className = 'ficha-ptis__persona';

  const avatar = document.createElement('span');
  avatar.className = 'ficha-ptis__avatar';
  avatar.ariaHidden = 'true';
  avatar.textContent = obtenerIniciales(ptis.nombre);

  const datos = document.createElement('div');
  datos.className = 'ficha-ptis__datos';

  const nombre = document.createElement('p');
  nombre.className = 'ficha-ptis__nombre';
  nombre.textContent = ptis.nombre;

  const acciones = document.createElement('div');
  acciones.className = 'ficha-ptis__acciones';

  const estado = document.createElement('span');
  estado.className = ptis.disponibilidad
    ? 'estado estado--dentro'
    : 'estado estado--fuera';

  const iconoEstado = document.createElement('img');
  iconoEstado.src = ptis.disponibilidad
    ? 'assets/icons/punto-verde.svg'
    : 'assets/icons/punto-gris.svg';
  iconoEstado.alt = '';

  estado.append(iconoEstado, ptis.disponibilidad ? 'En el centro' : 'Fuera del centro');

  const flecha = document.createElement('span');
  flecha.className = 'ficha-ptis__flecha';
  flecha.ariaHidden = 'true';

  const iconoFlecha = document.createElement('img');
  iconoFlecha.src = 'assets/icons/flecha-derecha.svg';
  iconoFlecha.alt = '';

  flecha.append(iconoFlecha);
  acciones.append(estado, flecha);
  datos.append(nombre);
  persona.append(avatar, datos);
  enlace.append(persona, acciones);
  item.append(enlace);

  return item;
};

const cargarPtis = () => {
  const lista = document.querySelector('.lista-ptis');

  if (!lista) return;

  const fragmento = document.createDocumentFragment();

  PTIS.forEach((ptis) => {
    fragmento.append(crearFichaPtis(ptis));
  });

  lista.append(fragmento);
};

const crearHorario = (ptis) => {
  const horario = document.createElement('table');
  const horarioHead = document.createElement('thead');
  const horarioBody = document.createElement('tbody');
  const dias = Object.keys(ptis.horario);
  const filaHead = document.createElement('tr');
  const esquina = document.createElement('th');
  filaHead.append(esquina);

  dias.forEach((dia) => {
    const celdaDia = document.createElement('th');
    celdaDia.textContent = dia;
    filaHead.append(celdaDia);
  });
  horarioHead.append(filaHead);
  horario.append(horarioHead);

  const horas = Object.keys(ptis.horario[dias[0]]);
  horas.forEach((hora) => {
    const fila = document.createElement('tr');
    const celdaHora = document.createElement('td');
    celdaHora.textContent = hora;
    fila.append(celdaHora);
    dias.forEach((dia) => {
      const celda = document.createElement('td');
      celda.textContent = ptis.horario[dia][hora];
      fila.append(celda);
    });
    horarioBody.append(fila);
  });
  horario.append(horarioBody);
  return horario;
};

const crearModal = (ptis) => {
  const modal = document.createElement('article');
  const title = document.createElement('h1');
  title.textContent = `Horario de ${ptis.nombre}`;
  const horario = crearHorario(ptis);
};
const mostrarHorario = (e) => {
  const targetObj = PTIS.find((it) => it.id == e.target.dataset.id);
  crearModal(targetObj);
};
cargarSolicitudes();
cargarPtis();
