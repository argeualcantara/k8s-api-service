const logger = {
    "err": (err) => {
        if(err.response) {
            console.log('Error!: ' + err.response.statusCode + ': ' + err.response.body.message);
        } else {
            console.log(err);
        }
    },
    "log": (str) => {
        console.log(str);
    }
}

module.exports = logger