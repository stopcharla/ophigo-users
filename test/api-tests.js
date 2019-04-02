const expect = require('chai').expect;
const request = require('supertest');
const app = require('../app')

describe('testing all the rest apis', () => {
    
    it('signup api should return 400',  async () => {
        const now = (new Date()).getTime()
        const userDetails = {
            name:"ophigo",
            emailId: `ophigotest-${now}gmail.com`,
            password: 'ophigo123'
        }
        const response = await request(app).post("/v1/signup").send(userDetails);
        console.log('*******************:',response.status)
        expect(response.status).to.be.equal(400)
    })

    it('signup api should return 200 and verifying login and get users as well', async () => {
        const now = (new Date()).getTime()
        const userDetails = {
            name:"ophigo",
            emailId: `ophigotest-${now}@gmail.com`,
            password: 'ophigo123'
        }
        const response = await request(app).post("/v1/signup").send(userDetails);
        console.log(response.status)
        expect(response.status).to.be.equal(200)

        console.log('successfully signed up')

        const loginresponse = await request(app).post("/v1/login").send({emailId:userDetails.emailId, password: userDetails.password})
        expect(loginresponse.status).to.be.equal(200)
        const authtoken = loginresponse.body.tokenId
        console.log(authtoken)
        console.log('successfully logged in')

        const usersresponse = await request(app).get("/v1/users").set('Authorization', `bearer ${authtoken}`).send()
        expect(usersresponse.status).to.be.equal(200)
    })



})