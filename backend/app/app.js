const express = require("express");
var cors = require('cors')

const signatureRouter = require("./routers/signatureRouter");
const teacherRouter = require("./routers/teacherRouter");
const studentRouter = require("./routers/studentRouter")

const app = express();

const corsOptions = {

  exposedHeaders: 'Authorization',
};

app.use(cors(corsOptions));

//app.set('view engine', 'pug');
//app.set('views', './app/views');
app.use(express.static("./public"));

//app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(teacherRouter);
app.use(signatureRouter);
app.use(studentRouter)

module.exports = app;
