const fs = require('fs')
const Path = require('path')
const {fileIcons, fileTypes} = require('./spfiles')
exports.load = (useRoot, location) => {
    return new Promise((resolve, reject) => {
        let files = fs.readdirSync(location)
        let result = []

        files.forEach(file => {
            let name = file
            let path = location + '/' + name
            if(location.endsWith('/')){
                path = location + name
            }
            let e = Path.extname(name)
            let stats = fs.statSync(path)
            let type = fileTypes[e]
            let icon = fileIcons[e] || '<i class="fas fa-file"></i>'
            let subPath = path.replace(useRoot, '')
            if(stats.isDirectory()){
                if(subPath.startsWith('/')){
                    subPath = `?dir=${subPath.substring(1)}`
                }else{
                    subPath = `?dir=${subPath}`
                }
            }
            
            result.push({
                name: name,
                path: path,
                isDirectory: stats.isDirectory(),
                size: stats.size,
                lastModified: stats.mtime,
                subPath:subPath,
                e: e,
                type: type,
                icon: icon,
            })
        })

        resolve(result)
    })
}