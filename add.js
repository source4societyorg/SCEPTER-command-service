'use strict'
const addServiceCommand = {
  command: 'service:add',
  usage: 'service:add <service-name> <git-repository> [<fork-repository>]',
  description: 'Use this to add an existing service to your project as a submodule',
  callback: function (args, credentials, command) {
    const serviceName = args[3]
    const gitRepository = args[4]
    const forkRepository = args[5]

    this.serviceName = serviceName
    this.gitRepository = gitRepository
    this.forkRepository = forkRepository

    if (typeof serviceName === 'undefined' || typeof gitRepository === 'undefined') {
      command.printMessage('Usage: node bin/scepter ' + addServiceCommand.usage)
      return
    }

    if (typeof forkRepository === 'undefined') {
      addServiceCommand.submoduleCommand(command)
    } else {
      addServiceCommand.forkCommand(command)
    }
  },
  forkCommand: forkFunction,
  submoduleCommand: submoduleFunction
}

function forkFunction (command) {
  let commandString = ''
  let shell = typeof command.parameters !== 'undefined' ? command.parameters.shell : ''
  switch (shell) {
    case 'powershell':
      commandString = 'o'
  }
  command.executeCommand(
    'cd services; git clone ' + addServiceCommand.forkRepository + ' ' + addServiceCommand.serviceName + '; cd ' + addServiceCommand.serviceName + '; git remote rm origin; git remote add origin ' + addServiceCommand.gitRepository + '; git push origin master; cd ../; rm -r -f' + commandString + ' ' + addServiceCommand.serviceName + '; git submodule add ' + addServiceCommand.gitRepository + ' ' + addServiceCommand.serviceName,
    'Successfully forked service and added it to project',
    'Failed to fork service repository'
  )
}

function submoduleFunction (command) {
  command.executeCommand(
    'cd services; git submodule add ' + addServiceCommand.gitRepository + ' ' + addServiceCommand.serviceName,
    'Successfully added service to project',
    'Failed to add service to project'
  )
}

module.exports = addServiceCommand
