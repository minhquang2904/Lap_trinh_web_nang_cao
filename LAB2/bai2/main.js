const http = require('http')
const fs = require('fs')
const URL = require('url')
const querystring = require('querystring');
const { fail } = require('assert');

port = 8080;

const main = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html; charset="UTF-8"'});

    const url = URL.parse(req.url);
    if(url.pathname == '/'){
        const pageLogin = fs.readFileSync('./index.html');
        return res.end(pageLogin);
    }else if(url.pathname == '/login'){
        if(req.method == 'GET'){
            const pageFailNotSupportGet = fs.readFileSync('./GET.html');
            return res.end(pageFailNotSupportGet);
        }

        let data = '';

        req.on('data', (e) =>{
            data += e.toString();
            let input = querystring.decode(data)
            if(input.email == ""){
                return res.end('Chưa nhập email')
            }else if(input.password == ""){
                return res.end('Chưa nhập password')
            }else if(input.email == "admin@gmail.com" && input.password == "123456"){
                const pageSuccess = fs.readFileSync('./success.html');
                return res.end(pageSuccess);
            }else if(input.email != "admin@gmail.com" || input.password != "123456"){
                const pageFail = fs.readFileSync('./fail.html');
                return res.end(pageFail);
            }
        });
    }else{
        const pagePath = fs.readFileSync('./path.html');
        return res.end(pagePath);
    }

});

main.listen(port,() => {
    console.log('Bạn đang sử dụng cổng ' + port);
});