const chalk = require('chalk')
const getStdout = require('./getStdout')

/**
 * @function getCurrentBranchName 获取当前分支名称
 * @return {boolean}
 */
async function getCurrentBranchName () {
  const branch = await getStdout('git rev-parse --abbrev-ref HEAD')
  return branch.trim()
}

/**
 * @function checkIsMaster 检测当前分支是不是master
 * @return {boolean}
 */
async function checkIsMasterOrRelease () {
  const branch = await getCurrentBranchName()
  console.log('current branch is', branch)
  const bool = branch === 'master' || branch.indexOf('release/') === 0
  if (bool) {
    console.log(chalk.red('\n【操作错误】禁止在 master 和 release 分支上，进行 git commit 和 git push \n'))
  }
  return bool
}

/**
 * @function checkHasOriginMaster 检查远程是否master分支
 * @return {boolean}
 */
async function checkHasOriginMaster () {
  const res = await getStdout('git ls-remote --heads origin master | wc -l')
  const bool = res.trim() === '1'
  if (!bool) {
    console.log(chalk.yellow('\n【提示】远程仓库没有 master 分支 \n'))
  }
  return bool
}

module.exports = {
  getCurrentBranchName,
  checkIsMasterOrRelease,
  checkHasOriginMaster
}
