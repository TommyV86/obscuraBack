const http = require('http');
let express = require("express");
const app = express();
const obj = require('./objects');
const mongoose = require('mongoose');
const User = require('./models/userModel');
const Id = require('mongodb').ObjectId;
const bcrypt = require('bcryptjs');

// creation du serveur
const port = http.createServer(app).listen(8080);

// connection à la database
const uri = obj.copDbUri;
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
app.use(express.json());

// user routers part
app.post('/signUp', async (req, res) => {

    let {firstName, lastName, email, token} = req.body;

    const emailExist = await User.findOne({ email: email});
    if (emailExist) {
        console.log(` xxx email ${email} already exists xxx `);
        return res.status(400).json(`email ${email} already exists`);
    }

    //Hash password
    let pswd = req.body.passwordHash;
    let salt = await bcrypt.genSalt(10);
    let pswdHash = await bcrypt.hash(pswd, salt);

    try {
        const newUser = await User.create({
            role: obj.usualUser,
            firstName: firstName, 
            lastName: lastName,
            email: email, 
            passwordHash: pswdHash,
            salt: salt,
            token: token
        });
        console.log(" *** success *** ");
        res.status(200).json(newUser);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);      
    }
})

app.post('/signIn', async (req, res) => {
    let { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            console.log(` xxx email ${email} doesn't exists xxx `);
            return res.status(400).json(`email ${email} doesn't exists`);
        }
        
        const validPswd = await bcrypt.compare(password, user.passwordHash);
        if(!validPswd) {
            console.log("password is incorrect");
            return res.status(400).json("password is incorrect");
        } else {
            console.log("success login !");
            res.status(200).json(`Welcome ${user.email} !`);
        }

    } catch (err) {
        console.log(err);
        res.status(400).json(err);      

    }
})

app.get('/allUsers', async (req, res) => {
    
    try {
        const users = await User.find();
        console.log(' *** users finded *** ');
        res.status(400).json(users);
    } catch (err) {
        console.log(err.message);
    }
})

app.put('/update', async (req, res) => {

    let reqBobyId = req.body._id;
    let id = Id(reqBobyId);

    let {firstName, lastName, email} = req.body;

    try {
        const userUpdated = await User.findByIdAndUpdate(id, { 
            firstName: firstName,
            lastName: lastName,
            email: email
        })
        console.log(`*** user with id ${id} updated ***`);
        res.status(200).json(`${userUpdated.firstName} data's updated`);

    } catch(e) {
        console.log(' xxx update failed xxx');
        res.status(404).json(e);
    }
})

app.delete('/deleteUser', async (req, res) => {

    let id = Id(req.body._id);
    
    try {
        await User.remove({ _id: id});
        console.log(`*** user deleted ***`);
        console.log(`*** id : ${id} ***`);
        res.status(200).json(` user deleted -> ${id} `);
    } catch (err) {
        console.log(" xxx failed delete xxx");
        res.status(404).json(" failed delete ");
    }
})