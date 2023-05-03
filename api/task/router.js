// `/api/tasks` router buraya
const router = require("express").Router();
const taskModel = require("./model");
const mw = require("./middleware");

router.get("/",async (req,res,next)=>{
try {
    const alltasks = await taskModel.getAll();
    res.json(alltasks);
} catch (error) {
    next(error);
}
});
router.post("/",mw.checkPayloadAntProjectIdIsExist,async (req,res,next)=>{
    try {
        const insertedRecord = await taskModel.create(req.body);
            res.status(201).json(insertedRecord);
    } catch (error) {
        next(error);
    }
});

module.exports = router;