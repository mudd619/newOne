
const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

const User = require("../models/userModel");
const {send,sendAdmin} = require("../utils/sendmail");

router.post("/",async (req,res)=>{
    try{
        const data = await User.create(req.body);

        await send({first : data.first_name,last : data.last_name,email:data.email})
        await sendAdmin({first : data.first_name,last : data.last_name})
        res.send(data)
    }
    catch(err){
        console.log(err)
        res.status(400).send(err.message)
    }
})

router.get("/",async (req,res)=>{
    try{
        const page = +req.query.page || 1;
        const size = +req.query.limit || 5;
        const offset = (page-1)*size;

        

        const data = await User.find().skip(offset).limit(size).lean().exec();
        res.send(data)
    }
    catch(err){
        res.status(400).send(err.message)
    }
})

module.exports = router