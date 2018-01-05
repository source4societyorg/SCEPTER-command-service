'use strict'

const createServiceCommand = {
  command: 'service:create',
  usage: 'service:create <service name> <target-repository> <[template]>',
  description: 'Creates a new service in the service directory from an existing repository -- optionally forks it from another repository',
  callback: callbackFunction,
  serverlessCommand: serverlessFunction,
  gitCommand: gitCommandFunction
}

function callbackFunction (args, credentials, command) {
  const serviceName = args[3]
  const targetRepository = args[4]
  const template = args[5] || 'aws-nodejs'

  this.serviceName = serviceName
  this.targetRepository = targetRepository
  this.template = template

  if (typeof serviceName === 'undefined' || typeof targetRepository === 'undefined') {
    command.printMessage('Usage: node bin/scepter ' + createServiceCommand.usage)
    return
  }

  createServiceCommand.serverlessCommand(command)
}

function serverlessFunction (command) {
  let execCommand = 'cd services; yarn sls create'
  execCommand += ' --template ' + createServiceCommand.template
  execCommand += ' --path services/' + createServiceCommand.serviceName

  command.executeCommand(
    execCommand,
    'Successfully generated service configuration',
    'Failed to generate service configuration',
    createServiceCommand.gitCommand
  )
}

function gitCommandFunction (command) {
  let powershellModifier = ''
  let simlinkCommand = 'ln -s ../../config/credentials.json ./credentials.json'
  let shell = typeof command.parameters !== 'undefined' ? command.parameters.shell : ''
  switch (shell) {
    case 'powershell':
      powershellModifier = 'o'
      simlinkCommand = 'cmd /c mklink credentials.json ..\\..\\config\\credentials.json'
  }
  const execCommand = 'cd services/' + createServiceCommand.serviceName + '; git init; ' + simlinkCommand + '; git remote add origin ' + createServiceCommand.targetRepository + '; cd ../; git push origin master; rm -r -f' + powershellModifier + ' ' + createServiceCommand.serviceName + '; git submodule add ' + createServiceCommand.targetRepository + ' ' + createServiceCommand.serviceName
  command.executeCommand(
    execCommand,
    'Created new service',
    'Failed to create new service'
  )
}

module.exports = createServiceCommand
