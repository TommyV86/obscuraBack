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
app.post('/signIn', async (req, res) => {

    let {firstName, lastName, email, token} = req.body;

    const emailExist = await User.findOne({ email: email})
    if (emailExist) return res.status(400).json("email already exists")

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
        res.status(200).json(newUser);
        console.log(" *** success ***");
    } catch (err) {
        console.log(" xxx failed xxx ");
        res.status(400).json(err);
    }
})

app.post('/login', async (req, res) => {
    let { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });
        if (!user) return res.status(400).json("email doesn't exists");
        
        const validPswd = await bcrypt.compare(password, user.passwordHash);
        if(!validPswd) {
            return res.status(400).json("password is incorrect");
        } else {
            console.log("success login !");
            res.status(200).json(`Welcome  ${user.email} !`);
        }

    } catch (err) {
        console.log(err);
    }
})

app.get('/allUsers', async (req, res) => {
    
    try {
        const users = await User.find({});
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
        res.status(200).json('  user deleted  ');
    } catch (err) {
        console.log(" xxx failed delete xxx");
        res.status(404).json(" failed delete ");
    }
})