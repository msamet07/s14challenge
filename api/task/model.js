// bu`Task` modeli buraya
const db= require("../../data/dbConfig");
/**
 * @param { import("knex").Knex } db
 * @returns { Promise<void> }
 */
const getAll = async function(){
    const alltasks = await db("tasks as t")
                            .leftJoin("projects as p","p.project_id","t.project_id")
                            .select("t.*","p.project_name","p.project_description")
    let transformingtasks = alltasks.map((item)=>{
        delete item.project_id;
        return {
            ...item,
            task_completed: item.task_completed == 1
        }
    });
    return transformingtasks;
}

const create = async function(model){
    let [task_id] = await db("tasks").insert(model);
    let insertedtask = await db("tasks").where("task_id",task_id).first();
    return {
        ...insertedtask,
        task_completed: insertedtask.task_completed == 1
    }
}
module.exports = {
    getAll,create
}
