const chalk = require('chalk')
const getStdout = require('./getStdout')
const checkConnectGitlab = require('./tools/checkConnectGitlab')
const { checkIsMasterOrRelease, checkHasOriginMaster } = require('./tools/checkBranch')
const { getCleanTagName } = require('./tools/checkTag')
const argv = require('minimist')(process.argv.slice(2))
const checkBranch = argv.branch
if (checkBranch) {
  console.log('**** 检测的分支是', checkBranch)
}

// tag 分支知识点
// https://www.it-swarm.dev/zh/git/%E5%A6%82%E4%BD%95%E5%9C%A8git%E7%9A%84%E5%BD%93%E5%89%8D%E5%88%86%E6%94%AF%E4%B8%AD%E8%8E%B7%E5%8F%96%E6%9C%80%E6%96%B0%E7%9A%84%E6%A0%87%E7%AD%BE%E5%90%8D%E7%A7%B0%EF%BC%9F/967108080/
async function exec () {
  const isNetConnected = await checkConnectGitlab()
  if (!isNetConnected) return

  const hasOriginMaster = await checkHasOriginMaster()
  if (!hasOriginMaster) return

  const isMaster = await checkIsMasterOrRelease()
  if (isMaster) return

  // 检查仓库 master 分支上有commit
  const originMasterLastCommitId = await getStdout('git rev-parse origin/master')
  if (!originMasterLastCommitId) {
    console.log(chalk.yellow('\n【提醒】目前 master 没有任何提交。\n'))
    return
  }
  const lastTag = await getStdout('git describe --tags origin/master')
  if (!lastTag) {
    console.log(chalk.yellow('\n【提醒】目前 master 没有任何 tag，请确认项目是否是初次开发？\n'))
    return
  }

  // git rev-list -n 1 <tagName>  # 准确输出tag对应commitid
  // git rev-parse <tagName>  # 不准确输出commitid
  const lastTagCommitId = await getStdout(`git rev-list -n 1 ${getCleanTagName(lastTag)}`)
  console.log('originMasterLastCommitId', originMasterLastCommitId)
  console.log('lastTag', getCleanTagName(lastTag))
  console.log('lastTagCommitId', lastTagCommitId)
  if (originMasterLastCommitId !== lastTagCommitId) {
    console.log(chalk.red('\n【危险】master 最新代码没有打 tag\n'))
    process.exit(1)
  }
  const originMasterLastTag = await getStdout('git describe --tags origin/master')
  const currentBranchLastTagCli = checkBranch ? `git describe --tags ${checkBranch}` : 'git describe --tags'
  const currentBranchLastTag = await getStdout(currentBranchLastTagCli)

  if (
    !currentBranchLastTag ||
      getCleanTagName(currentBranchLastTag) !== getCleanTagName(originMasterLastTag)
  ) {
    console.log(chalk.yellow(`\n【提醒】${checkBranch || '当前分支'}分支没有 master 分支最新的tag\n`))
    process.exit(1)
  }

  const checkBranchCommitIds = await getStdout(`git rev-list --all ${checkBranch}`)
  if (checkBranchCommitIds.indexOf(lastTagCommitId) === -1) {
    console.log(chalk.red(`\n【危险】${checkBranch || '当前'}分支没有 master 最新代码\n`))
    process.exit(1)
  }
  console.log(chalk.green(`\n【安全】${checkBranch || '当前'}分支已有 master 最新代码\n`))
}

module.exports = exec
