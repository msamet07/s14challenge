// `Resource` modeli buraya
const db= require("../../data/dbConfig");

const getAll = async function(){
    const allResources = await db("resources");
    
    return allResources;
}

const getByName = async function(resource_name){
    const isExist = await db("resources").where("resource_name",resource_name).first();
    return isExist;
}   

const create = async function(model){
    let [resource_id] = await db("resources").insert(model);
    let insertedResource = await db("resources").where("resource_id",resource_id).first();
    return insertedResource;
}
module.exports = {
    getAll,create,getByName
}