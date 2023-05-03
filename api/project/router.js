//  `/api/projects` router buraya
const router = require("express").Router();
const projectModel = require("./model");

router.get("/",async (req,res,next)=>{
try {
    const allPRojects = await projectModel.getAll();
    res.json(allPRojects);
} catch (error) {
    next(error);
}
});
router.post("/",async (req,res,next)=>{
    try {
        if(!req.body.project_name){
            res.status(400).json({message:"eksik alan var"});
        }else{
            const insertedRecord = await projectModel.create(req.body);
            res.status(201).json(insertedRecord);
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;

