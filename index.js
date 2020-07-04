const shelljs = require('shelljs')
const chalk = require('chalk')

function getExecSh (cli, params) {
  shelljs.exec(
    'echo 2',
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
}

function exec () {
  const masterLastCommitId = getExecSh('git rev-parse origin/master')
  const lastTag = getExecSh('git tag -l')
  const lastTagCommitId = getExecSh(`git rev-parse ${lastTag}`)
  if (masterLastCommitId !== lastTagCommitId) {
    console.log(chalk.red('你大爷！你上次 tag 没打'))
    exit(0)
  }
  const ary = getExecSh('git rev-parse origin/master')
}


