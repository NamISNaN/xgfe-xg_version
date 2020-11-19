let readline = require('readline');
let fs = require('fs');
// properties文件路径
let local = 'zh'
let key2value = []
let version = ''
// Unicode 码转为中文
let toGB2312 = function(str) {
  return unescape(str.replace(/\\u/gi, '%u'));
}
// js文件解析
let jsProps = function(url,ver,callback) {
  let fRead = fs.createReadStream(url),
    readlineObj = readline.createInterface({
      input: fRead
    });

    readlineObj.on('line', (line) => {
    // console.log('开始解析line')
    // console.log(line)
    var tmp = line.toString(),
      index = tmp.indexOf('appVersion');
    // 拆分key、value
    if (index != -1) {
      // console.log('筛选出来的版本号')
      // console.log(tmp)
      let endIdx  = tmp.indexOf(';')

      let strIdx = tmp.indexOf('\''),
        // key = tmp.substr(0, strIdx),
        value = tmp.substring(strIdx + 1,endIdx-1);
      // console.log(value)
      version = value
      // key2value[key] = value
    }
  })
  // 文件读取结束
  readlineObj.on('close', () => {
    callback(null, url,ver,version)
  })
}

// export default parseProps

module.exports =  { jsProps }