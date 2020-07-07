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
          console.log('执行 sh 出错咯，快来看看！', stdout, stderr)
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
  if (lastTag) {
    console.log(chalk.yellow('\n【目前，master 没有任何分支，确认下项目是不是初次开发】\n'))
  }
  const lastTagCommitId = await getExecSh(`git rev-parse ${getCleanTagName(lastTag)}`)
  console.log('originMasterLastCommitId', originMasterLastCommitId)
  console.log('lastTag', getCleanTagName(lastTag))
  console.log('lastTagCommitId', lastTagCommitId)
  if (originMasterLastCommitId !== lastTagCommitId) {
    console.log(chalk.red('\n【小伙子，你很危险！】master 最新代码没有打 tag\n'))
    process.exit()
  }
  const originMasterLastTag = await getExecSh('git describe --tags origin/master')
  const currentBranchLastTag = await getExecSh(`git describe --tags`)
  
  // console.log('currentBranchLastTag', currentBranchLastTag)
  // console.log('originMasterLastTag', originMasterLastTag)

  if (getCleanTagName(currentBranchLastTag) !== getCleanTagName(originMasterLastTag)) {
    console.log(chalk.red('\n【小伙子，你很危险！】你现在分支没有 master 最新代码\n'))
    process.exitCode = 1
  }
  console.log(chalk.green('\n【代码已有 master 最新代码，很安全啊！】\n'))
}

function getCleanTagName (tag) {
  // https://www.yiibai.com/git/git_describe.html
  // git describe --tags
  // tag1-2-g026498b
  // 2:表示自打tag tag1 以来有2次提交(commit)
  // g026498b：g 为git的缩写，在多种管理工具并存的环境中很有用处；
  const cleanTag = tag.trim().replace(/\-\d{1,}\-g\w{1,}$/g, '')
  console.log('cleantag', cleanTag)
  return cleanTag
}

module.exports = exec
