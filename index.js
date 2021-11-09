const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
//const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const db = require('./src/config/db/index');
const route = require('./src/routes');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const nameUser = require('./src/app/middleware/nameUser');

//express-session
app.set('trust proxy', 1);
app.use(
    session({
        secret: 'keyboardcat',
        resave: false,
        saveUninitialized: true,
        cookie: {
            //secure: true
            maxAge: 600000,
        },
    }),
);
//flash
app.use(flash());
//method
app.use(methodOverride('_method'));

// client -> sever
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.static(path.join(__dirname, 'src/public')));
app.use(express.json());
// handlbars
app.engine(
    'hbs',
    exphbs({
        extname: '.hbs',
        helpers: {
            name: (fullname) => {
                const a = fullname.split(' ').slice(-1).toString();
                return a.charAt(0).toUpperCase() + a.slice(1);
            },
            sum: (a, b) => a + b,
            vnd: (a ) => a.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }),
        },
        
    }),
   
);
app.use(flash());
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'src/resources/views'));
// morgan
//app.use(morgan('combined'));
//middlewareE;
app.use(nameUser);
// routes init
route(app);
// connect db
db.connect();

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
