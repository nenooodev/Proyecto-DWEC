# Proyecto-DWEC

## Backlog

- Inicialmente 2 roles: PTIS y alumno ( podría valorar incluir profesor a futuro)
- Registro/Inicio sesión via credenciales iPasen/iSéneca

### Backlog -- Alumno

- El alumno podrá ver a los PTIS del centro, con foto y nombre, detallando además si están en el centro y acceso al horario del mismo PTIS
- El alumno podrá solicitar asistencia a los PTIS, rellenando un formulario siguiendo una serie de casos generales definidos (Ir al baño, Ayuda con ropa, Ayuda en desplazamiento...) e incluyendo la ubicación donde se encuentra. También podrá añadir una observación libre Dicha solicitud (urgente o no) será notificada a los PTIS que estén en el centro.
- Habrá un botón aparte en el menú para enviar solicitudes urgentes, al presionar este botón se abrirá una modal con una cuenta atrás de unos segundos con un botón de cancelar o enviar, cuando se termine esa cuenta atrás se enviará la solicitud automaticamente, la modal es simplemente para evitar el envío accidental de solicitudes urgentes.
- El alumno podrá establecer una ubicación usual en su perfil, en caso de que necesite asistencia y no introduzca ubicación, se intuirá que el alumno se encuentra en esa ubicación usual.


### Backlog -- PTIS

- El PTIS deberá hacer un check-in diario para indicar que está en el centro, a partir de ese momento se marcará su asistencia y podrá recibir notificaciones, al salir del centro, el mismo botón hará un checkout, parando las notificaciones.
- Los PTIS podrán configurar en su perfil su horario habitual de trabajo y la app les notificará en ese tramo horario en caso de que no hayan hecho check-in ese día, para evitar olvidos
- Podrán consultar y editar su horario, que será el mismo que se muestre al alumnado.
- Dentro del horario, los PTIS podrán crear rutinas, solicitudes creadas por ellos mismos que podrán programar para que lleguen en X día a X hora (por ejemplo, si todos los miercoles a las 10:00h juanito tiene que subir a ATECA, pues que esa notificación salte independientemente de que juanito la mande.) Estas rutinas se podrán poner visibles en el horario para el resto del alumnado, o mantenerse ocultos, a criterio del PTIS.
- Podrán ver las solicitudes recibidas, que contendrán foto y nombre del alumno que la emitió, junto con el tipo de problema y si es urgente o no, si el PTIS clica, podrá leer el resto de información (observación y ubicación del alumno). Por cada solicitud, se emitirá paralelamente una notificación. En el caso de las solicitudes urgentes, estas, aparte de notificar, sonaran periodicamente hasta que se resuelvan, y dentro de la app se mostrarán en la parte superior de la pantalla, en forma de un panel rojo persistente.
