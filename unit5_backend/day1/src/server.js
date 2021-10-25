const express = require("express");
const connect = require("./configs/db")

const app = express();
const userController = require("./controllers/userController")

app.use(express.json());

app.use("/users",userController)

app.listen(2222,async ()=>{
    await connect();
    console.log("Listening to port 2222")
})

