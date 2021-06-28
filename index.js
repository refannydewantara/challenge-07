const express = require ('express')
const app = express()
const port = 3000
const user = require ('./user.json')

app.use(express.static('public'))
app.set('view engine', 'ejs')


// routing index
app.get('/', (req, res) => {
    res.render('index', {
        "title" : "Traditional Games"
    })
})

//routing play
app.get('/play', (req, res) => {
    res.render('play', {
        "title" : "Let's Play!"
    })
})

//routing data user
app.get('/user', (req, res) => {
    res.json(user)
})

//error handler
app.use((req, res,next)=>{
    res.status(404).render('notFound', {
        "title" : "Anda tersesat"
    });
 });
 

app.listen(port, () => console.log (`Listening at port ${port}`))


