const resourceModel = require("./model");

const checkUniqueResourceName = async function(req,res,next){
    try {
        let {resource_name} = req.body;
        if(!resource_name){
            res.status(400).json({message:"eksik alan var"})
        }
        const isExist =await resourceModel.getByName(resource_name);
        if(isExist){
            res.status(400).json({message:"Aynı isimde resource mevcut"})
        }else{
            next();
        }
        
    } catch (error) {
        next(error)
    }
};
module.exports = {
    checkUniqueResourceName
}