const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);
const generateFakeProducts = require('./utils/fakeProductGenerator');
const MensajesDaoMongoDB = require('./daos/mensajesDaoMongoDB.js');
const ProductosDaoMongoDB = require('./daos/productosDaoMongoDB.js');
const mongoose = require('mongoose');
const { normalize, schema, denormalize } = require('normalizr');

const session = require('express-session');
const MongoStore = require('connect-mongo');

const { engine } = require('express-handlebars');
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(__dirname + '/public'));

//SESSION WITH MONGO
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: 'mongodb+srv://carlaRicciardi:mongoatlas123@cluster0.uzjmdzn.mongodb.net/',
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    }),
    secret: 'secretKey',
    resave: false,
    saveUninitialized: false,
  })
);

//handlebars settings
app.set('view engine', 'hbs');
app.set('views', './views');
app.engine(
  'hbs',
  engine({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
  })
);

//MONGO CONNECTION
async function connectMG() {
  try {
    await mongoose.connect('mongodb+srv://carlaRicciardi:mongoatlas123@cluster0.uzjmdzn.mongodb.net/desafio9?retryWrites=true&w=majority', { useNewUrlParser: true });
    console.log('Conectado a mongo!');
  } catch (e) {
    console.log(e);
    throw 'can not connect to the db';
  }
}

connectMG();

const products = new ProductosDaoMongoDB();
const msgs = new MensajesDaoMongoDB();

//FRONT END (routes)
app.get('/', async (req, res) => {
  if (req.session.user) {
    res.render('main', { usuario: req.session.user });
  } else {
    res.render('login');
  }
});

app.post('/', (req, res) => {
  const { body } = req;
  req.session.user = body.user;
  res.render('main', { usuario: body.user });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/showsessions', (req, res) => {
  res.json(req.session);
});

app.get('/logout', (req, res) => {
  let usuario = req.session.user;
  req.session.destroy((err) => {
    if (err) {
      res.send('No se pudo deslogear');
    } else {
      res.render('logout', { usuario: usuario });
    }
  });
});

app.get('/api/productos-test', (req, res) => {
  const fakeproducts = generateFakeProducts(5);
  res.render('fakeProducts', { fakeproducts });
});

//BACK END

//WEBSOCKET PARA TABLA DE PRODUCTOS
//1) conexion server
io.on('connection', async (socket) => {
  console.log('usuario conectado');
  socket.emit('msgs', await msgs.getAll());
  socket.emit('products', await products.getAll());
  const aux = generateFakeProducts(5);
  socket.emit('prod-test', aux);

  //3) atrapamos el sendProd que hace el front cuando llena el form
  socket.on('newProd', async (data) => {
    await products.save(data);
    const updateList = await products.getAll();
    io.sockets.emit('products', updateList); //se la envio a todos los sockets
  });

  socket.on('newMsg', async (data) => {
    await msgs.save(data);
    const msgsList = msgs.getAll();
    io.sockets.emit('msgs', msgsList);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Servidor http escuchando en el puerto http://localhost:${PORT}`);
});
