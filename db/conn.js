require('dotenv').config()
const mongoose=require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("DB conection sussessful");
}).catch((e) => {
    console.log("No connection" + e);
})
