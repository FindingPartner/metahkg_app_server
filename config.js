console.log("heroku specificy the port you have to listen, PORT ISSSSSSSSSSSS ", process.env.PORT || 8080)

module.exports = {
    port: process.env.PORT || 8080,
    db: {
        prod: "mongodb+srv://username:pw@clustername.jrfj8.mongodb.net/dbname" || 'mongodb://localhost/reddit-clone',
        test: 'mongodb://localhost/reddit-test',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        }
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'development_secret',
        expiry: '7d'
    }
};
