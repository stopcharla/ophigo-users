module.exports = {
    maxUsersPerPage :100,
    defaultPageNumber : 0,
    jwtTTL: 60*60,
    dbConfig: {
        dbURl: "mongodb://mongo/ophigo-users"
    },
    serverKeys: {
        secret : "abcdefuyio098655gnnmbg677"
    },
    saltRounds:10
};