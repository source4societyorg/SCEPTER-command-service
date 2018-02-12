module.exports.prepareSlsArgs = function prepareSlsArgs (args) {
  let slsArgs = ''
  if (args.length > 5) {
    for (let i = 5; i < args.length; i++) {
      slsArgs += `${args[i]} `
    }
  }
  return slsArgs
}
