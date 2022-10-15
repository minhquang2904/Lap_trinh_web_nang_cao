const http = require("http");
const URL = require('url')
const querystring = require('querystring')
const port = 8080

const main = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html; charset="UTF-8"'});

    const url  = URL.parse(req.url);
    const urlQuery = url.query;

    if(url.pathname == '/'){
        pageCalculator = res.end(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Máy tính</title>
                <style>
                    *{
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    }
                    
                    body{
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                    }
            
                    .content{
                        background-color: rgb(212, 212, 212);
                        border-radius: 5px;
                        padding: 20px;
                    }
            
                    h2{
                        text-transform: uppercase;
                        text-align: center;
                        margin-bottom: 16px;
                    }
                    
                    .form-group{
                        margin-bottom: 12px;
                    }
            
                    .form-group label{
                        margin-bottom: 8px;
                        display: inline-block;
                        font-size: 18px;
                    }
            
                    .form-input{
                        width: 100%;
                        border: 1px solid #ccc;
                        outline: none;
                        height: 30px;
                        border-radius: 5px;
                        padding: 0 10px;
                    }
            
                    .btn{
                        float: right;
                        border: none;
                        outline: none;
                        padding: 10px 24px;
                        background-color: greenyellow;
                        cursor: pointer;
                        border-radius: 5px;
                    }
                </style>
            </head>
            <body>
                <div class="content">
                    <h2>Máy tính</h2>
                    <form action="/result" method="GET">
                        <div class="form-group">
                            <label for="">Số hạng 1</label>
                            <input type="text" class="form-input" name="sohang1" placeholder="Nhập số thứ nhất">
                        </div>
                        <div class="form-group">
                            <label for="">Số hạng 2</label>
                            <input type="text" class="form-input" name="sohang2" placeholder="Nhập số thứ hai">
                        </div>
                        <div class="form-group">
                            <label for="">Phép tính</label>
                            <select class="form-input" name="pheptinh">
                                <option value="">Chọn phép tính</option>
                                <option value="+">Cộng (+)</option>
                                <option value="-">Trừ (-)</option>
                                <option value="*">Nhân (x)</option>
                                <option value="/">Chia (÷)</option>
                            </select>
                        </div>
                        <button class="btn">Tính</button>
                    </form>
                </div>
            </body>
            </html>
        `);
        return pageCalculator;
    }else if(url.pathname == '/result'){
        let queryString = querystring.decode(urlQuery);

        let sohang1 = queryString.sohang1;
        let sohang2 = queryString.sohang2;
        let pheptinh = queryString.pheptinh;

        if(sohang1 == ""){
            return res.end("Chưa nhập số hạng 1");
        }else if(sohang2 == ""){
            return res.end("Chưa nhập số hạng 2");
        }else if(pheptinh == ""){
            return res.end("Chưa chọn phép tính");
        }


        if(pheptinh == "+"){
            result = parseInt(sohang1) + parseInt(sohang2);
        }else if(pheptinh == "-"){
            result = parseInt(sohang1) - parseInt(sohang2);
        }else if(pheptinh == "*"){
            result = parseInt(sohang1) * parseInt(sohang2);
        }else if(pheptinh == "/"){
            result = parseInt(sohang1) / parseInt(sohang2);
        }


        // pageResult = res.end(`${sohang1} ${pheptinh} ${sohang2} = ${result}`);
        pageResult = res.end(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Kết quả</title>
                <style>
                    *{
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    }
                    
                    body{
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                    }
            
                    .content{
                        background-color: rgb(212, 212, 212);
                        border-radius: 5px;
                        padding: 30px;        
                        text-align: center;
                    }
            
                    h2{
                        margin-bottom: 16px;
                        text-transform: uppercase;
                    }
                    
                    span{
                        font-size: 18px;
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <div class="content">
                    <h2>Kết quả</h2>
                    <span>${sohang1}</span>
                    <span>${pheptinh}</span>
                    <span>${sohang2}</span>
                    <span> = </span>
                    <span>${result}</span>
                </div>
            </body>
            </html>
        `);

        return pageResult;
    }else{
        pageError = res.end('Đường dẫn không hợp lệ')
        return pageError;
    }
})

main.listen(port,() => {
    console.log('Bạn đang chạy với port ' + port);
});