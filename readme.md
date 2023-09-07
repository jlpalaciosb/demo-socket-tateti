## ¡Bienvenido a Demo Socket Tateti!

Esta es una aplicación web creada utilizando NodeJS, EJS, Socket.io, MongoDB y Redis.

## Cómo empezar con Docker Compose

Si desea hacerlo sencillo, Docker Compose es su aliado. Solo tiene que hacer lo siguiente:

```
docker compose up
```

¡Listo! Su aplicación ya estará lista y funcionando. Visite http://localhost:8880 con su navegador.

## Si prefiere hacerlo sin Docker

Si prefiere hacerlo a su manera, no se preocupe, también tenemos instrucciones para usted. Solo asegúrese de tener lo siguiente instalado en su máquina:

- MongoDB, para el almacenamiento principal de datos.
- Redis, para mantener datos accesibles a mayor velocidad.
- NodeJS, porque es el motor de la aplicación.

Una vez que tenga todo eso listo, siga estos pasos:

1. Cree su archivo .env a partir del ejemplo:

```
cp .env.example .env
```

2. Instale las dependencias:

```
npm install
```

3. Inicie la aplicación:

```
npm run dev
```

¡Eso es todo! Su aplicación estará en funcionamiento, lista para iniciar partidas de Tateti y jugar en tiempo real con un amigo.

¿Tiene preguntas o encuentra algún problema? ¡No dude en ponerse en contacto conmigo!

<!--
TODO:
- socket.io
- cache db: for online games
- no sql db: store games
- cookie sesion id
- responsive
- emparejamiento
- estado conexion jugadores
- reconexion (auto) (sin recargar pagina)
- continuar partida (recargando pagina url juego)
- control de tiempo!
- redis array
- docker compose (easy demo, github)
notas:
- crear room socket: id room = id partida
- asumir que un jugador juega solo un juego a la vez? no da igual
-->
