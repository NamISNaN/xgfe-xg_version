const fs = require('fs');
const commander = require('commander')

//版本号 等基础信息描述
commander
  .version('0.0.1')
  .description('Quickly implement version number modification and perform git commit and push operations')
  .option('-p,--peppers','Add peppers')

