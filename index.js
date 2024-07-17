
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT || 8080;
const app = express();
app.use(cors());

const adminusersRouter = require("./routes/adminusers");
const Connection = require("./db/db");
const TrainRoute = require("./routes/trainRoute");
const BookingRoute = require("./routes/Booking");
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);
app.use(express.json());

app.get('/', async ()=>{  
  res.send('Hello from server')
})

app.use("/adminusers", adminusersRouter);
app.use("/admin", TrainRoute);
app.use("/user", BookingRoute);

app.listen(port, async()=>{
    console.log(`listening on ${port}`);
    try {
        Connection
        console.log(`connected DB`);

    } catch (error) {
        
    }
});
