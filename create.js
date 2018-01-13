'use strict'
const createServiceCommand = {
  command: 'service:create',
  usage: 'service:create <service-name> <git-repository>',
  description: 'Use this to create a new service for your project as a submodule form the base SCEPTER template',
  callback: function (args, credentials, command) {
    const serviceName = args[3]
    const gitRepository = args[4]
    const forkRepository = "git@github.com:source4societyorg/SCEPTER-service-template.git"

    this.serviceName = serviceName
    this.gitRepository = gitRepository
    this.forkRepository = forkRepository

    if (typeof serviceName === 'undefined' || typeof gitRepository === 'undefined') {
      command.printMessage('Usage: node bin/scepter ' + createServiceCommand.usage)
      return
    }

    createServiceCommand.forkCommand(command)
  },
  forkCommand: forkFunction,
  initializeService: initializeServiceFunction
}

function forkFunction (command) {
  let commandString = ''
  let shell = typeof command.parameters !== 'undefined' ? command.parameters.shell : ''
  switch (shell) {
    case 'powershell':
      commandString = 'o'
  }
  command.executeCommand(
    'cd services; git clone ' + createServiceCommand.forkRepository + ' ' + createServiceCommand.serviceName + '; cd ' + createServiceCommand.serviceName + '; git remote rm origin; git remote add origin ' + createServiceCommand.gitRepository + '; git push origin master; cd ../; rm -r -f' + commandString + ' ' + createServiceCommand.serviceName + '; git submodule add ' + createServiceCommand.gitRepository + ' ' + createServiceCommand.serviceName,
    'Successfully forked service template and added it to project',
    'Failed to fork service template repository',
    createServiceCommand.initializeService
  )
}

function initializeServiceFunction (command) {
  let commandString = ''
  let shell = typeof command.parameters !== 'undefined' ? command.parameters.shell : ''
  switch (shell) {
    case 'powershell':
      commandString = 'o'
  }
  command.executeCommand(
    'cd services/' + createServiceCommand.serviceName + '; node config/initialize.js',
    'Successfully created service',
    'Failed to execute initialization script'
  )
}

module.exports = createServiceCommand
