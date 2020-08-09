const getStdout = require('./getStdout')
const chalk = require('chalk')

/**
 * @function checkNetIsConnected 检测网络是否通常
 * @return {boolean}
 */

async function checkConnectGitlab () {
  const res = await Promise.race([
    getStdout('curl http://gitlab.pab.com.cn'),
    _sleep(10000)
  ])
  const bool = (res && res.trim()) === '<html><body>You are being <a href="http://gitlab.pab.com.cn/users/sign_in">redirected</a>.</body></html>'
  if (!bool) {
    console.log(chalk.yellow('【提醒】当前网络不支持 git push'))
    process.exit(0)
  }
  return bool
}

function _sleep (ts) {
  return new Promise(resolve => setTimeout(resolve, ts))
}

module.exports = checkConnectGitlab
