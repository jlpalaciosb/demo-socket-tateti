const express = require('express');
const path = require('path');
const webRoutes = require('./routes/web');
const cookieParser = require('cookie-parser');
const { mwSetUser } = require('./routes/middleware');

// crear aplicacion node express
const app = express();

// configuraciones
app.set('port', 8080);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('appname', 'app demo ws');

// middlewares y rutas
// app.use((req, res, next) => {
//     res.send('hello world!')
// })
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(mwSetUser);
app.use(webRoutes);

// iniciar servidor web
app.listen(app.get('port'));
console.log('app on port ' + app.get('port'));
