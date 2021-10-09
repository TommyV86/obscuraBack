const http = require('http')
let express = require("express");
const app = express();
const copDb = require('./dbUri')
const mongoose = require('mongoose')
const User = require('./models/userModel')
const Id = require('mongodb').ObjectId
let crypto = require('crypto')


// creation du serveur
const port = http.createServer(app).listen(8080)

// connection à la database
const uri = copDb.copDbUri
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("----------------------------")
    console.log(" Listen to port => " + port._connectionKey)
    console.log(" *** Database connected *** ")
    console.log("----------------------------")
}).catch(err => console.log(err));

// retour des données json
app.use(express.json())

// user routers part
app.post('/signIn', async (req, res) => {

    let {firstName, lastName, email, token} = req.body
    let pswd = req.body.passwordHash
    let salt = crypto.randomBytes(16).toString('hex')
    let pswdHash = crypto.createHmac('sha256', pswd).update(salt).digest('hex')

    try {
        const newUser = await User.create({
            firstName: firstName, 
            lastName: lastName,
            email: email, 
            passwordHash: pswdHash,
            token: token
        })
        res.status(200).json(newUser)
        console.log(" *** success ***")
    } catch (err) {
        console.log(" xxx failed xxx ")
        res.status(400).json(err)
    }
})

app.get('/allUsers', async (req, res) => {
    
    try {
        const users = await User.find({})
        console.log(' *** users finded *** ')
        res.status(400).json(users)
    } catch (err) {
        console.log(err.message)
    }
})

app.put('/update', async (req, res) => {

    let reqBobyId = req.body._id
    let id = Id(reqBobyId)

    let {firstName, lastName, email} = req.body

    try {
        const userUpdated = await User.findByIdAndUpdate(id, { 
            firstName: firstName,
            lastName: lastName,
            email: email
        })
        console.log(`*** user with id ${id} updated ***`)
        res.status(200).json(`${userUpdated.firstName} data's updated`)

    } catch(e) {
        console.log(' xxx update failed xxx')
        res.status(404).json(e)
    }
})

app.delete('/deleteUser', async (req, res) => {

    let reqBodyId = req.body._id
    let id = Id(reqBodyId)
    
    try {
        await User.deleteOne(id)
        console.log(`*** user deleted ***`)
        console.log(`*** id : ${id} ***`)
        res.status(200).json('  user deleted  ')
    } catch (err) {
        console.log(" xxx failed delete xxx")
        res.status(404).json(err)
    }
})