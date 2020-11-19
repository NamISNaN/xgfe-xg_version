# @xg-version

## Injected Commands


## Usage

### 注意，一定确保线上已经有release-xxxx(上线日期) 分支才可以进行使用。
可以实现快速修改xgfe-wms 中的版本号 ，并自动执行封板操作。
目前修改的位置如下

```js
'xgfe-wms/package.json'

'xgfe-wms/sonar-project.properties'

'xgfe-wms/src/app/main.js'

```


使用方法：

```js
mnpm install xg-version  
 
xg-version

// 按提示进行选择即可

// 如果为mnpm 安装默认选择当前目录即可 ，其他情况如需手动可以 按如下格式输入
/// Users/chenlei/Desktop/code/work/xgfe-wms 【要求为xgfe-wms的路径地址】
```

异常处理：
版本号修改并不会出现异常 除非


