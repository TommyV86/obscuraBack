const User = require('../models/userModel');
const Id = require('mongodb').ObjectId;
const bcrypt = require('bcryptjs');
const obj = require('../objects');


const addUser = async (req, res) => {

    try {
        let {firstName, lastName, email, token} = req.body;

        const emailExist = await User.findOne({ email: email })
        if(emailExist){
            console.log(` xxx email ${email} already exists xxx `);
            return res.status(400).json(`email ${email} already exists`)
        } else {
            //Hash password
            let pswd = req.body.passwordHash;
            let salt = await bcrypt.genSalt(10);
            let pswdHash = await bcrypt.hash(pswd, salt);

            const docPng = require("../");           
            const newUser = await User.create({
                role: obj.usualUser,
                picture: docPng,
                firstName: firstName, 
                lastName: lastName,
                email: email, 
                passwordHash: pswdHash,
                salt: salt,
                token: token
            });
            console.log(" *** success *** ");
            res.status(200).json(newUser);
        }
    } catch (error) {
        console.log(error);
        res.status(404).json(error);    
    }
}

const signInUser = async (req, res) => {
    
    try {
        let { email, password } = req.body;
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
            console.log("*** success login ! ***");
            res.status(200).json(`Welcome ${user.email} !`);
        }

    } catch (error) {
        console.log(error);
        res.status(404).json(error);    
    }
}

const getUsers = async (req, res) => {   

    try {
        const users = await User.find();
        console.log(' *** users finded *** ');
        console.log(users);
        res.status(400).json(users);
    } catch (error) {
        console.log(error.message);
    }
}

const getUserById = async (req, res) => {

    try {
        
        const reqIdBody = req.body._id;
        let id = Id(reqIdBody);
        const user = await User.findById(id);

        if(user){
            console.log(" *** user finded ***");
            console.log(user);
            res.status(400).json(user)
        } else {
            console.log(" Id " +  id + " doesn't exist");
            res.status(404).json(" Id " + id + " doesn't exist")
        }

    } catch (error) {
        console.log(error);
        res.status(404).json(error)
    }
}

const updateUser = async (req, res) => {

    try {

        let reqBobyId = req.body._id;
        let id = Id(reqBobyId);

        const searchIdUser = await User.findById(id);

        if(searchIdUser){
                  
            let {firstName, lastName, email} = req.body;

            const userUpdated = await User.findByIdAndUpdate(id, {
                firstName: firstName,
                lastName: lastName,
                email: email
            });
            console.log(`*** user with id ${id} updated ***`);
            res.status(200).json(`${userUpdated._id} data's updated`);

        } else {
            console.log(" xxx failed update xxx");
            console.log("Id : " + id + " doesn't exist")
            res.status(404).json(" failed update, id " + id + " doesn't exist");
        }
    } catch (error) {
        console.log(' xxx update failed xxx');
        res.status(404).json(error);
    }
}

const deleteUser = async (req, res) => {

    try {
        let id = Id(req.body._id);
        const searchIdUser = await User.findById(id);

        if(searchIdUser){
            await User.remove({ _id: id });
            console.log(`*** user deleted ***`);
            console.log(`*** id : ${id} ***`);
            res.status(200).json(` user deleted -> ${id} `);
        } else {
            console.log(" xxx failed delete xxx");
            console.log("Id : " + id + " doesn't exist")
            res.status(404).json(" failed delete, id " + id + " doesn't exist");
        }
        
    } catch (error) {
        console.log(error);
        res.status(404).json(error);
    }
}

module.exports = { 
    addUser,
    getUsers,
    getUserById,
    signInUser,
    updateUser,
    deleteUser 
};