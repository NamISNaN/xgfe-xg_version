#!/usr/bin/env node

// import {promptList,promptList2,promptList3} from "./option";
require('../lib/change.js')
// const promptList = require('./option').promptList
// const promptList2 = require('./option').promptList2
// const promptList3 = require('./option').promptList3
const {promptList,promptList2,promptList3,promptList4,promptList5,promptList6} = require('./option')
const FS = require('fs');
const commander = require('commander')
const inquirer = require('inquirer');
const propertiesPaser = require('./propertiesPaser').parseProps
const jsPaser = require('./jsPaser').jsProps
const shell = require('shelljs')
// src = '/Users/chenlei/Desktop/code/work/xgfe-admin/node_test'
src = ''
//需要修改的文件
versionName = ['package.json','sonar-project.properties','src/app/main.js']
changeFunctionName = []
specialVersion = ''
let releaseName=''


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
  if (type == 'input') {
    inquirer
      .prompt(promptList2)
      .then(answer => {
        this.src = answer.src
        inputRelease()
      })
  } else {
    // 调试时候暂时注释下面两行
    this.src = process.cwd().split('/hybrid')[0]
    inputRelease()
  }
}

//输入版本号函数
let inputVersion = async function(){
// async function inputVersion() {
  await inquirer
    .prompt(promptList3)
    .then(answer => {
      global.version = answer
       changeVersion(global.version)
        .then((res)=>{
        console.log('将路径'+this.src+'下的版本号修改：' + global.version.version+'，准备执行封板操作')
        gitOpreat()
      })
        .catch(err=>{
          console.log(err)
        })
    } )
}
//操作git分支
let gitOpreat = async function(){
  //本地是否有release-xxxx 分支 没有的话 新建一个
  let flag = true
  await inquirer
    .prompt(promptList4)
    .then(res=>{
     res.release===0?flag=false:flag=true
    })
  if (!flag){
    //本地没有release分支
    await git(`git fetch origin ${global.releaseName}:${global.releaseName}`)
    await git('git add .')
    await git("git commit -m 'feat[TMS](TMS) 修改版本号'")
    await git('git checkout master')
    await git ('git pull origin master')
    await git(`git merge ${global.releaseName}`)
    await git('git push origin master')
    await git(`git tag -a v${global.version.version} -m 'v${global.version.version}'`)
    await git(`git push origin v${global.version.version}:v${global.version.version}  `)
  }else {
    // 本地有release分支
    await git('git add .')
    await git("git commit -m 'feat[TMS](TMS) 修改版本号'")
    await git(`git checkout ${global.releaseName}`)
    //   .then(res=>{
    //   console.log('git回调函数函数')
    //     console.log(res)
    // })
    //   .catch(err=>{
    //     console.log('err回调函数函数')
    //     console.log(err)
    //   })
    //   .catch((err)=>{
    //   console.log('这是git回调的err')
    //   console.log(err)
    //   // process.exit(1)
    // })

    await git(`git pull origin ${global.releaseName} `)
    await git('git checkout master')
    await git ('git pull origin master')
    await git(`git merge ${global.releaseName}`)
    await git('git push origin master')
    await git(`git tag -a v${global.version.version} -m 'v${global.version.version}'`)
    await git(`git push origin v${global.version.version}:v${global.version.version}  `)
  }
}

function git(code){
  return new Promise(((resolve,reject) => {
    // shell.exec(code)
    console.log('\x1B[36m%s\x1B[0m',code)
   shell.exec(code,{fatal:true},function(code, stdout, stderr) {
     console.error('\x1B[31m%s\x1B[0m',stderr)
     if (code===1){
         checkError().then(res=>{
           res===0?resolve(stdout):process.exit(1)
         })
       // reject(stderr)
     }else {
       resolve(stdout)
     }
    })
  })
  )
}

async function checkError(){
 ans = ''
 await  inquirer
    .prompt(promptList6)
    .then(answer => {
      ans = answer.error
      return answer.error
      // if (answer.error === 0 ){
      //   return
      // } else { process.exit(1)}
    } )
  return ans
}

