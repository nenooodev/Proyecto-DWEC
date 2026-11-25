# Proyecto-DWEC

## Backlog

- [ ] Inicialmente 2 roles: PTIS y alumno (podría valorar incluir profesor a futuro)
- [x] Registro/Inicio de sesión mediante formulario (credenciales simuladas de iPasen/iSéneca, sin backend)

### Backlog -- Alumno

- [ ] El alumno podrá ver a los PTIS del centro, con foto y nombre, detallando además si están en el centro y acceso al horario del mismo PTIS
- [ ] El alumno podrá solicitar asistencia a los PTIS, rellenando un formulario siguiendo una serie de casos generales definidos (Ir al baño, Ayuda con ropa, Ayuda en desplazamiento...) e incluyendo la ubicación donde se encuentra. También podrá añadir una observación libre Dicha solicitud (urgente o no) será notificada a los PTIS que estén en el centro.
- [ ] Habrá un botón aparte en el menú para enviar solicitudes urgentes, al presionar este botón se abrirá una modal con una cuenta atrás de unos segundos con un botón de cancelar o enviar, cuando se termine esa cuenta atrás se enviará la solicitud automaticamente, la modal es simplemente para evitar el envío accidental de solicitudes urgentes.
- [ ] El alumno podrá establecer una ubicación usual en su perfil, en caso de que necesite asistencia y no introduzca ubicación, se intuirá que el alumno se encuentra en esa ubicación usual.

### Backlog -- PTIS

- [ ] El PTIS deberá hacer un check-in diario para indicar que está en el centro, a partir de ese momento se marcará su asistencia y podrá recibir notificaciones, al salir del centro, el mismo botón hará un checkout, parando las notificaciones.
- [ ] Los PTIS podrán configurar en su perfil su horario habitual de trabajo y la app les notificará en ese tramo horario en caso de que no hayan hecho check-in ese día, para evitar olvidos
- [ ] Podrán consultar y editar su horario, que será el mismo que se muestre al alumnado.
- [ ] Dentro del horario, los PTIS podrán crear rutinas, solicitudes creadas por ellos mismos que podrán programar para que lleguen en X día a X hora (por ejemplo, si todos los miercoles a las 10:00h juanito tiene que subir a ATECA, pues que esa notificación salte independientemente de que juanito la mande.) Estas rutinas se podrán poner visibles en el horario para el resto del alumnado, o mantenerse ocultos, a criterio del PTIS.
- [ ] Podrán ver las solicitudes recibidas, que contendrán foto y nombre del alumno que la emitió, junto con el tipo de problema y si es urgente o no, si el PTIS clica, podrá leer el resto de información (observación y ubicación del alumno). Por cada solicitud, se emitirá paralelamente una notificación. En el caso de las solicitudes urgentes, estas, aparte de notificar, sonaran periodicamente hasta que se resuelvan, y dentro de la app se mostrarán en la parte superior de la pantalla, en forma de un panel rojo persistente.

### Backlog -- Hito 2

- [x] Formulario de registro con nombre de usuario, correo, contraseña, repetición de contraseña, fecha de nacimiento y aceptación de condiciones
- [x] Validación propia en JavaScript (blur e input) con errores junto a cada campo y sin `alert`
- [x] La contraseña no se guarda nunca en el navegador
- [x] Vista «Usuarios» con listado, edición y borrado
- [x] Un único formulario para crear y editar usuarios, relleno al editar
- [x] Formulario de contacto con nombre, correo, teléfono, motivo y mensaje
- [x] Teléfono opcional validado con expresión regular y obligatorio al marcar «Prefiero que me llaméis»
- [x] Mensaje con longitud mínima y máxima y contador de caracteres
- [x] Cookie con el nombre y el correo del último envío, con caducidad de 7 días
- [x] Vista «Mensajes enviados» con borrado individual y confirmación
- [x] Persistencia en `localStorage` y actualización de las vistas sin recargar

## Hito 2

Formularios de registro, gestión de usuarios y contacto, con validación propia en JavaScript (sin validación nativa del navegador) y persistencia en `localStorage`.

### Mapa de validación

#### Registro / Login (`login.html`, `js/acceso.js`)

