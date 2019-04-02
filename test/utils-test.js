const expect = require('chai').expect;
const utils = require('../utils/utils');

describe('verifying the utilis functionality', () => {

    it('should return success as values are available', (done) => {
        const jsonObject = {
            name : "testUser",
            emailId: "testUser@gmail.com",
            password: "password"
        }
        const isValid = utils.validateObject(jsonObject, ["name", 'emailId', 'password']);
        expect(isValid).to.be.equal(true);
        done();
    });

    it('should return false as values are  not available', (done) => {
        const jsonObject = {
            emailId: "testUser@gmail.com",
            password: "password"
        }
        const isValid = utils.validateObject(jsonObject, ["name", 'emailId', 'password']);
        expect(isValid).to.be.equal(false);
        done();
    });

    it('should return false as values is null', (done) => {
        const jsonObject = {
            emailId: "testUser@gmail.com",
            password: null
        }
        const isValid = utils.validateObject(jsonObject, ['emailId', 'password']);
        expect(isValid).to.be.equal(false);
        done();
    });

})