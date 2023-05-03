const projectModel = require("../project/model");
const taskModel = require("./model");

const checkPayloadAntProjectIdIsExist = async(req,res,next)=>{
    try {
        let {project_id,task_description} = req.body;
        if(project_id === undefined || task_description === undefined){
            res.status(400).json({message:"Eksik Alan var"});
        }else{
            let isExistProject = await projectModel.getById(project_id);
            if(!isExistProject){
                res.status(404).json({message:"Böyle bir proje yok"});
            }else{
                next();
            }
        }
    } catch (error) {
        next(error);
    }
}

module.exports = {checkPayloadAntProjectIdIsExist};