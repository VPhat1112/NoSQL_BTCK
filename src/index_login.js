const express = require("express");
const pasth = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config");
const session = require("express-session");

const app = express()

//Convert data to Json Format
app.use(express.json());

app.use(express.urlencoded({extended: false}));
//use session 
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

//use ejs as view engine
app.set('view engine', 'ejs');
//static file
app.use(express.static("public"));

//view login
app.get("/",(req,res)=> {
    res.render("login");
})

//connect view sign up
app.get("/signup",(req,res)=> {
    res.render("signup");
})

//post when sign up
app.post("/signup", async (req,res)=>{

    //connect with input at view
    const data ={
        name: req.body.username,
        password: req.body.password
    }

    //check exists data username
    const existsingUser= await collection.findOne({name:data.name})

    if(existsingUser){
        res.render('signup', { errormessage: 'User already exists! Please choose another name!!' });
        console.log("Từ chối tạo tại khoản mới!!! ");
    }else{
        //encode accout password
        const saltRounds =10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password=hashedPassword;

        //insert data to mongodb
        const userdata = await collection.insertMany(data);
        console.log(userdata);
        

        res.render("login");
    }


})

app.post("/Login", async (req,res)=>{
    try{
        const check = await collection.findOne({name : req.body.username});

        if(!check){
            res.render('login', { errormessage: 'username cannot found!!' });
        }

        //compape the hash password from the database with plain text
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if(isPasswordMatch){
            sess = req.session;
            sess.account = req.body.username;
            res.render("home");
        }else{
            res.render('login', { errormessage: 'Wrong Password!!' });
        }
    }catch{
        res.send("Wrong detail");
    }
})

//Logout
app.get('/logout',function(req,res){    
    req.session.destroy(function(err){  
        if(err){  
            console.log(err);  
        }  
        else  
        {  
            res.redirect('/');  
        }  
    });  

}); 
//local host in web
const port =5000;
app.listen(port, ()=> {
    console.log(`Server running on Port: ${port}`);
})