const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const mongoose=require('mongoose');

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/portfolio-project",{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false});

var blogSchema=new mongoose.Schema({
	title:String,
	body:String,
	created:{type:Date,default:Date.now}
});

var blog=new mongoose.model('blog',blogSchema);


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

app.get('/newblog',(req,res)=>{
	res.render('create_blog');
});

app.post('/newblog',(req,res)=>{
	blog.create(req.body.blog,(err,newBlog)=>{
		if(err)
			res.render('create_blog');
		else
			res.redirect('/blog');
	});
});

app.get('/login',(req,res)=>{
	res.render('blog_login');
});

app.get('/blog/:id',(req,res)=>{
	blog.findById(req.params.id,(err,foundBlog)=>{
		if(err)
			console.log(err);
		else
			res.render('blog_detail',{blog:foundBlog});
	});
});

app.listen(8000, ()=>{
	console.log('Server Running at port 8000...');
});