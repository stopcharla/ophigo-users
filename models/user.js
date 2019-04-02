const mongoose = require('mongoose')

const UsersSchema = new mongoose.Schema({
    name: String,
    emailId: {
        type: String,
        unique: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    hash: String,
},{
    timestamps: true
});

module.exports = mongoose.model('Users', UsersSchema);
