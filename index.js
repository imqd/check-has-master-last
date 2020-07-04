const shelljs = require('shelljs')
const chalk = require('chalk')

function getExecSh (cli, params) {
  return new Promise(resolve => {
    shelljs.exec(
      cli,
      {
        silent: true
      },
      function (err, stdout, stderr) {
        if (err) {
          console.log('执行 sh 出错咯，快来看看！')
        }
        resolve(stdout)
      }
    )
  })
}

// tag 分支知识点
// https://www.it-swarm.dev/zh/git/%E5%A6%82%E4%BD%95%E5%9C%A8git%E7%9A%84%E5%BD%93%E5%89%8D%E5%88%86%E6%94%AF%E4%B8%AD%E8%8E%B7%E5%8F%96%E6%9C%80%E6%96%B0%E7%9A%84%E6%A0%87%E7%AD%BE%E5%90%8D%E7%A7%B0%EF%BC%9F/967108080/
async function exec () {
  const originMasterLastCommitId = await  getExecSh('git rev-parse origin/master')
  const lastTag = await getExecSh('git describe --tags origin/master')
  const lastTagCommitId = await getExecSh(`git rev-parse ${lastTag}`)
  // console.log('originMasterLastCommitId', originMasterLastCommitId)
  // console.log('lastTag', lastTag)
  // console.log('lastTagCommitId', lastTagCommitId)
  if (originMasterLastCommitId !== lastTagCommitId) {
    console.log(chalk.red('\n【小伙子，你很危险！】master 最新代码没有打 tag\n'))
    process.exit()
  }
  const currentBranchLastTag = await getExecSh('git describe --tags')
  const originMasterLastTag = await getExecSh('git describe --tags origin/master')

  if (currentBranchLastTag !== originMasterLastTag) {
    console.log(chalk.red('\n【小伙子，你很危险！】你现在分支没有 master 最新代码\n'))
    process.exitCode = 1
  }
}

module.exports = exec
