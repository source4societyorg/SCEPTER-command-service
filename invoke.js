'use strict'
const prepareSlsArgs = require('./common').prepareSlsArgs

const invokeServiceCommand = {
  command: 'service:invoke',
  usage: 'service:invoke <service-name> <provider> <[optional serverless invoke command args]>',
  description: 'Invokes the service using the specified provider configuration',
  callback: callbackFunction,
  serverlessCommand: serverlessFunction
}

function callbackFunction (args, credentials, command) {
  const serviceName = args[3]
  const provider = args[4]
  const slsArgs = prepareSlsArgs(args)
  this.serviceName = serviceName
  this.provider = provider
  this.slsArgs = slsArgs

  if (typeof provider === 'undefined' || typeof serviceName === 'undefined') {
    command.printMessage('Usage: node bin/scepter ' + invokeServiceCommand.usage)
    return
  }

  invokeServiceCommand.serverlessCommand(command)
}

function serverlessFunction (command) {
  const invocationCommandString = `cd ./services/${invokeServiceCommand.serviceName}; yarn build${invokeServiceCommand.provider}; cd ./build; cp ../*.js ./build; yarn sls invoke ${invokeServiceCommand.slsArgs}`
  let execCommand = ''
  let shell = typeof command.parameters !== 'undefined' ? command.parameters.shell : ''
  switch (shell) {
    case 'powershell':
      execCommand = `if($?) {${invocationCommandString}}`
      break
    default:
      execCommand = invocationCommandString
  }

  command.executeCommand(
    execCommand,
    'Invocation Complete',
    'Invocation encountered one or more errors'
  )
}

module.exports = invokeServiceCommand
