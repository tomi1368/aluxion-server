const supertest = require("supertest")
const {app,server} = require("../index")
const mongoose = require("mongoose")
const User = require("../db/models/User")

const api = supertest(app)

test('User registed succesfull ', async () => { 
    const user = {
        username:"Tomas Rodriguez",
        email:"usuariotomi@gmail.com",
        password:"contrasenia123"
    }
    const response = await api.post("user/register").send(user).expect(200)
    expect(response.data.savedUser.email).toBe(user.email)

 })