| Campo                 | Regla                                                            | Mensaje de error                                                                                                                |
| --------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `usuario`             | Obligatorio, entre 4 y 30 caracteres                             | `Este campo es obligatorio` · `El usuario debe tener al menos 4 caracteres` · `No puede superar los 30 caracteres`              |
| `correo`              | Obligatorio, expresión regular de email, máximo 254 caracteres   | `Este campo es obligatorio` · `Introduce un email válido` · `No puede superar los 254 caracteres`                               |
| `contrasena`          | Obligatoria, 8-64 caracteres, al menos una mayúscula y un número | `Este campo es obligatorio` · `La contraseña debe tener al menos 8 caracteres, una mayúscula y un número`                       |
| `repetir_contrasena`  | Obligatoria y debe coincidir con `contrasena`                    | `Este campo es obligatorio` · `Los valores no coinciden`                                                                        |
| `fecha_nacimiento`    | Obligatoria, no futura, fecha válida y edad entre 12 y 120 años  | `Este campo es obligatorio` · `Introduce una fecha válida` · `Debes tener al menos 12 años` · `No puedes tener más de 120 años` |
| `aceptar-condiciones` | Casilla obligatoria                                              | `Debes aceptar las condiciones de la aplicación`                                                                                |

#### Usuarios (`usuarios.html`, `js/usuarios.js`)

| Campo                | Regla                                                           | Mensaje de error                                                                                                                |
| -------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `usuario`            | Obligatorio, entre 4 y 30 caracteres, sin duplicados            | `Este campo es obligatorio` · `El usuario debe tener al menos 4 caracteres` · `Ya existe otro usuario con ese nombre o correo.` |
| `correo`             | Obligatorio, expresión regular de email, máximo 254 caracteres  | `Este campo es obligatorio` · `Introduce un email válido` · `No puede superar los 254 caracteres`                               |
| `contrasena`         | Obligatoria al crear, 8-64 caracteres, mayúscula y número       | `Este campo es obligatorio` · `La contraseña debe tener al menos 8 caracteres, una mayúscula y un número`                       |
| `repetir_contrasena` | Obligatoria al crear y debe coincidir con `contrasena`          | `Este campo es obligatorio` · `Los valores no coinciden`                                                                        |
| `fecha_nacimiento`   | Obligatoria, no futura, fecha válida y edad entre 12 y 120 años | `Este campo es obligatorio` · `Introduce una fecha válida` · `Debes tener al menos 12 años` · `No puedes tener más de 120 años` |

#### Contacto (`contacto-soporte.html`, `js/contacto.js`)

| Campo              | Regla                                                                                                                     | Mensaje de error                                                                                          |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `nombre`           | Obligatorio, máximo 80 caracteres                                                                                         | `Este campo es obligatorio` · `No puede superar los 80 caracteres`                                        |
| `correo`           | Obligatorio, expresión regular de email, máximo 254 caracteres                                                            | `Este campo es obligatorio` · `Introduce un email válido` · `No puede superar los 254 caracteres`         |
| `telefono`         | Opcional; si se rellena, 9 dígitos que empiezan por 6-9 (admite `+34`). Obligatorio si se marca «Prefiero que me llaméis» | `Introduce un teléfono válido de 9 dígitos` · `Este campo es obligatorio`                                 |
| `tipo_motivo`      | Obligatorio (selección de un motivo)                                                                                      | `Este campo es obligatorio`                                                                               |
| `mensaje`          | Obligatorio, entre 20 y 500 caracteres, con contador en vivo                                                              | `Este campo es obligatorio` · `Debe tener al menos 20 caracteres` · `No puede superar los 500 caracteres` |
| `prefiero_llamada` | Booleano; al marcarlo activa el `required` del teléfono                                                                   | Sin mensaje propio: el error se muestra en `telefono`                                                     |

### Qué he hecho

- **Registro / Login**: formulario con nombre de usuario, correo, contraseña, repetición de contraseña, fecha de nacimiento y casilla de aceptación de condiciones.
- **Validación del registro**: reglas propias en JavaScript con `novalidate`, leyendo `required`, `type`, `min`, `max`, `minlength` y `maxlength` del HTML.
- **Seguridad**: la contraseña se usa solo para validar el formulario y nunca se guarda; en `localStorage` se almacenan únicamente los datos del perfil.
- **Duplicados**: comprobación de usuario y correo ya registrados, con mensaje específico.
- **Vista Usuarios**: listado con iniciales, nombre y correo de cada usuario registrado.
- **Crear y editar con el mismo formulario**: al editar se rellenan los campos, se ocultan las contraseñas y se conserva el resto de datos.
- **Borrado de usuarios**: confirmación previa con `confirm()` y delegación de eventos desde la lista.
- **Actualización sin recargar**: tras crear, editar o borrar, la lista se repinta al momento.
- **Formulario de contacto**: nombre, correo, teléfono opcional, motivo con opciones propias y mensaje.
- **Validación entre campos**: marcar «Prefiero que me llaméis» convierte el teléfono en obligatorio.
- **Teléfono**: validación con expresión regular solo cuando se rellena.
- **Mensaje**: longitud mínima de 20 y máxima de 500 caracteres, con contador que se actualiza mientras se escribe.
- **Cookie de recordatorio**: se guardan el nombre y el correo del último envío con caducidad de 7 días y se rellenan automáticamente en la siguiente visita.
- **Vista Mensajes enviados**: listado de los mensajes guardados con fecha formateada y botón de borrado individual con confirmación.
- **Persistencia**: usuarios y mensajes se guardan en `localStorage` mediante `js/almacen.js`, por lo que siguen ahí al recargar.
- **Conversión de tipos**: las casillas se guardan como booleanos y las fechas en formato ISO.
- **Validación accesible**: errores junto a cada campo, `aria-invalid` y `aria-describedby` en los tres formularios, foco en el primer campo con error y ningún `alert`.
- **Código compartido**: reglas en `js/validacion.js` y utilidades de formulario (estado «tocado», errores, contador) en `js/formularios.js`.

