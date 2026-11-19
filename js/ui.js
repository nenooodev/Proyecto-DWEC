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

const ID_TITULO_HORARIO = 'titulo-horario';

const obtenerDiaActual = (dias) => dias[new Date().getDay()];

const crearHorario = (ptis) => {
  const horario = document.createElement('table');
  horario.className = 'tabla-horario';

  const leyenda = document.createElement('caption');
  leyenda.className = 'visualmente-oculto';
  leyenda.textContent = `Horario semanal de ${ptis.nombre}`;
  horario.append(leyenda);

  const horarioHead = document.createElement('thead');
  horarioHead.className = 'tabla-horario__cabecera';

  const horarioBody = document.createElement('tbody');
  horarioBody.className = 'tabla-horario__cuerpo';

  const dias = Object.keys(ptis.horario);
  const diaActual = obtenerDiaActual(dias);
  const filaHead = document.createElement('tr');
  filaHead.className = 'tabla-horario__fila';

  const esquina = document.createElement('th');
  esquina.className = 'tabla-horario__esquina';
  filaHead.append(esquina);

  dias.forEach((dia) => {
    const celdaDia = document.createElement('th');
    celdaDia.className = 'tabla-horario__dia';
    celdaDia.textContent = dia;

    if (dia === diaActual) celdaDia.classList.add('tabla-horario__dia--hoy');

    filaHead.append(celdaDia);
  });

  horarioHead.append(filaHead);
  horario.append(horarioHead);

  const horas = Object.keys(ptis.horario[dias[0]]);
  horas.forEach((hora) => {
    const fila = document.createElement('tr');
    fila.className = 'tabla-horario__fila';
    const celdaHora = document.createElement('th');
    celdaHora.className = 'tabla-horario__hora';
    celdaHora.textContent = hora;
    fila.append(celdaHora);

    dias.forEach((dia) => {
      const celda = document.createElement('td');
      celda.className = 'tabla-horario__celda';
      celda.textContent = ptis.horario[dia][hora];
      fila.append(celda);
    });

    horarioBody.append(fila);
  });

  horario.append(horarioBody);
  return horario;
};

const crearBotonCerrar = () => {
  const boton = document.createElement('button');
  boton.className = 'modal__cerrar';
  boton.type = 'button';
  boton.dataset.accion = 'cerrar';
  boton.setAttribute('aria-label', 'Cerrar horario');

  const icono = document.createElement('img');
  icono.className = 'modal__icono-cerrar';
  icono.src = 'assets/icons/cerrar.svg';
  icono.alt = '';

  boton.append(icono);

  return boton;
};

const crearModal = (ptis) => {
  const modal = document.createElement('article');
  modal.className = 'modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', ID_TITULO_HORARIO);

  const fondo = document.createElement('div');
  fondo.className = 'modal__fondo';
  fondo.dataset.accion = 'cerrar';

  const caja = document.createElement('div');
  caja.className = 'modal__caja modal__caja--horario';

  const cabecera = document.createElement('header');
  cabecera.className = 'modal__cabecera';

  const titulo = document.createElement('h2');
  titulo.className = 'modal__titulo';
  titulo.id = ID_TITULO_HORARIO;
  titulo.textContent = `Horario de ${ptis.nombre}`;

  const cuerpo = document.createElement('div');
  cuerpo.className = 'modal__cuerpo';
  cuerpo.append(crearHorario(ptis));

  cabecera.append(titulo, crearBotonCerrar());
  caja.append(cabecera, cuerpo);
  modal.append(fondo, caja);

  return modal;
};

let modalHorario = null;

const cerrarHorario = () => {
  if (!modalHorario) return;

  modalHorario.remove();
  modalHorario = null;
};

const mostrarHorario = (ficha) => {
  const ptis = PTIS.find((it) => String(it.id) === ficha.dataset.id);

  if (!ptis) return;

  cerrarHorario();
  modalHorario = crearModal(ptis);
  document.body.append(modalHorario);
};

cargarSolicitudes();
cargarPtis();

document.addEventListener('click', (e) => {
  if (e.target.closest('[data-accion="cerrar"]')) {
    cerrarHorario();
    return;
  }

  const ficha = e.target.closest('.ficha-ptis');

  if (!ficha) return;

  mostrarHorario(ficha);
});
