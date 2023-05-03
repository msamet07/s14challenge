/*
ÖNEMLİ NOTLAR 🔥
ÖNEMLİ NOTLAR 🔥
ÖNEMLİ NOTLAR 🔥

1- "npm test" komut dosyasını kullanarak testleri çalıştırın (bkz. "package.json")
2- Testler kendi veritabanı bağlantılarını kullanır (bkz. "knexfile.js" ve "data/dbConfig.js")
3- Testler, server.js ve migration(ler) yeterince detaylandırılıncaya kadar çalışmayacaktır.
4- `test.db3` dosyasını SQLite Studio ile açmak, testlerin çalışmasını engelleyebilir
5- Testler "kilitli taşıma tablosu" nedeniyle kilitlenirse testleri durdurun ve "test.db3" dosyasını silin
6- Postman veya HTTPie ile manuel test yapılması hala gereklidir
*/
const request = require('supertest')
const db = require('./data/dbConfig')
const server = require('./api/server')

const projectA = { project_name: 'Web API', project_description: 'Build APIs' }
const projectB = { project_name: 'Databases', project_description: 'Learn SQL', project_completed: 1 }
const projectC = { project_name: 'Authentication' }

const resourceA = { resource_name: 'keyboard' }
const resourceB = { resource_name: 'computer', resource_description: 'Windows PC' }

const taskA = { task_description: 'Do foo', project_id: 1 }
const taskB = { task_description: 'Do bar', task_notes: 'Use Postman!', project_id: 1 }
const taskC = { task_description: 'Do baz', task_notes: 'Have fun!', task_completed: 1, project_id: 2 }

