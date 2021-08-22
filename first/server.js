
const { response, request } = require("express");
const express = require("express");

const user = require("./user.json")

const app = express();

let users = [
    {
        id:"one",
        name:"mudd"
    },
    {
        id:"two",
        name:"kirito"
    },
    {
        id:"three",
        name:"kaneki"
    }
]

app.get("/", function(request,response){
    return response.send("Welcome to Home page");
})

app.get("/users", function(request,response){
    return response.send({users});
})

app.post("/users",function(request,response){
    return response.send(user);
})

app.patch("/users/:id",(request,response)=>{
    user.id = 1234;
    return response.send(user)
})

app.delete("/users/:id",(request,response)=>{
    delete user.id;
    return response.send(user)
})



app.listen(5000,()=>{
    console.log("hey port 5000")
})