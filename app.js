const express = require ('express')
const exphbs = require ('express-handlebars')
const bodyParser = require ('body-parser')
const path = require ('path')



const app = express()
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

const port = 3001







app.use(express.static('public'))
app.set('view engine', 'ejs')


app.locals.titles = require ("./titles.json");

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

//routing admin
app.get('/admin', async(req, res) => {

    try{

        const users = await Usergame.findAll()
        let alldata = []
        users.forEach(user =>{
            let data = `<div class="data user1">
                            <div class="user-id">
                                ${user.id}
                            </div>
                            <div class="user-nickname">
                                ${user.nickname}
                            </div>
                            <div class="user-email">
                                ${user.email}
                            </div>
                            <div class="user-username">
                                ${user.username}
                            </div>
                            <div class="user-action">
                            <a href="../update/${user.id}">
                            <div class="update">
                                Update
                            </div>
                            </a>
                                <a href="../delete/${user.id}">
                                <div class="delete">
                                    Delete
                                </div>
                                </a>
                            </div>
                    </div>`
            alldata += data
        })

        res.render('admin', {
            "alldata" : alldata
        })
    }

    catch(err){
        res.send(err)
    }

})

app.get('/register', (req, res) => {
    res.render('register', {
        
    })
})






//sequelize
const { sequelize, Usergame, Usergame_bio } = require('./models')

//CRUD sequelize
    //Create
app.post('/users', async(req,res) => {
    const { nickname, email, username, userpwd } = req.body

    try{
        const usergame = await Usergame.create({ nickname, email, username, userpwd })
        const usergame_bio = await Usergame_bio.create({ nickname, email })

        
        res.redirect('/admin')
    }
    catch(err){
        return res.status(500).json(err)
    }
})


    //Update
app.get('/update/:id', async(req, res) => {

    try{
        
        const user = await Usergame.findOne({
            where : {
                id: parseInt(req.params.id)
            }
        }) 
        res.render('update', {user})
    }
    catch(err){
        return res.status(500).json(err)
    }
 })

 app.post('/update', async(req,res) => {
    const { id, nickname, email, username, userpwd } = req.body
    
    try{
        await Usergame.update({ nickname, email, username, userpwd },{
            where: {
                id : parseInt(id)
            }})
        await Usergame_bio.update({ nickname, email }, {
            where: {
            id : parseInt(id)
        }})

        const users = await Usergame.findAll()
        res.redirect('../../admin')
    }
    catch(err){
        return res.status(500).json(err)
    }
})

    //Delete
app.get('/delete/:id', async(req,res) => {
    try{
        
        
        await Usergame.destroy({
            where : {
                id: parseInt(req.params.id)
            }
        })

        await Usergame_bio.destroy({
            where : {
                id: parseInt(req.params.id)
            }
        })

        res.redirect('../../admin')
    }

    catch(err){
        return res.status(500).json(err)
    }
})

//login validation
const staticuser = require ('./staticuser.json')

app.post('/login', async(req,res) => {

    try{


        //ambil data users player dari database
        const users = await Usergame.findAll()

        let usernames = []
        users.forEach(element => {
            usernames.push(element.username)
        });
        

        let userpwds = []
        users.forEach(element => {
            userpwds.push(element.userpwd)
        });

    //login admin - static user
    
    if(req.body.username == staticuser.username && req.body.userpwd == staticuser.password){
        res.redirect('admin')
    } else 
    if(usernames.includes(req.body.username)){

        const index = usernames.indexOf(req.body.username)

        if(req.body.userpwd == userpwds[index]){
            res.redirect('play')
        } else {
            res.send('password salah')
        }
    } else {
        res.send('user tidak ada')
    }

        

    //login user player

    res.send(usernames)

    }
    catch(err){
        console.log(err)
    }
})



//error handler
app.use((req, res,next)=>{
    res.status(404).render('notFound');
 });
 

app.listen(port, async () => {
    console.log (`Listening at port ${port}`)
    await sequelize.authenticate()
    await sequelize.sync()
    console.log('Database authenticated') 
})


