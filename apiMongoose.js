const http = require('http')
let express = require("express");
const app = express();
const copDb = require('./copDb')
const mongoose = require('mongoose')
const User = require('./models/userModel')
const Id = require('mongodb').ObjectId

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
app.post('/signUp', async (req, res) => {

    let {firstName, lastName, email, token} = req.body

    try {
        const newUser = await User.create({
            firstName: firstName, 
            lastName: lastName,
            email: email, 
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
        console.log(' *** user finded *** ')
        res.status(400).json(users)
    } catch (err) {
        console.log(err)
    }
})

app.delete('/deleteUser', async (req, res) => {

    let reqBobyId = req.body._id
    let id = Id(reqBobyId)

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