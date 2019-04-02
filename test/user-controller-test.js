const expect = require('chai').expect;
const sinon = require('sinon');
const userController = require('../controllers/userController');
const userService = require('../services/userService');
const authService = require('../services/authService');
const utils = require('../utils/utils');
const cryptoService = require('../services/cryptoService')

describe('Testing the signup function in user controller', () => {

    afterEach(function () {
        // completely restore all fakes created through the sandbox
        utils.validateObject.restore();
    });
    
    it('not sending username as a part of query parameters', async () => {
        const req = {
            body: {
                name: 'ophigo',
                emailId:"firstuser@ophigo.com"
            }
        }
        const res = {
            status: (status) => {
                return {
                    send: (response) => {
                        // console.log('response:', response);
                        expect(status).to.be.equals(400);
                    }
                };
            }
        }
        sinon.stub(utils, 'validateObject').returns(false);
        await userController.addUser(req, res);
        // utils.validateObject.restore();
    });

    it('adding the user with throwing error', async () => {
        const req = {
            body: {
                name: 'ophigo',
                emailId:`firstuser-${new Date()}@ophigo.com`,
                password: 'ophigo123'
            }
        }
        const res = {
            status: (status) => {
                return {
                    send: (response) => {
                        // console.log('response:', response);
                        expect(status).to.be.equals(400);
                    }
                };
            }
        }
        sinon.stub(utils, 'validateObject').returns(true);
        sinon.stub(userService, 'addUser').returns(Promise.reject({}))
        await userController.addUser(req, res);
        // utils.validateObject.restore()
        userService.addUser.restore()
    });
    
    it('adding the user with correct details', async () => {
        const req = {
            body: {
                name: 'ophigo',
                emailId:`firstuser-${new Date()}@ophigo.com`,
                password: 'ophigo123'
            }
        }
        const res = {
            status: (status) => {
                return {
                    send: (response) => {
                        // console.log('response:', response);
                        expect(status).to.be.equals(200);
                    }
                };
            }
        }
        sinon.stub(utils, 'validateObject').returns(true);
        sinon.stub(userService, 'addUser').returns(Promise.resolve({}))
        await userController.addUser(req, res);
        // utils.validateObject.restore()
        userService.addUser.restore()
    });

    it('verifying the login api without providing required details', async () => {
        const req = {
            body: {
                emailId:"firstuser@ophigo.com"
            }
        }
        const res = {
            status: (status) => {
                return {
                    send: (response) => {
                        // console.log('response:', response);
                        expect(status).to.be.equals(400);
                    }
                };
            }
        }
        sinon.stub(utils, 'validateObject').returns(false);
        await userController.login(req, res);
        // utils.validateObject.restore();
    });

    it('verifying the login api with invalid credentials', async () => {
        const req = {
            body: {
                password: "ophigo123",
                emailId:"firstuser@ophigo.com"
            }
        }
        const res = {
            status: (status) => {
                return {
                    send: (response) => {
                        console.log('login successful:', response);
                        expect(status).to.be.equals(400);
                    }
                };
            }
        }
        sinon.stub(utils, 'validateObject').returns(true);
        sinon.stub(userService, 'getUserInfo').returns(Promise.resolve([]))
        await userController.login(req, res);
        // utils.validateObject.restore();
        userService.getUserInfo.restore();
    });

    it('verifying the login api with throwing error from get user data', async () => {
        const req = {
            body: {
                password: "ophigo123",
                emailId:"firstuser@ophigo.com"
            }
        }
        const res = {
            status: (status) => {
                return {
                    send: (response) => {
                        expect(status).to.be.equals(400);
                    }
                };
            }
        }
        sinon.stub(utils, 'validateObject').returns(true);
        sinon.stub(userService, 'getUserInfo').returns(Promise.reject(Error('error')))
        await userController.login(req, res);
        // utils.validateObject.restore();
        userService.getUserInfo.restore();
    });

    it('verifying the login api with providing required details', async () => {
        const expectedAuthToken = "tokensample2345"
        const req = {
            body: {
                password: "ophigo123",
                emailId:"firstuser@ophigo.com"
            }
        }
        const res = {
            status: (status) => {
                return {
                    send: (response) => {
                        console.log('login successful:', response);
                        expect(status).to.be.equals(200);
                        expect(response.tokenId).to.be.equal(expectedAuthToken)
                    }
                };
            }
        }
        
        sinon.stub(utils, 'validateObject').returns(true);
        sinon.stub(userService, 'getUserInfo').returns(Promise.resolve([{emailId:"abcd",password:"abcd123"}]))
        sinon.stub(cryptoService,'compare').returns(Promise.resolve(true))
        sinon.stub(authService, 'createAuthToken').returns(Promise.resolve(expectedAuthToken))
        await userController.login(req, res);
        userService.getUserInfo.restore();
        cryptoService.compare.restore();
        authService.createAuthToken.restore();
    });

    it('verifying the get all users api by not providing all details', async () => {
        const req = {query:{}}
        const res = {
            status: (status) => {
                return {
                    send: (response) => {
                        expect(status).to.be.equals(403);
                    }
                };
            }
        }
        sinon.stub(utils, 'validateObject').returns(true);
        await userController.getAllUsersInfo(req, res);
    });

    it('verifying the get all users api  providing all details expected to be success', async () => {
        const usersInfo = [{emailId:"email@emailId.com", name:"emailID"}, {emailId:"newmail@emaild.com", name: "neawmail"}];
        const expectedResponse = {response:{pageNumber: 0, userCount: usersInfo.length, users: usersInfo }}
        const req = {
            emailId: "mailId@mailId.com",
            query:{}
        }
        const res = {
            status: (status) => {
                return {
                    send: (response) => {
                        expect(status).to.be.equals(200);
                        expect(response).to.be.deep.equal(expectedResponse)
                    }
                };
            }
        }
        sinon.stub(utils, 'validateObject').returns(true);
        sinon.stub(userService, 'getAllUsers').returns(Promise.resolve(usersInfo))
        await userController.getAllUsersInfo(req, res);
        userService.getAllUsers.restore();
    });
    
    
});