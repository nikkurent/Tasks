const mongoose = require('mongoose');
const config = require('./config/database')

mongoose.connect(config.database, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log('Connected to MongoDB Succesfully')
}).catch((error) => console.log(error))

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

module.exports = {mongoose}