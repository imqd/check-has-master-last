/**
 * @function getCleanTagName 获取干净的tag名
 * @param {string} tag
 */
function getCleanTagName (tag) {
  // https://www.yiibai.com/git/git_describe.html
  // git describe --tags
  // tag1-2-g026498b
  // 2:表示自打tag tag1 以来有2次提交(commit)
  // g026498b：g 为git的缩写，在多种管理工具并存的环境中很有用处；
  const cleanTag = tag.trim().replace(/-\d{1,}-g\w{1,}$/g, '')
  console.log('cleantag', cleanTag)
  return cleanTag
}

module.exports = {
  getCleanTagName
}
