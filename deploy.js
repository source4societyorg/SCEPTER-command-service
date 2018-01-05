'use strict'

const deployServiceCommand = {
  command: 'service:deploy',
  usage: 'service:deploy <service-name> <provider> <[optional serverless deploy command args]>',
  description: 'Deploys the service using the specified provider configuration',
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
    command.printMessage('Usage: node bin/scepter ' + deployServiceCommand.usage)
    return
  }

  deployServiceCommand.serverlessCommand(command)
}

function serverlessFunction (command) {
  let execCommand = 'cp ./services/' + deployServiceCommand.serviceName + '/config/serverless_template_' + deployServiceCommand.provider + '.yml ./services/' + deployServiceCommand.serviceName + '/serverless.yml && cd ./services/' + deployServiceCommand.serviceName + ' && yarn sls deploy ' + deployServiceCommand.slsArgs

  command.executeCommand(
    execCommand,
    'Deployment to ' + this.provider + ' completed successfully',
    'Deployment to ' + this.provider + ' encountered one or more errors'
  )
}

module.exports = deployServiceCommand
