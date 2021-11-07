const mongoose = require('mongoose');
async function connect() {
    try {
        await mongoose.connect(
            'mongodb://localhost:27017/fashion'
            //'mongodb+srv://vantung:fashion199hn@cluster0.rwict.mongodb.net/fashion?retryWrites=true&w=majority',
        );
        console.log('connect db successfully');
    } catch (error) {
        console.log('connect db failure!!');
    }
}
module.exports = { connect };