### Qué falta

Nada. El Hito 2 está completo.

### Qué me ha costado más

La parte más laboriosa ha sido el debuggeo una vez que el grueso de la app ya estaba implementado. Con la funcionalidad principal terminada, localizar los fallos que rompían los flujos fue más costoso que escribir el código nuevo: estados de error que no se limpiaban, el foco tras validar, los campos ocultos de contraseña al editar y los ids de las fichas de contacto que no coincidían con los registros de `localStorage`...

## Sitemap

### Sitemap -- Global

| Pantalla     | Datos                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Login**    | Formulario para introducir credenciales iPasen/iSéneca (usuario y contraseña); rol detectado tras autenticar (alumno o PTIS) y redirección al inicio correspondiente. Al enviarlo, el usuario queda registrado en `localStorage` (la contraseña nunca se guarda). Incluye un checkbox obligatorio de aceptación de condiciones, que se guarda como booleano (`condiciones`) junto al usuario en `localStorage` y no se muestra en la gestión de usuarios. |
| **Usuarios** | Listado de usuarios registrados con acciones de editar y eliminar; un único formulario para crear y editar (al editar, se rellena con los datos del usuario); la contraseña solo se pide al crear.                                                                                                                                                                                                                                                        |

### Sitemap -- Alumno

| Pantalla            | Datos                                                                                                                                                             |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Inicio (alumno)** | Usuario autenticado (nombre y foto); accesos a Consultar PTIS, Solicitar asistencia y Emitir alerta urgente                                                       |
| **Consultar PTIS**  | Listado de PTIS del centro con foto, nombre y disponibilidad (en el centro / fuera); acceso al horario de cada PTIS.                                              |
| **Solicitar ayuda** | Formulario con caso general (ir al baño, ayuda con ropa, ayuda en desplazamiento…), ubicación del alumno (si se deja vacía se toma la usual) y observación libre; |
| **Modal urgencias** | Cuenta atrás de unos segundos, botón Cancelar y botón Enviar; al agotarse el tiempo se envía automáticamente.                                                     |
| **Perfil (alumno)** | Nombre y foto; ubicación usual, datos de sesión (iPasen/iSéneca) y cerrar sesión.                                                                                 |

### Sitemap -- PTIS

| Pantalla                  | Datos                                                                                                                                                                                     |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Check-in / out**        | Pantalla previa a la principal con un único botón conmutable: toggle check-in/out                                                                                                         |
| **Inicio (PTIS)**         | Accesos a Gestionar horario, Solicitudes recibidas y Gestionar rutinas.                                                                                                                   |
| **Solicitudes recibidas** | Listado de solicitudes con foto y nombre del alumno, tipo de problema y si es urgente o no; cada solicitud genera una notificación y las urgentes suenan periódicamente hasta resolverse. |
| **Detalle de solicitud**  | Al pulsar una solicitud: foto y nombre del alumno, tipo de problema, urgencia, observación libre, ubicación del alumno y hora de emisión; acciones de marcar como resuelta.               |
| **Gestión horario**       | Horario habitual por días y tramos, edición de tramos, rutinas visibles asociadas y vista previa del horario tal como lo ve el alumnado.                                                  |
| **Rutinas**               | Lista de rutinas con título/descripción, día/s de la semana, hora, alumno o caso implicado, visibilidad (visible en el horario / oculta) y estado (activa / inactiva).                    |
| **Perfil (PTIS)**         | Nombre y foto; horario de trabajo habitual editable; activación del recordatorio de check-in en su tramo horario; datos de sesión y cerrar sesión.                                        |
