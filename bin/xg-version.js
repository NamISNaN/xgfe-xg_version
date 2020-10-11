#!/usr/bin/env node

// import {promptList,promptList2,promptList3} from "./option";
require('../lib/change.js')
const promptList = require('./option').promptList
const promptList2 = require('./option').promptList2
const promptList3 = require('./option').promptList3
const FS = require('fs');
const commander = require('commander')
const inquirer = require('inquirer');
const propertiesPaser = require('./propertiesPaser').parseProps
const jsPaser = require('./jsPaser').jsProps
// src = '/Users/chenlei/Desktop/code/work/xgfe-admin/node_test'
src = ''
//需要修改的文件
versionName = ['package.json','sonar-project.properties','src/app/main.js']
changeFunctionName = []
specialVersion = ''


//版本号 等基础信息描述
commander
  .version('0.0.1')
  .description('Quickly implement version number modification and perform git commit and push operations')
commander.on('--help', function () {
  console.log('');
});
commander.parse(process.argv);


inquirer
  .prompt(promptList)
  .then(answers => {
    const src = answers.src ? 'input' : 'default';
    switchSrc(src)

  })
  .catch(error => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else when wrong
    }
  });


//1.步骤操作，选择目录
function switchSrc(type) {
  if (type =='input' ){
    inquirer
      .prompt(promptList2)
      .then(answer => {
        this.src = answer.src
        inputVersion()
      } )
  }else {
    // 调试时候暂时关闭
    this.src = process.cwd()
    inputVersion()
  }


// switch (type) {
//   case 'input':
//     // 手动输入版本号
//     inquirer
//       .prompt(promptList2)
//       .then(answer => {
//         changeVersion(answer)
//         console.log(answer)
//       } )
//     break;
//   case 'default':
//     // 当前目录
//     inquirer
//       .prompt(promptList3)
//       .then(answer => {
//         changeVersion(answer)
//         console.log(answer)
//       } )
//     break;
// }
}

//输入版本号函数
function inputVersion() {
  inquirer
    .prompt(promptList3)
    .then(answer => {
      changeVersion(answer)
      console.log(answer)
    } )
}


 function changeVersion(ver) {
  // let fd = fs.openSync(this.src + 'main.js','w')
   FS.readdir(this.src,function (err,files) {
    if(err) return err
    if(files.length!=0){
      files.forEach((item)=>{
        let path = this.src + '/'+ item
        FS.stat(path,async function (err,status) {
          console.log('======StatusIsFile======')
          if(err) return err
          let isFile = status.isFile()
          let isDir  = status.isDirectory()
          if (isFile&&versionName.indexOf(item)!=-1){
             switch (versionName.indexOf(item)) {
                //修改package.json
              case 0:
                let file1 = FS.readFileSync(path,'utf-8')
                let file1_json = JSON.parse(file1)
                console.log(file1_json.version)
                //执行替换操作
                // console.log(ver)
                replaceFile(path,'"version": "'+file1_json.version+'"','"version": "'+ver.version+'"')
                break;
                //修改 sonar-project.properties
              case 1:
                // let file2 = FS.readFileSync(path,'utf-8')
                // let file2_json = JSON.parse(file2)
                // console.log(file1_json.version)

                console.log('============获取prop中接口===========')
                propertiesPaser(path,ver,getProperValue).then(res=>{
                })
                break;
                //修改 src/app/main.js
              case 2:
                break;
            }
          }
          if (isDir&&item==versionName[2].split('/')[0]){

            // console.log(path)
            // //修改src目录下文件
            path = path.substring(0,path.length - 3) + versionName[2]

              console.log('paaaaath')
              console.log(path)
            jsPaser(path,ver,mainCallBack)
            // changeProper(path,ver,)
              // replaceFile(path+'/','"version": "'+file1_json.version+'"','"version": "'+ver.version+'"')

         // 执行文件夹修改操作
            // switch ( .indexOf(item)) {
            //
            // }
          }
          console.log(item)
          console.log(isFile)
        })
      })
      console.log(this.src)
      console.log(files)
    }
  })



    console.log('将路径'+this.src+'下的版本号修改：' + ver.version)
}

//替换函数
let replaceFile = function(filePath,sourceRegx,targetStr) {
  console.log('正在执行替换'+filePath+sourceRegx+targetStr)
  FS.readFile(filePath, function (err, data) {
    if (err) {
      return err;
    }
    let str = data.toString();
    str = str.replace(sourceRegx, targetStr);

    console.log(filePath,sourceRegx,targetStr)
    FS.writeFile(filePath, str, function (err) {
      if (err) return err;
    });
  });
}

//properties和main.js  版本号需要特殊处理
let changeProper = function(path,ver,value) {
  let temp = 'v' + ver.version + '.0'
  // ver.version = 'v' + ver.version + '.0'
  replaceFile(path,value,temp)
}


//解析proper
let getProperValue = function (path,ver,res) {
  console.log(res['sonar.projectVersion'])
  if (res['sonar.projectVersion'] != undefined){
    specialVersion = res['sonar.projectVersion']
    changeProper(path,ver,res['sonar.projectVersion'])
  }
  // return res['sonar.projectVersion']
}

//解析main.js的回调函数
let mainCallBack = function (path,ver,res) {
  console.log('=======解析main.js=====')
console.log(path,ver,res)
  changeProper(path,ver,res)
}

// console.log('hello', process.argv)