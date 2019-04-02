/**
 * Checks if the jsonObject contains all the required keys in the object
 * returns true if all keys are available else false
 * @param {object} jsonObject 
 * @param {Array} keys 
 */

const validateObject = (jsonObject, keys) => {
    let isVaild = true;
    for (let key of keys){
        if(typeof jsonObject[key] === 'undefined' || jsonObject[key] === null || jsonObject[key].length < 1){
            isVaild = false
        }
    }
    return isVaild
}

module.exports = {
    validateObject
}