const mongoose = require('mongoose')
const config = require('./config')

mongoose.connect(config.dbConfig.dbURl, { useNewUrlParser: true })
    .then(() => {
        console.log('Mongoose connected')
    })
    .catch(err => {
        console.log(err)
    })