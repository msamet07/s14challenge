// `Proje` modeli buraya
const db= require("../../data/dbConfig");

const getAll = async function(){
    const allProjects = await db("projects");
    let transformingProjects = allProjects.map((item)=>{
        return {
            ...item,
            project_completed: item.project_completed == 1
        }
    });
    return transformingProjects;
}

const getById = async function(project_id){
    const isExist = await db("projects").where("project_id",project_id).first();
    return isExist;
}

const create = async function(model){
    let [project_id] = await db("projects").insert(model);
    let insertedProject = await db("projects").where("project_id",project_id).first();
    return {
        ...insertedProject,
        project_completed: insertedProject.project_completed == 1
    }
}
module.exports = {
    getAll,create,getById
}