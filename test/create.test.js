const createServiceCommand = require('../create.js')

test('createServiceCommand has the correct command property', () => {
  expect(createServiceCommand.command).toEqual('service:create')
})

test('createServiceCommand has a usage property defined', () => {
  expect(typeof createServiceCommand.usage).toBe('string')
  expect(createServiceCommand.usage.length).toBeGreaterThan(0)
})

test('createServiceCommand has callback which sets up and kicks off command execution', (done) => {
  const mockExecuteCommand = (commandString, successMessage, errorMessage, nextFunctionCall) => {
    expect(successMessage.length).toBeGreaterThan(0)
    expect(errorMessage.length).toBeGreaterThan(0)
    expect(createServiceCommand.serviceName).toEqual('servicename')
    expect(createServiceCommand.gitRepository).toEqual('gitrepository')
    expect(createServiceCommand.forkRepository).toEqual('git@github.com:source4societyorg/SCEPTER-service-template.git')
    done()
  }

  const command = {
    executeCommand: mockExecuteCommand
  }

  createServiceCommand.callback(['node', 'path', 'something', 'servicename', 'gitrepository'], null, command)
})

test('createServiceCommand forks service from scepter service template', (done) => {
  const mockExecuteCommand = (commandString, successMessage, errorMessage, nextFunctionCall) => {
    expect(commandString).toEqual('cd services; git clone git@github.com:source4societyorg/SCEPTER-service-template.git servicename; cd servicename; git remote rm origin; git remote add origin gitrepository; git push -f origin master; cd ../; rm -r -f servicename; git submodule add gitrepository servicename')
    expect(successMessage.length).toBeGreaterThan(0)
    expect(errorMessage.length).toBeGreaterThan(0)
    done()
  }

  const command = {
    executeCommand: mockExecuteCommand
  }

  createServiceCommand.callback(['node', 'path', 'something', 'servicename', 'gitrepository'], null, command)
})

test('createServiceCommand modifies command for powershell', (done) => {
  const mockExecuteCommand = (commandString, successMessage, errorMessage, nextFunctionCall) => {
    expect(commandString).toEqual('cd services; git clone git@github.com:source4societyorg/SCEPTER-service-template.git servicename; cd servicename; git remote rm origin; git remote add origin gitrepository; git push -f origin master; cd ../; rm -r -fo servicename; git submodule add gitrepository servicename')
    expect(successMessage.length).toBeGreaterThan(0)
    expect(errorMessage.length).toBeGreaterThan(0)
    done()
  }

  const command = {
    executeCommand: mockExecuteCommand,
    parameters: { shell: 'powershell' }
  }

  createServiceCommand.callback(['node', 'path', 'something', 'servicename', 'gitrepository'], null, command)
})

test('createServiceCommand prints usage when service-name argument is not passed in', (done) => {
  const mockPrintMessage = (message) => {
    expect(message).toEqual('Usage: node bin/scepter ' + createServiceCommand.usage)
    done()
  }

  const command = {
    printMessage: mockPrintMessage
  }

  createServiceCommand.callback(['node', 'path', 'something', undefined, 'git-repository', 'target-repository'], null, command)
})

test('createServiceCommand prints usage when git-repository argument is not passed in', (done) => {
  const mockPrintMessage = (message) => {
    expect(message).toEqual('Usage: node bin/scepter ' + createServiceCommand.usage)
    done()
  }

  const command = {
    printMessage: mockPrintMessage
  }

  createServiceCommand.callback(['node', 'path', 'something', 'servicename', undefined, 'target-repository'], null, command)
})

test('initializeServiceFunction executes correct command', (done) => {
  const mockCommand = {
    executeCommand: (command, successMessage, errorMessage) => {
      expect(command).toEqual('cd services/test; node config/initialize.js')
      expect(successMessage.length).toBeGreaterThan(0)
      expect(errorMessage.length).toBeGreaterThan(0)
      done()
    }
  }
  createServiceCommand.serviceName = 'test'
  createServiceCommand.initializeService(mockCommand)
})
