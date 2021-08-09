const express = require ('express')
const exphbs = require ('express-handlebars')
const bodyParser = require ('body-parser')
const path = require ('path')
const jwt = require ('jsonwebtoken')
const cookieParser = require('cookie-parser')




const app = express()
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

const port = 8080


app.use(express.static('public'))
app.set('view engine', 'ejs')

//controller
const usersController = require('./controllers/usersController')

// routing index
app.get('/', (req, res) => {

    if (req.cookies.auth){
        res.redirect('play')
    } else {
        res.render('index', {
            "title" : "Traditional Games"
        })
    }
    
})

app.get('/logout', (req, res) => {

    res.clearCookie('auth')
    res.redirect('/')
    
})

//routing play
app.get('/play', (req, res) => {
    res.render('play', {
        "title" : "Let's Play!"
    })
})

//fight room
app.get('/play/room1', (req, res) => {
    res.render('fight')
})

//routing admin
app.get('/admin', usersController.getAll)

app.get('/register', (req, res) => {
    res.render('register', {
        
    })
})




//sequelize
const { sequelize, Usergame, Usergame_bio, Usergame_history } = require('./models')

app.post('/history', async(req,res)=>{
    try{
        const hist = await Usergame_history.findAll()
        res.send(hist)
    }

    catch(err){
        return res.status(403).json(err)
    }

    
})


//CRUD sequelize
    //Create
app.post('/users', usersController.createUser)


    //Update
app.get('/update/:id', usersController.getUpdate)
app.post('/update', usersController.postUpdate)

    //Delete
app.get('/delete/:id', usersController.deleteUser)


//login
app.post('/login', usersController.loginUser)


app.get('/play/room1/:input', async(req,res)=> {
    
    try{
        
        

        if(req.cookies.auth !== null){
            const token = req.cookies.auth
            const decoded = jwt.decode(token)

            const history = await Usergame_history.findAll()

            const cekroom = await Usergame_history.findOne({
                where : {
                    roomno: 'room1'
                }
            })

            if(!cekroom){
                const usergame_history = await Usergame_history.create({
                    roomno: 'room1',
                    user1: decoded.username,
                    choice1: req.params.input
                })
                res.send('anda : ' + decoded.username +' telah memilih')
            } 
            else {
                await Usergame_history.update({
                    user2: decoded.username,
                    choice2: req.params.input,
                },{
                    where : {
                    roomno: 'room1'
                    }})

                res.send('anda : ' + decoded.username +' telah memilih')
            }}

        else {
            res.send('Token not valid')
        }
        }
    

    catch(err){
        return res.send('ada yang salah-->' + err)
    }
})



//error handler
app.use((req, res,next)=>{
    res.status(404).render('notFound', {
        "title" : "Anda tersesat"
    });
 });
 

app.listen(port, async () => {
    console.log (`Listening at port ${port}`)
    await sequelize.authenticate()
    await sequelize.sync()
    console.log('Database authenticated') 
})


