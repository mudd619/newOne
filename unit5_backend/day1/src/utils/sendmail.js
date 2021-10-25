const transporter = require("../configs/mail")

const send = async ({first,last,email})=> await transporter.sendMail({
    from: 'official@gmail.com', // sender address
    to: email, // list of receivers
    subject: "Welcome to ABC system" +first + " "+last, // Subject line
    text: "Hi "+ first + " "+ "Please confirm your email address", // plain text body
    html: `<b>Hi ${first} Please Confirm your email address</b>`, // html body
});

const sendAdmin = async ({first,last})=>await transporter.sendMail({
    from: 'official@gmail.com', // sender address
    to: "admin1@gmail.com, admin2@gmail.com, admin3@gmail.com, admin4@gmail.com, admin5@gmail.com", // list of receivers
    subject: first + " "+ last + " has registered with us", // Subject line
    text: " Please welcome " + first + " "+last, // plain text body
    html: `<b> Please welcome ${first} ${last}</b>`, // html body
});

module.exports = {send,sendAdmin}