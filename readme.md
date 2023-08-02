## Bienvenidos a Demo Socket Tateti!

Esta es una aplicación web construida con sencillez utilizando NodeJS, EJS, Socket.io, MongoDB y Redis.

## Cómo empezar con Docker Compose

Si te gustan las cosas sencillas, Docker Compose es tu aliado. Solo tienes que hacer lo siguiente:

```
docker compose up
```

¡Listo! Tu aplicación estará lista y funcionando en un abrir y cerrar de ojos. Visita http://localhost:8880 en tu navegador.

## Si prefieres hacerlo sin Docker

Si eres un aventurero y prefieres hacer las cosas a tu manera, no te preocupes, también tenemos instrucciones para ti. Solo asegúrate de tener lo siguiente instalado en tu máquina:

- MongoDB, porque a veces necesitamos un lugar para guardar cosas.
- Redis, para añadir un toque de magia.
- NodeJS, porque es el motor detrás de todo.

Una vez que tengas todo eso listo, sigue estos pasos:

1. Crea tu archivo .env a partir del ejemplo:

```
cp .env.example .env
```

2. Instala las dependencias:

```
npm install
```

3. Inicia la aplicación:

```
npm run dev
```

¡Y eso es todo! Tu aplicación estará en funcionamiento, lista para que disfrutes de una partida de Tateti en tiempo real con un amigo.

¿Tienes preguntas o encuentras algún problema? ¡No dudes en ponerte en contacto conmigo! ¡Diviértete explorando y jugando! 🎉

## Notas

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