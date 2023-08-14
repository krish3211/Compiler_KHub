const mongoose = require('mongoose');

const mongoURI = 'mongodb://127.0.0.1:27017/Brocodes';

const connectToMongo = ()=>{
    mongoose.connect(mongoURI)
    .then(()=>console.log('connected'))
    .catch(e=>console.log(e));
}

module.exports = connectToMongo