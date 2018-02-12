const utilities = require('@source4society/scepter-utility-lib')
module.exports.prepareSlsArgs = function prepareSlsArgs (args, injectedStartIndex) {
  const startIndex = utilities.valueOrDefault(injectedStartIndex, 5)
  let slsArgs = ''
  if (args.length > startIndex) {
    for (let i = startIndex; i < args.length; i++) {
      slsArgs += `${args[i]} `
    }
  }
  return slsArgs
}
