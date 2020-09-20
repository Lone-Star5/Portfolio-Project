const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));


app.get('/', (req,res)=>{
	res.render('index')
});

app.listen(8000, ()=>{
	console.log('Server Running at port 8000...')
});

app.get('/blog',(req,res)=>{
	res.render('blog_index');
});

app.get('/login',(req,res)=>{
	res.render('blog_login');
})