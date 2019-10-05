'use strict'
const prepareSlsArgs = require('./common').prepareSlsArgs
const utilities = require('@source4society/scepter-utility-lib')

const deployServiceCommand = {
  command: 'service:deploy',
  usage: 'service:deploy <service-name> <provider> <env> <[optional serverless deploy command args]>',
  description: 'Deploys the service using the specified provider configuration',
  callback: callbackFunction,
  serverlessCommand: serverlessFunction
}

function callbackFunction (args, credentials, command) {
  const serviceName = args[3]
  const provider = args[4]
  const environment = args[5]
  const slsArgs = prepareSlsArgs(args, 6)
  this.serviceName = serviceName
  this.provider = provider
  this.slsArgs = slsArgs
  this.environment = environment
  this.region = credentials.getIn(['environments', this.environment, 'provider', this.provider, 'region'])

  if (utilities.isEmpty(provider) || utilities.isEmpty(serviceName) || utilities.isEmpty(environment)) {
    command.printMessage('Usage: node bin/scepter ' + deployServiceCommand.usage)
    return
  }

  deployServiceCommand.serverlessCommand(command)
}

function serverlessFunction (command) {
  const scepterCloudConfigure = `yarn scepter cloud:configure ${deployServiceCommand.environment} ${deployServiceCommand.provider}`
  const scepterServiceBuild = `cd ./services/${deployServiceCommand.serviceName}; yarn build${deployServiceCommand.provider}; cp ../*.js ./build`
  const copyCredentialsCommandString = `cp ../../config/*.json ./build/`
  const serverlessDeploy = `cd ./build; yarn sls deploy ${deployServiceCommand.slsArgs}--stage=${deployServiceCommand.environment} --region=${deployServiceCommand.region}`
  let execCommand = ''
  let shell = typeof command.parameters !== 'undefined' ? command.parameters.shell : ''
  switch (shell) {
    case 'powershell':
      execCommand = `${scepterCloudConfigure}; if($?) { ${scepterServiceBuild} }; if($?) { ${copyCredentialsCommandString} }; if($?) { ${serverlessDeploy} }`
      break
    default:
      execCommand = `${scepterCloudConfigure} && ${scepterServiceBuild} && ${copyCredentialsCommandString} && ${serverlessDeploy}`
  }

  command.executeCommand(
    execCommand,
    'Deployment to ' + this.provider + ' completed successfully',
    'Deployment to ' + this.provider + ' encountered one or more errors'
  )
}

module.exports = deployServiceCommand
