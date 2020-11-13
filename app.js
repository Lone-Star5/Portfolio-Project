const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const mongoose=require('mongoose');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const passportLocalMongoose = require("passport-local-mongoose");
const fs = require('fs'); 
const path = require('path'); 
const multer = require('multer')
const nodemailer = require('nodemailer');
require('dotenv').config()

var filename=Date.now()+'.png';

var username='admin';
var password='admin';

app.use(express.static(__dirname + '/public/'));

// app.use(express.static('public'));
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


var articleSchema = new mongoose.Schema({ 
    title: String, 
    keywords: String
}); 
  

var blog=new mongoose.model('blog',blogSchema);
var User=new mongoose.model('user',UserSchema);
var articles=new mongoose.model('article',articleSchema);


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

// Creating a function to send mail
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
  service: 'gmail',
  auth: {
    user: process.env.userEmail,
    pass: process.env.password
  }
});


app.get('/', (req,res)=>{
	res.render('home');
});

app.get('/blog',(req,res)=>{
	let user=false;
	if(req.isAuthenticated)
		user=true;
	blog.find({},(err,blogs)=>{
		if(err)
			console.log(err);
		else
			res.render('blog_index',{blogs:blogs,user:user});
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
	res.redirect("/");
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




app.get('/awards', (req,res)=>{
	res.render('awards');
})



// View Articles

// var storage = multer.diskStorage({ 
//     destination: (req, file, cb) => { 
//         cb(null, 'uploads') 
//     }, 
//     filename: (req, file, cb) => { 
//         cb(null, file.fieldname + '-' + Date.now()) 
//     } 
// }); 

var storage=multer.diskStorage({
    destination: function(req,file,cb){
        var path='./public/uploads/'
        cb(null,path);
    },
    filename: function(req,file,cb){
        cb(null,filename);
    }
});

const upload = multer({ storage: storage }); 

app.get('/articles',(req,res)=>{
	let user = false;
	if(req.isAuthenticated())
		user=true;
	articles.find({},(err,articles)=>{
		console.log(articles);
		if(err)
			console.log(err);
		else
			res.render('articles/articles',{articles:articles,user:user});
	})	
})

app.get('/articles/political',(req,res)=>{
	let user = false;
	if(req.isAuthenticated())
		user=true;
	articles.find({keywords:'Political'},(err,articles)=>{
		console.log(articles);
		if(err)
			console.log(err);
		else
			res.render('articles/political',{articles:articles,user:user});
	})	

})

app.get('/articles/entertainment',(req,res)=>{
	let user = false;
	if(req.isAuthenticated())
		user=true;
	articles.find({keywords:'Entertainment'},(err,articles)=>{
		console.log(articles);
		if(err)
			console.log(err);
		else
			res.render('articles/entertainment',{articles:articles,user:user});
	})	

})

app.post('/articles',upload.single('article[img]'), (req,res)=>{
	// const obj = { 
	// 	title: req.body.title, 
	// 	keywords: req.body.keywords, 
	// 	img: { 
	// 		data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)), 
	// 		contentType: 'image/png'
	// 	} 
	// } 
	articles.create(req.body.article,function(err,newArticle){
		var id=newArticle._id.toString();
		var oldPath=path.join(__dirname,'/public/uploads/',filename);
		var newPath=path.join(__dirname,'/public/uploads/',id+'.png');
		fs.rename(oldPath,newPath,function(err){
			if(err)
				console.log(err);
		});
		if(err)
			console.log(err);
		else
			res.redirect('/articles');
	});
	// articles.create(obj,(err,newArticle)=>{
	// 	if(err)
	// 		res.redirect('/articles');
	// 	else
	// 		res.redirect('/articles');
	// });
})

app.get('/resume', function (req, res) {
	var filePath = "/public/resume.pdf";

	fs.readFile(__dirname + filePath , function (err,data){
			res.contentType("application/pdf");
			res.send(data);
	});
});


app.post('/contact',sendMail,  (req,res)=>{
	res.redirect('/');
	  
})

// MiddleWare for Contact
function sendMail(req,res,next){
	({name, email,message }= req.body);
	let mailOptions = {
		from: email,
		to: 'sunitaportfolio20@gmail.com',
		subject: 'From '+name,
		text: `The message is sent by ${email} \n\n`+message
	  };
	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			mailOptions = {
				from: 'Sunita',
				to: email,
				subject: 'Error',
				text: 'Your message was not sent successfully'
			  };
			  transporter.sendMail(mailOptions, function(erro,info){
				  if(error){
					  res.json({message:"Some Error Occured"})
				  }
				  else{
					res.redirect("back")
				  }
			  })
		} else {
			mailOptions = {
				from: 'Sunita',
				to: email,
				subject: 'Success',
				text: 'Your message was sent successfully'
			  };
			  transporter.sendMail(mailOptions, function(erro,info){
				  if(error){
					  res.json({message:"Your message is sent successfully"})
				  }
				  else{
					next();
				  }
			  })
		}
	});
	  
}

app.get('/socialMedia', (req,res)=>{
	res.render('social_media')
})

app.listen(8000, (err)=>{
	if(err)
		throw err;
	console.log('Server Running at port 8000...');
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
        return next();
    res.render('blog_login');
}

