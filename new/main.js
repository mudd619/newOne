//npm init
//npm i express
//npm install mongoose@5.11.15
const express = require("express");

const mongoose = require("mongoose");

const app = express();

app.use(express.json());

const connect = ()=>{
    return mongoose.connect("mongodb://127.0.0.1:27017/college",{
        useNewUrlParser : true,
        useUnifiedTopology : true,
        useCreateIndex : true
    })
}

const authorSchema = new mongoose.Schema({
    first_name : {type : String , required : true},
    last_name : String
},{
    versionKey : false
})

const Author = mongoose.model("author",authorSchema);

const booksSchema = new mongoose.Schema({
    book_name : {type:String , required: true},
    body : {type:String , required : true},
    author : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "author",
        required : true
    }]
},{
    versionKey : false
})

const Book = mongoose.model("book",booksSchema);

const sectionSchema = new mongoose.Schema({
    section : {type:Number , required:true},
    books_id : [{
        type: mongoose.Schema.Types.ObjectId,
        ref : "book",
        required : true
    }]
},{
    versionKey : false
})

const Section = mongoose.model("section",sectionSchema);

const checkoutSchema = new mongoose.Schema({
    book_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "book",
        required : true
    }
},{
    versionKey : false
})

const CheckOut = mongoose.model("checkout",checkoutSchema);

app.post("/checkOuts",async(req,res)=>{
    try{
        const checkOut = await CheckOut.create(req.body);
        return res.send(checkOut);
    }
    catch(err){
        return res.send(err.message);
    }
})

app.get("/checkouts",async (req,res)=>{
    try{
        const checkOut = await CheckOut.find().populate("book_id").lean().exec();
        return res.send(checkOut);
    }
    catch(err){
        return res.send(err.message)
    }
})

//find books that are checked out
let arr = {};
app.get("/checkOuts/book",async (req,res)=>{
    try{
        const checkOut = await CheckOut.find().lean().exec();
        checkOut.forEach(async (checkEle)=>{
            const mybook = await getBook(checkEle.book_id);
            arr[mybook[0]._id] = mybook[0];
        })
        return  res.status(201).json(arr);
    }
    catch(err){
        return res.send(err.message);
    }
})

async function getBook(checkbook){
    const book = await Book.find({_id : `${checkbook}`}).lean().exec()
    return book;
}



app.post("/sections",async (req,res)=>{
    try{
        const section = await Section.create(req.body);
        return res.send(section);
    }
    catch(err){
        return res.send(err.message);
    }
})

app.get("/sections",async (req,res)=>{
    try{
        const section = await Section.find().lean().exec();
        return res.send(section);
    }
    catch(err){
        return res.send(err.message)
    }
})

//find books in a section
let obj2 = {}
app.get("/sections/:id/books",async (req,res)=>{
    try{
        const section = await Section.find({_id : req.params.id}).lean().exec();
        section[0].books_id.forEach(async (ele)=>{
            const book = await Book.find({_id : `${ele}`}).lean().exec()
            obj2[book[0]._id] = book[0];
        })
        return res.send(obj2);
    }
    catch(err){
        return res.send(err.message)
    }
})

//finding books in a section that are not checked out
let obj3 ={};
app.get("/sections/:id/notChecked",async(req,res)=>{
    try{
        const section = await Section.find({_id : req.params.id}).lean().exec();
        const checkout = await CheckOut.find().lean().exec();
        let book = await Book.find().lean().exec();
        section[0].books_id.forEach(async (ele,i)=>{
            checkout.forEach(async(ele2)=>{
                if(String(ele2.book_id) == String(ele)){
                    section[0].books_id.splice(i,1);
                }
            })
        })
        book.forEach(async(el)=>{
            section[0].books_id.forEach(async(el2)=>{
                if(String(el._id) == String(el2)){
                    let temp = await Book.find({_id: `${el2}`}).lean().exec();
                    obj3[temp[0]._id] = temp[0];
                }
            })
        })
        return res.send(obj3)
    }
    catch(err){
        return res.send(err.message)
    }
})


app.post("/books",async (req,res)=>{
    try{
        const book = await Book.create(req.body);
        return res.send(book);
    }
    catch(err){
        return res.send(err.message);
    }
})

app.get("/books",async (req,res)=>{
    try{
        const book = await Book.find().lean().exec();
        return res.send(book);
    }
    catch(err){
        res.send(err.message);
    }
})


//find all books written by an author
let obj={}
app.get("/books/:id/author",async (req,res)=>{
    try{
        const book = await Book.find().lean().exec();
        book.forEach(async (ele,i)=>{
            //obj[ele._id] = ele;
            ele.author.forEach(async (ele2)=>{
                if(ele2 == req.params.id){
                    obj[`book${i}`] = ele;
                }
            })
        })
        return res.send(obj);
    }
    catch(err){
        res.send(err.message);
    }
})



app.post("/authors",async (req,res)=>{
    try{
        const author = await Author.create(req.body);
        return res.send(author);
    }
    catch(err){
        return res.send(err.message);
    }
})

app.get("/authors",async (req,res)=>{
    try{
        const author = await Author.find().lean().exec();
        return res.send(author);
    }
    catch(err){
        return res.send(err.message);
    }
})

//finding books of one author inside the section
let obj4 = {};
app.get("/authors/:id/sections/:id2",async (req,res)=>{
    try{
        section = await Section.find({_id : req.params.id2}).lean().exec();

        book = await Book.find().lean().exec();
        section[0].books_id.forEach(async (ele)=>{
            let temp = await Book.find({_id : `${ele}`}).lean().exec();
            temp[0].author.forEach(async (ele2)=>{
                if(ele2 == req.params.id){
                    obj4[ele2] = temp[0];
                }
            })
        })
        return res.send(obj4)
    }
    catch(err){
        return res.send(err.message);
    }
})


app.listen("2500",async ()=>{
    await connect();
    console.log("listening to port 2500");
})



/*app.get("/users/:id/posts", async function (req, res) {
    const userPosts = await Post.find({ userId: req.params.id }).lean().exec()
    let userPostsWithComments = {};
    userPosts.forEach(async post => {
        const postId = post._id;
        const comment = await getUserPostsWithComments(post);
        userPostsWithComments[postId] = {};
        userPostsWithComments[postId]["post"] = post;
        userPostsWithComments[postId]["comments"] = comment;
    })
    const user = await User.findById(req.params.id)
    return res.status(200).json({ postsWithComments: userPostsWithComments, user: user })
})
async function getUserPostsWithComments(post) {
    const comment = await Comment.find({ postId: post._id }).lean().exec()
    return comment
}*/