const CarteLille = require('../models/carteLilleModel');

const postDescription = async (req, res) => {

    try {
        let description = req.body.description;
        let code = req.body.code;
        let lieu = req.body.lieu;

        const codeExistant = await CarteLille.findOne({ code: code });
        
        if(!codeExistant){
            const desc = await CarteLille.create({ 
                lieu: lieu,
                description: description,
                code: code
            });
    
            console.log(" *** description created *** ");
            console.log(desc);
            res.status(200).send(desc);
        } else {
            console.log(" xxx code déjà existant xxx ");
            res.status(404).send(" xxx code déjà existant xxx ");
        }

    } catch (error) {
        console.log(error)
        res.status(404).send(error)
    }
}

const getDescription = async (req, res) => {

    try {      

        let code = req.body.code  
        const codeDesc = await CarteLille.findOne({ code: code });
        console.log(" *** description finded *** ");
        console.log(codeDesc);
        console.log(" code front : " + code)
        res.status(200).json(codeDesc);

        const arrDes = [codeDesc];
        return arrDes;        
        
    } catch (error) {
        console.log(error)
        res.status(404).send(error)
    }
}

module.exports = { postDescription, getDescription }