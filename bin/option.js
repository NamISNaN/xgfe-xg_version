//设置路径
const promptList = [
  {
    type: 'list',
    message: '选择您的项目目录:',
    name: 'src',
    choices: [
      {
        key: 0,
        name: '当前目录',
        value: 0
      },
      {
        key: 1,
        name: '手动输入',
        value: 1
      }
    ],
  }
]

const promptList2 = [{
  type: 'input',
  message: '请输入路径(如：/Users/zhangsan/Desktop/xg-version):',
  name: 'src',
  validate: function(val) {
    // if(val.match(/.*xgfe.*/g)) { // 校验路径
    //   this.src = val
    //   return true;
    // }
    // return "请输入正确的路径";
    this.src = val
    return true;
  }
}]

//已经输入目录 输入需要更新的版本号
const promptList3 = [{
  type: 'input',
  message: '请输入需要更新版本号至:',
  name: 'version',
  validate: function(val) {
    if(val.length != 0 && val.match(/^([1-9]\d|[1-9])(\.([1-9]\d|\d)){1,4}$/)) { // 校验版本号
      return true;
    }
    return "请检查版本号格式～";
  }
}]



const promptList4 = [
  {
    type: 'list',
    message: '本地是否已经有release分支:',
    name: 'release',
    choices: [
      {
        key: 0,
        name: '还未创建',
        value: 0
      },
      {
        key: 1,
        name: '已经创建',
        value: 1
      }
    ],
  }
]

//输入release分支名称
const promptList5 = [{
  type: 'input',
  message: '请输入release分支名称（如：release-1117）:',
  name: 'releaseBranch'
}]

const promptList6 = [
  {
    type: 'list',
    message: '似乎出现了一些问题，清查看上方日志以确定是否需要继续封板:',
    name: 'error',
    choices: [
      {
        key: 0,
        name: '继续发布',
        value: 0
      },
      {
        key: 1,
        name: '中止发布',
        value: 1
      }
    ],
  }
]

// export {promptList,promptList2,promptList3}
// module.exports = {promptList,promptList2,promptList3}
// exports.promptList = promptList
// exports.promptList2 =promptList2
// exports.promptList3 = promptList3
module.exports = {
  promptList,
  promptList2,
  promptList3,
  promptList4,
  promptList5,
  promptList6
}