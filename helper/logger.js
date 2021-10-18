const logger = {
    "err": (err) => {
        console.log('Error!: ' + err.response.statusCode + ': ' + err.response.body.message);
    },
    "log": (str) => {
        console.log(str);
    }
}

module.exports = logger