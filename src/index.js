const express = require('express');
const dotenv = require('dotenv').config();
const path = require('path');
const webRoutes = require('./routes/web');
const cookieParser = require('cookie-parser');
const { mwSetUser } = require('./routes/middleware');
const http = require('http');
const initSocket = require('./routes/socket');

// crear aplicacion node express
const app = express();

// configuraciones
app.set('port', process.env.PORT);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('appname', 'app demo ws');

// middlewares y rutas
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(mwSetUser);
app.use(webRoutes);

const server = http.createServer(app);
initSocket(server);

// iniciar servidor web
server.listen(app.get('port'), () => {
    console.log('app on port ' + app.get('port'));
});
