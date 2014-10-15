//************************************************************

var application_root = __dirname,
    express = require("express"),
    session = require("express-session"),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    path = require("path"),
    http = require('http'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    app = express(),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    iz = require('iz'),
    ObjectID = require('mongodb').ObjectID,
    passportLocalMongoose = require('passport-local-mongoose'),

    accountRoute = require("./routes/account"),
    userRoute = require("./routes/user"),
    studentRoute = require("./routes/student"),
    managerRoute = require("./routes/manager"),
    utilRoute = require("./routes/util");


// Config
        app.set('port', process.env.PORT || 3000);
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
        app.use(session({ secret: 'nodeclinicakey', resave: true, saveUninitialized: true }));
        app.use(express.static(path.join(__dirname, 'public')));
        app.use(cookieParser());
        app.use(function (req, res, next) {
            if (req.method == 'POST' && req.url == '/login') {

                if (req.body.rememberme) {
                    var hour = 3600000;
                    req.session.cookie.maxAge = 7 * 24 * hour; //1 week
                } else {
                    req.session.cookie.expires = false;
                }
            }
            next();
        });
        app.use(passport.initialize());
        app.use(passport.session());
//************************************************************



var AccountModel = accountRoute.AccountModel;
var UserModel = userRoute.UserModel;
var auth = accountRoute.auth;
var isAuthorized = accountRoute.isAuthorized;




//************************************************************
var connectionString = 'mongodb://localhost:27017/MongoRestFullCRUD';
mongoose.connect(connectionString);

accountRoute.CreateAdmUser();




//************************************************************
// ACCOUNT
app.get('/account/:username', auth, accountRoute.findByUserName);
app.put('/account/:id', auth, accountRoute.putAccount);
app.get('/loggedtest', accountRoute.loggedtest);
app.post('/login', accountRoute.login);
app.get('/logout', accountRoute.logout);

// STUDENTS
app.get('/students', auth, studentRoute.getStudentsAll);
app.get('/students/name/:name', auth, studentRoute.getStudentsByName);
app.get('/students/cpf/:cpf', auth, studentRoute.getStudentsByCpf);
app.get('/students/registration/:registration', auth, studentRoute.getStudentsByRegistration);
app.get('/students/:id', auth, studentRoute.getStudentsById);
app.get('/studentsactive', auth, studentRoute.getStudentsActive);
app.put('/students/:id', auth, studentRoute.putStudent);
app.delete('/students/:id', auth, studentRoute.delStudent);
app.post('/students', auth, studentRoute.postStudent);

// MANAGERS
app.get('/managers', auth, managerRoute.getManagersAll);
app.get('/managers/name/:name', auth, managerRoute.getManagersByName);
app.get('/managers/cpf/:cpf', auth, managerRoute.getManagersByCpf);
app.get('/managers/registration/:registration', auth, managerRoute.getManagersByRegistration);
app.get('/managers/:id', auth, managerRoute.getManagersById);
app.put('/managers/:id', auth, managerRoute.putManager);
app.delete('/managers/:id', auth, managerRoute.delManager);
app.post('/managers', auth, managerRoute.postManager);
//************************************************************

// RELATORIOS
app.get('/relusers', auth, userRoute.getRelUsersAll);
app.get('/xmlcompleteusers', auth, userRoute.getXmlCompleteUsersAll);


// Launch server
http.createServer(app).listen(app.get('port'), function () {
    console.log("Node Clinica Application server listening on port " + app.get('port'));
});