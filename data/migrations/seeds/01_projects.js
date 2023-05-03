/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  const defaultProjects = [
    {project_name:"React Ekran tasarlama",project_description:"React kullanarak bootstrap kütüphanesini dahil edip erkan tasarla"},
    {project_name:"Kitaplık uygulaması",project_description:"Flutter ile kitaplık uygulaması yapımı"},
  ];

  const defaultResources = [
    {resource_name:"Github",resource_description:"Github Documentation Page"},
    {resource_name:"Google",resource_description:"Flutter official page"}
  ];

  const defaultTasks = [
    {task_description:"react form component oluştur",task_notes:"react bootstrap indir, form elementlerini dahil et",project_id:1},
    {task_description:"react form validasyonunu yap",task_notes:"forma girilen değerlerin react tarafında validasyonunu yap",project_id:1},
    {task_description:"flutter arayüz tasarla",task_notes:"flutter componentlerinden grid ve card componentini kullan",project_id:2},
  ]
   
  const defaultProjectsResources = [
    {project_id:1,resource_id:1},
    {project_id:2,resource_id:1},
    {project_id:2,resource_id:2},
  ]

  await knex("projects").insert(defaultProjects);
  await knex("resources").insert(defaultResources);
  await knex("tasks").insert(defaultTasks);
  await knex("project_resources").insert(defaultProjectsResources)
};
