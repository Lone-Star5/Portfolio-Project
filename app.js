const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const mongoose=require('mongoose');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const passportLocalMongoose = require("passport-local-mongoose");


var username='admin';
var password='admin';


app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/portfolio-project",{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false});

var blogSchema=new mongoose.Schema({
	title:String,
	body:String,
	created:{type:Date,default:Date.now}
});

var UserSchema= new mongoose.Schema({
    username: String,
    password: String
});
UserSchema.plugin(passportLocalMongoose);

var blog=new mongoose.model('blog',blogSchema);
var User=new mongoose.model('user',UserSchema);

app.use(require("express-session")({
    secret:'Random',
    resave: false,
    saveUninitialized: false
}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

User.findOne({username:username},function(err,user){
    if(err)
        console.log(err);
    if(user)
        console.log('Administrator already registered');
    else{
        User.register(new User({username: username}),password,function(err,user){
            if(err)
                console.log(err);
        });
        console.log('Administrator registered');
    }
});

app.get('/', (req,res)=>{
	res.render('index');
});

app.get('/blog',(req,res)=>{
	blog.find({},(err,blogs)=>{
		if(err)
			console.log(err);
		else
			res.render('blog_index',{blogs:blogs});
	})
});

app.get('/newblog',isLoggedIn,(req,res)=>{
	res.render('create_blog');
});

app.post('/newblog',isLoggedIn,(req,res)=>{
	blog.create(req.body.blog,(err,newBlog)=>{
		if(err)
			res.render('create_blog');
		else
			res.redirect('/login/success');
	});
});

app.get('/login',(req,res)=>{
	res.render('blog_login');
});

app.post('/login',passport.authenticate("local",{
    successRedirect: "/login/success",
    failureRedirect: "/login",
}),(req,res)=>{});

app.get('/login/success',isLoggedIn,(req,res)=>{
	blog.find({},(err,blogs)=>{
		if(err)
			console.log(err);
		else
			res.render('admin_portal',{blogs:blogs});
	})
});

app.get('/logout',function(req,res){
    req.logout();
    res.redirect('/login');
});

app.get('/blog/:id',(req,res)=>{
	blog.findById(req.params.id,(err,foundBlog)=>{
		if(err)
			console.log(err);
		else
			res.render('blog_detail',{blog:foundBlog});
	});
});

app.get('/login/success/edit/:id',isLoggedIn,(req,res)=>{
	blog.findById(req.params.id,(err,foundBlog)=>{
		if(err)
			console.log(err);
		else
			res.render('blog_edit',{blog:foundBlog});
	});
});

app.post('/login/success/edit/:id',isLoggedIn,(req,res)=>{
	blog.findByIdAndUpdate(req.params.id,req.body.blog,(err,updatedBlog)=>{
		if(err)
			res.redirect('/login/success');
		else
			res.redirect('/login/success');
	})
});

app.post('/login/success/delete/:id',isLoggedIn,(req,res)=>{
	blog.findByIdAndRemove(req.params.id,(err)=>{
		res.redirect('/login/success');
	})
});

app.listen(8000, ()=>{
	console.log('Server Running at port 8000...');
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
        return next();
    res.render('blog_login');
}