afterAll(async () => {
  await db.destroy()
})
beforeEach(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

test('[0] sanity check', () => {
  expect(true).not.toBe(false)
})

describe('server.js', () => {
  // 👉 PROJECTS
  // 👉 PROJECTS
  // 👉 PROJECTS
  describe('projects uç noktaları', () => {
    describe('[GET] /api/projects', () => {
      beforeEach(async () => {
        await db('projects').insert(projectA)
        await db('projects').insert(projectB)
      })
      test('[1]tablodaki tüm projeler alınıyor', async () => {
        const res = await request(server).get('/api/projects')
        expect(res.body).toHaveLength(2)
      }, 750)
      test('[2]her proje, proje_adı, proje_tanımı ve proje_tamamlandı (bir boolean olarak) içerir', async () => {
        const res = await request(server).get('/api/projects')
        expect(res.body[0]).toMatchObject({ ...projectA, project_completed: false })
        expect(res.body[1]).toMatchObject({ ...projectB, project_completed: true })
      }, 750)
    })
    describe('[POST] /api/projects', () => {
      test('[3] tabloya yeni bir proje eklenebiliyor', async () => {
        await request(server).post('/api/projects').send(projectA)
        await request(server).post('/api/projects').send(projectB)
        await request(server).post('/api/projects').send(projectC)
        const projects = await db('projects')
        expect(projects).toHaveLength(3)
        expect(projects[0]).toMatchObject(projectA)
        expect(projects[1]).toMatchObject({ project_name: 'Databases', project_description: 'Learn SQL' })
        expect(projects[2]).toMatchObject({ ...projectC, project_description: null })
      }, 750)
      test('[4] yeni oluşturulan projeye, bir boolean olarak project_completed ile yanıt verir', async () => {
        let res = await request(server).post('/api/projects').send(projectA)
        expect(res.body).toMatchObject({ ...projectA, project_completed: false })
        res = await request(server).post('/api/projects').send(projectB)
        expect(res.body).toMatchObject({ ...projectB, project_completed: true })
        res = await request(server).post('/api/projects').send(projectC)
        expect(res.body).toMatchObject({ ...projectC, project_completed: false })
      }, 750)
      test('[5] project_name yoksa doğru hata mesajı ve durumkodu', async () => {
        const res = await request(server).post('/api/projects').send({})
        const projects = await db('projects')
        expect(res.status + '').toMatch(/4|5/)
        expect(projects).toHaveLength(0)
      }, 750)
    })
  })

  // 👉 RESOURCES
  // 👉 RESOURCES
  // 👉 RESOURCES
  describe('resources uç noktası', () => {
    describe('[GET] /api/resources', () => {
      test('[6] tablodaki tüm resourceslar alınıyor', async () => {
        await db('resources').insert(resourceA)
        await db('resources').insert(resourceB)
        const res = await request(server).get('/api/resources')
        expect(res.body).toHaveLength(2)
        expect(res.body[0]).toMatchObject(resourceA)
        expect(res.body[1]).toMatchObject(resourceB)
      }, 750)
    })
    describe('[POST] /api/resources', () => {
      test('[7] tabloya yeni resource ekleniyor', async () => {
        await request(server).post('/api/resources').send(resourceA)
        await request(server).post('/api/resources').send(resourceB)
        const resources = await db('resources')
        expect(resources).toHaveLength(2)
        expect(resources[0]).toMatchObject(resourceA)
        expect(resources[1]).toMatchObject(resourceB)
      }, 750)
      test('[8] yeni eklenen resourcela yanıtlanıyor', async () => {
        const res = await request(server).post('/api/resources').send(resourceA)
        expect(res.body).toMatchObject(resourceA)
      }, 750)
      test('[9] var olan bir resource_name le eklenirse reddediliyor', async () => {
        await db('resources').insert(resourceA)
        const res = await request(server).post('/api/resources').send(resourceA)
        const resources = await db('resources')
        expect(res.status + '').toMatch(/4|5/)
        expect(resources).toHaveLength(1)
      }, 750)
    })
  })

  // 👉 TASKS
  // 👉 TASKS
  // 👉 TASKS
  describe('tasks uç noktası', () => {
    beforeEach(async () => {
      await db('projects').insert(projectA)
      await db('projects').insert(projectB)
      await db('tasks').insert(taskA)
      await db('tasks').insert(taskB)
      await db('tasks').insert(taskC)
    })
    describe('[GET] /api/tasks', () => {
      test('[10] tüm taskler alınıyor', async () => {
        const res = await request(server).get('/api/tasks')
        expect(res.body).toHaveLength(3)
      }, 750)
      test('[11] tüm görevler task_description task_notes task_completed boolean içerior', async () => {
        const res = await request(server).get('/api/tasks')
        expect(res.body[0]).toMatchObject({
          task_description: 'Do foo',
          task_notes: null,
          task_completed: false,
        })
        expect(res.body[1]).toMatchObject({
          task_description: 'Do bar',
          task_notes: 'Use Postman!',
          task_completed: false,
        })
        expect(res.body[2]).toMatchObject({
          task_description: 'Do baz',
          task_notes: 'Have fun!',
          task_completed: true,
        })
      }, 750)
      test('[12] tüm taskler project_name ve project_description içeriyor', async () => {
        const res = await request(server).get('/api/tasks')
        expect(res.body[0]).toMatchObject({
          project_name: 'Web API',
          project_description: 'Build APIs',
        })
        expect(res.body[1]).toMatchObject({
          project_name: 'Web API',
          project_description: 'Build APIs',
        })
        expect(res.body[2]).toMatchObject({
          project_name: 'Databases',
          project_description: 'Learn SQL',
        })
      }, 750)
    })
    describe('[POST] /api/tasks', () => {
      test('[13] db ye yeni task ekleniyor', async () => {
        await db('tasks').truncate()
        await request(server).post('/api/tasks').send(taskA)
        await request(server).post('/api/tasks').send(taskB)
        await request(server).post('/api/tasks').send(taskC)
        const tasks = await db('tasks')
        expect(tasks).toHaveLength(3)
      }, 750)
      test('[14] yeni oluşturulan task task_completed 1 olarak yanıtlanıyor', async () => {
        await db('tasks').truncate()
        const res = await request(server).post('/api/tasks').send(taskA)
        expect(res.body).toMatchObject({
          task_description: 'Do foo',
          task_notes: null,
          task_completed: false,
        })
      }, 750)
      test('[15] task_description yoksa doğru hata mesajı ', async () => {
        await db('tasks').truncate()
        const res = await request(server).post('/api/tasks').send({ project_id: 1 })
        const tasks = await db('tasks')
        expect(res.status + '').toMatch(/4|5/)
        expect(tasks).toHaveLength(0)
      }, 750)
      test('[16] project_id yoksa reddeliyor ve doğru durum kodu', async () => {
        await db('tasks').truncate()
        const res = await request(server).post('/api/tasks').send({ task_description: 'Execute order 66' })
        const tasks = await db('tasks')
        expect(res.status + '').toMatch(/4|5/)
        expect(tasks).toHaveLength(0)
      }, 750)
      test('[17] project_id geçersizse doğru hata durum kodu', async () => {
        await db('tasks').truncate()
        const res = await request(server).post('/api/tasks').send({ ...taskA, project_id: 66 })
        const tasks = await db('tasks')
        expect(res.status + '').toMatch(/4|5/)
        expect(tasks).toHaveLength(0)
      }, 750)
    })
  })
})
