let ejs = {
  render: function(tempStr, data) {
    // 首先替换模板中的 <%=name%> <%=age%>
    tempStr = tempStr.replace(/<%=([\s\S]*?)%>/g, function() {
      return '${' + arguments[1] + '}';
    })
    // 拼接with函数 替换 <%xxx%> 部分
    let header = 'let str;\r\n with(data){\r\n';
    header += 'str = `\r\n';
    let content = tempStr.replace(/<%([\s\S]*?)%>/g, function() {
      return '`\r\n' + arguments[1] + '\r\n str += `';
    })
    let tail = '`\r\n}return str';
    let fn = new Function('data', header + content + tail);
    return fn(data);
  }
}

module.exports = ejs;