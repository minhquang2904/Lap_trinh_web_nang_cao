const queryString = require('querystring')

const bodyParser = (req, res, next) => {
    let body = ''
    req.on('data', data => {
        body += data.toString();
    })
    req.on('end', () => {
        req.body = queryString.decode(body)
        next()
    })
    req.on('error', (e) => {
        throw e;
    });
}

module.exports = bodyParser