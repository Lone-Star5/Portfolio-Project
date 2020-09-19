const express = require('express')
const app = express()


app.get('/', (req,res)=>{
	res.send('hi')
})

app.listen(8000, ()=>{
	console.log('Server Running at port 8000...')
})