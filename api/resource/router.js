// `/api/resources` router buraya
const router = require("express").Router();
const resourceModel = require("./model");
const mw = require("./middleware");

router.get("/",async (req,res,next)=>{
try {
    const allPRojects = await resourceModel.getAll();
    res.json(allPRojects);
} catch (error) {
    next(error);
}
});
router.post("/",mw.checkUniqueResourceName,async (req,res,next)=>{
    try {
        const insertedRecord = await resourceModel.create(req.body);
            res.status(201).json(insertedRecord);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
