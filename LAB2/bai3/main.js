const http = require('http');
const URL = require('url');
const queryParser = require('querystring');
const data = new Map();
const getId = /\/student\/[a-zA-Z0-9]+\/*$/ig
port = 8080;


const main = http.createServer((req, res) =>{
    res.writeHead(200, {'Content-Type': 'text/html; charset="UTF-8"'});

    let url = URL.parse(req.url)

    if(url.pathname == '/student'){
        if(req.method === 'POST'){
            let body = '';
            req.on('data', (d) => {
                body += d.toString();
                let input = queryParser.decode(body);
                if(input.id == ''){
                    return res.end(JSON.stringify({code:0,message: 'Chưa nhập id'}));
                }else if(input.name == ''){
                    return res.end(JSON.stringify({code:0,message: 'Chưa nhập tên'}));
                }else if(input.age == ''){
                    return res.end(JSON.stringify({code:0,message: 'Chưa nhập tuổi'}));
                }else if(data.has(input.id)){
                    return res.end(JSON.stringify({code:0,message: 'Id đã tồn tại'}));
                }

                data.set(input.id, input)
                console.log(data)
                res.end(JSON.stringify({code:0,message: 'Them thanh cong'}));
            });
            return data;
        }else if(req.method === 'GET'){
            if(data.size == 0){
                return res.end(JSON.stringify({code:0,message: 'Không có sinh viên'}));
            }
            const getStudent = Array.from(data.values());
            return res.end(JSON.stringify({code:0,message: 'Danh sách sinh viên', data: getStudent}));
        }
    }else if(url.pathname.match(getId)){
        // Lay id 
        const id = /[a-zA-Z0-9]+\/*$/ig
        // Xoa cac ki tu du
        const getStudentId = url.pathname.match(id)[0].replace(/\/*$/ig,'');
        if(data.has(getStudentId)){
            const d = data.get(getStudentId)            
            return res.end(JSON.stringify({code:0,message: 'Có sinh viên', data: d}));
        }else{
            return res.end(JSON.stringify({code:0,message: 'Không tồn tại sinh viên',getStudentId}));
        }
    }
    else{
        return res.end(JSON.stringify({code:0,message: 'Trang không tồn tại có id'}));
    }
});



main.listen(port, () =>{
    console.log('Bạn đang sử dụng cổng ' + port);
});