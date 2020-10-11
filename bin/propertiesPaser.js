let readline = require('readline');
let fs = require('fs');
// properties文件路径
let local = 'zh'
let key2value = []
// Unicode 码转为中文
let toGB2312 = function(str) {
  return unescape(str.replace(/\\u/gi, '%u'));
}
// properties文件解析
let parseProps = async function(url,ver,callback) {
  let fRead = fs.createReadStream(url),
    readlineObj = readline.createInterface({
      input: fRead
    });

  await readlineObj.on('line', (line) => {
    var tmp = line.toString(),
      index = tmp.indexOf('#');
    // 拆分key、value
    if (index != 0) {
      let strIdx = tmp.indexOf('='),
        key = tmp.substr(0, strIdx),
        value = tmp.substr(strIdx + 1);
      // console.log(key,value)
      key2value[key] = value
      // global.proper = 'key2value'
      // console.log(key2value)
      // 将拆分key、value数据存储到node的全局变量global下的local属性
      // global.local[key] = local == 'zh' ? toGB2312(value) : value;
    }
    // console.log(key2value['sonar.projectVersion'])
  })
  // 文件读取结束
    readlineObj.on('close', () => {
     // return key2value['sonar.projectVersion']
      callback(url,ver,key2value)
      // global.proper = 'key2value'
   })
}

// export default parseProps

module.exports =  { parseProps }