//获取release分支名称
function inputRelease() {
  inquirer
    .prompt(promptList5)
    .then(answer => {
      global.releaseName = answer.releaseBranch
      inputVersion()
    } )
}

const changeVersion =  function(ver) {
  return new Promise((resolve => {
    let n = 0;

    const callbackPass = () => n++
    const callbackInvoke = () => {
      n--
      if (n <= 0) {
        resolve();
      }
    }

    let files = FS.readdirSync(this.src)
    if (files.length != 0) {
     files.forEach((item) => {
        let path = this.src + '/' + item
        let status= FS.statSync(path)
        // if (err) return err
        let isFile = status.isFile()
        let isDir = status.isDirectory()
        if (isFile && versionName.indexOf(item) != -1) {
          switch (versionName.indexOf(item)) {
            //修改package.json
            case 0:
              let file1 = FS.readFileSync(path, 'utf-8')
              let file1_json = JSON.parse(file1)
              if (ver.version.split('.').length > 3) {
                var verSplice = ver.version.split('.')
                verSplice.pop()
                verSplice = verSplice.join('.')
                callbackPass();
                replaceFile(path, '"version": "' + file1_json.version + '"', '"version": "' + verSplice + '"', callbackInvoke)
                break;
              }
              //执行替换操作
              callbackPass()
              replaceFile(path, '"version": "' + file1_json.version + '"', '"version": "' + ver.version + '"', callbackInvoke)
              break;
            //修改 sonar-project.properties
            case 1:
              callbackPass()
              propertiesPaser(path, ver, (err, ...args) => {
                if (err == null) {
                  getProperValue(...args, callbackInvoke)
                } else {
                  throw err
                }
              })
              break;
            //修改 src/app/main.js
            case 2:
              break;
          }
        }
        if (isDir && item == versionName[2].split('/')[0]) {
          // //修改src目录下文件
          path = path.substring(0, path.length - 3) + versionName[2]

          callbackPass()
          jsPaser(path, ver, (err, ...args) => {
            if (err == null) {
              mainCallBack(...args, callbackInvoke)
            } else  {
              throw err
            }
          })
          // changeProper(path,ver,)
          // replaceFile(path+'/','"version": "'+file1_json.version+'"','"version": "'+ver.version+'"')

          // 执行文件夹修改操作
          // switch ( .indexOf(item)) {
          //
          // }
        }
        // FS.stat(path, async function (err, status) {
        // })
      })

    }

    //  FS.readdir(this.src, function (err, files) {
    //   if (err) return err
    // })


  }))
}

//替换函数
let replaceFile = function(filePath,sourceRegx,targetStr, callback) {
  FS.readFile(filePath, function (err, data) {
    if (err) {
      return err;
    }
    let str = data.toString();
    str = str.replace(sourceRegx, targetStr);

    FS.writeFile(filePath, str, function (err) {
      if (err) {
        callback(err)
      } else {
        callback(null)
      }
    });
  });
}

//修改 properties和main.js  版本号需要特殊处理
let changeProper = function(path,ver,value, callback) {
  // if(ver.split('.').length<4){

  // }
  // console.log(ver.version)
  let   temp = ver.version.split('.').length < 4 ?  'v' + ver.version + '.0' :  'v' + ver.version
  // let temp = 'v' + ver.version + '.0'
  // ver.version = 'v' + ver.version + '.0'
  replaceFile(path,value,temp, callback)
}


//解析proper
let getProperValue = function (path,ver,res, callback) {
  if (res['sonar.projectVersion'] != undefined){
    specialVersion = res['sonar.projectVersion']
    changeProper(path,ver,res['sonar.projectVersion'], callback)
  }
  // return res['sonar.projectVersion']
}

//解析main.js的回调函数
let mainCallBack = function (path,ver,res, callback) {
  changeProper(path,ver,res, callback)
}

