const supertest = require("supertest")
const {app,server} = require("../index")
const {sendMail} = require("../services/emailService")
const mongoose = require("mongoose")
const api = supertest(app)

test('email error status its false', async () => {
    const email = `´correoprueba@gmail.com`
    const messageGMAIL = `<h1>Hola a todos</h1>`
    const subject = `Roberto`
    const {error,message} = await sendMail(email,messageGMAIL,subject)
    console.log(message)
    expect(error).toBe(true)
    expect(message).toBe(`Email sent to ${email}`)
})


afterAll(()=>{
    mongoose.connection.close(true)
    server.close(1)
})
