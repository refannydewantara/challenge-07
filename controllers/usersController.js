const express = require ('express')
const jwt = require ('jsonwebtoken')
const cookieParser = require('cookie-parser')
const app = express()
app.use(cookieParser())

const { sequelize, Usergame, Usergame_bio, Usergame_history } = require('../models')

const usersController = {}


//show all users
usersController.getAll = async(req, res) => {

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

}


//create user
usersController.createUser = async(req,res) => {
    const { nickname, email, username, userpwd } = req.body

    try{
        const usergame = await Usergame.create({ nickname, email, username, userpwd })
        const usergame_bio = await Usergame_bio.create({ nickname, email })

        
        res.redirect('/admin')
    }
    catch(err){
        return res.status(500).json(err)
    }
}

//update user
usersController.getUpdate = async(req, res) => {

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
 }

 usersController.postUpdate = async(req,res) => {
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
}

//delete user
usersController.deleteUser = async(req,res) => {
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
}

//login validation
const staticuser = require ('../staticuser.json')

usersController.loginUser = async(req,res) => {

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

            const payload = {
                'username': usernames[index]
            }

            const secret = 'rahasia'

            const token = jwt.sign(payload,secret)

            res.cookie('auth',token)
            


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
}

usersController.goFight = async(req,res)=> {
    
    try{
        
        let url = req.url
        let room = url.substring(6,11)
        
        if(req.cookies.auth !== null){
            const token = req.cookies.auth
            const decoded = jwt.decode(token)

            const history = await Usergame_history.findAll()

            const thisRoom = await Usergame_history.findOne({
                where : {
                    roomno: room
                }
            })

            if(!thisRoom){
                const usergame_history = await Usergame_history.create({
                    roomno: room,
                    user1: decoded.username,
                    choice1: req.params.input
                })
                res.redirect(`../${room}-result`)
            } 
            else {
                //Player yang sama tidak boleh memilih 2x
                if(thisRoom.user1 == decoded.username){
                    res.send('Tidak boleh memilih 2 kali!')
                } else {

                    await Usergame_history.update({
                        user2: decoded.username,
                        choice2: req.params.input,
                    },{
                        where : {
                        roomno: room
                        }})
    
                    res.redirect(`../${room}-result`)
                }

            }}

        else {
            res.send('Token not valid')
        }
        }
    

    catch(err){
        return res.send('ada yang salah-->' + err)
    }
}

usersController.getResult = async(req,res) => {
    try{
        let url = req.url
        let room = url.substring(6,11)

        const history = await Usergame_history.findAll()
        const data = await Usergame_history.findOne({
            where : {
                roomno: room
            }
        })

        var hasil
        //cek apakah 2 player telah memilih
        if (data.choice1 !== null && data.choice2 !== null){

            if(data.choice1 == 'p'){
                switch(data.choice2){
                    case 'p' :
                        hasil = 'Draw. Fair fight!'
                        break
                    case 'r' :
                        hasil = `User '${data.user1}' win`
                        break
                    case 's' :
                        hasil = `User '${data.user2}' win`
                        break

                }

            } else if(data.choice1 == 'r'){
                switch(data.choice2){
                    case 'p' :
                        hasil = `User '${data.user2}' win`
                        break
                    case 'r' :
                        hasil = 'Draw. Fair fight!'
                        break
                    case 's' :
                        hasil = `User '${data.user1}' win`
                        break
                }

            } else if(data.choice1 == 's'){
                switch(data.choice2){
                    case 'p' :
                        hasil = `User '${data.user1}' win`
                        break
                    case 'r' :
                        hasil = `User '${data.user2}' win`
                        break
                    case 's' :
                        hasil = 'Draw. Fair fight!'
                        break
                }
            }

        } else {
            hasil = 'Menunggu player lain memilih'
        }
        
        res.send(hasil)
        await Usergame_history.update({
            result: hasil
        },{
            where : {
            roomno: room
            }})

    }

    catch(err){
        res.send(err)
    }
}



module.exports = usersController