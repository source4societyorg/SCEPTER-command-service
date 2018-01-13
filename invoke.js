'use strict'

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

  let slsArgs = ''
  if (args.length > 5) {
    for (let i = 5; i < args.length; i++) {
      slsArgs += args[i] + ' '
    }
  }

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
  const copyTemplateCommandString = 'cp ./services/' + invokeServiceCommand.serviceName + '/config/serverless_template_' + invokeServiceCommand.provider + '.yml ./services/' + invokeServiceCommand.serviceName + '/serverless.yml'
  const copyConfigurationCommandString = 'cp ./config/*.json ./services/' + invokeServiceCommand.serviceName + '/'
  const invocationCommandString = 'cd ./services/' + invokeServiceCommand.serviceName + '; ' + 'yarn sls invoke ' + invokeServiceCommand.slsArgs
  let execCommand = ''
  let shell = typeof command.parameters !== 'undefined' ? command.parameters.shell : ''
  switch (shell) {
    case 'powershell':
      execCommand = copyTemplateCommandString + '; if($?) { ' + copyConfigurationCommandString + ' }; if($?) { ' + invocationCommandString + '}'
      break
    default:
      execCommand = copyTemplateCommandString + ' && ' + copyConfigurationCommandString + ' && ' + invocationCommandString
  }

  command.executeCommand(
    execCommand,
    'Invocation Complete',
    'Invocation encountered one or more errors'
  )
}

module.exports = invokeServiceCommand
