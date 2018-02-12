'use strict'
const createServiceCommand = {
  command: 'service:create',
  usage: 'service:create <service-name> <git-repository> [<template>]',
  description: 'Use this to create a new service for your project as a submodule form the base SCEPTER template',
  callback: function (args, credentials, command) {
    const serviceName = args[3]
    const gitRepository = args[4]
    const template = args[5] || 'nodejs'
    let forkRepository = 'git@github.com:source4societyorg/SCEPTER-service-template-'
    forkRepository = createServiceCommand.processOptions(template, forkRepository)

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
  initializeService: initializeServiceFunction,
  processOptions: processOptionsFunction
}

function processOptionsFunction (template, forkRepository) {
  switch (template) {
    case 'csharp':
    case 'nodejs':
      forkRepository += template
      break
    default:
      forkRepository = template
  }
  return forkRepository
}

function forkFunction (command) {
  let commandString = ''
  let shell = typeof command.parameters !== 'undefined' ? command.parameters.shell : ''
  switch (shell) {
    case 'powershell':
      commandString = 'o'
  }
  command.executeCommand(
    'cd services; git clone ' + createServiceCommand.forkRepository + ' ' + createServiceCommand.serviceName + '; cd ' + createServiceCommand.serviceName + '; git remote rm origin; git remote add origin ' + createServiceCommand.gitRepository + '; git push -f origin master; cd ../; rm -r -f' + commandString + ' ' + createServiceCommand.serviceName + '; git submodule add ' + createServiceCommand.gitRepository + ' ' + createServiceCommand.serviceName,
    'Successfully forked service template and added it to project',
    'Failed to fork service template repository',
    createServiceCommand.initializeService
  )
}

function initializeServiceFunction (command) {
  /* eslint-disable no-template-curly-in-string */
  command.executeCommand(
    'cd services/' + createServiceCommand.serviceName + '; yarn install; echo \'service: ${file(./parameters.json):appName}-' + createServiceCommand.serviceName + '\' > ./config/service_name.yml; node config/initialize.js',
    'Successfully created service',
    'Failed to execute initialization script'
  )
  /* eslint-enable no-template-curly-in-string */
}

module.exports = createServiceCommand
