
const express = require("express");
// const path = require("path");
// const cookieParser = require("cookie-parser");
// const logger = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const dotenv = require("dotenv");
// const connectDB = require("./db/db");
// const fs = require("fs").promises;
dotenv.config();
const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(helmet());


//Database Connection

// const indexRouter = require("./routes/index");
const adminusersRouter = require("./routes/adminusers");
const Connection = require("./db/db");
const TrainRoute = require("./routes/trainRoute");
const BookingRoute = require("./routes/Booking");
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);
app.use(express.json());
// app.use(express.static(path.join(__dirname, "public")));
// cron_function()
app.get('/', async ()=>{  
  res.send('Hello from server')
})

app.use("/adminusers", adminusersRouter);
app.use("/admin", TrainRoute);
app.use("/user", BookingRoute);


app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});


app.listen(port, async()=>{
    console.log(`listening on ${port}`);
    try {
        Connection
        console.log(`connected DB`);

    } catch (error) {
        
    }
});
