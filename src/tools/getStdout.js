const shelljs = require('shelljs')
const chalk = require('chalk')

function getStdout (cli, params) {
  return new Promise(resolve => {
    shelljs.exec(
      cli,
      {
        silent: true
      },
      function (err, stdout, stderr) {
        if (err) {
          const tipStr = params.ignoreError
            ? '请排查'
            : `可以忽略${params.ignoreErrorTxt || ''}`
          console.log(
            chalk.yellow(`【debugger】执行 sh 出错咯，！${tipStr}`) +
            `命令: ${cli}\n` +
            `标准输入: ${stdout}\n` +
            `错误信息: ${stderr}`
          )
        }
        resolve(stdout)
      }
    )
  })
}

module.exports = getStdout
