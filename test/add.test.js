const addServiceCommand = require('../add.js')

test('addServiceCommand has the correct command property', () => {
  expect(addServiceCommand.command).toEqual('service:add')
})

test('addServiceCommand has a usage property defined', () => {
  expect(typeof addServiceCommand.usage).toBe('string')
  expect(addServiceCommand.usage.length).toBeGreaterThan(0)
})

test('addServiceCommand has callback which sets up and kicks off command execution', (done) => {
  const mockExecuteCommand = (commandString, successMessage, errorMessage, nextFunctionCall) => {
    expect(successMessage.length).toBeGreaterThan(0)
    expect(errorMessage.length).toBeGreaterThan(0)
    expect(addServiceCommand.serviceName).toEqual('servicename')
    expect(addServiceCommand.gitRepository).toEqual('gitrepository')
    expect(addServiceCommand.forkRepository).toEqual('forkrepository')
    done()
  }

  const command = {
    executeCommand: mockExecuteCommand
  }

  addServiceCommand.callback(['node', 'path', 'something', 'servicename', 'gitrepository', 'forkrepository'], null, command)
})

test('addServiceCommand forks service when fork-repository argument is provided', (done) => {
  const mockExecuteCommand = (commandString, successMessage, errorMessage, nextFunctionCall) => {
    expect(commandString).toEqual('cd services; git clone forkrepository servicename; cd servicename; git remote rm origin; git remote add origin gitrepository; git push origin master; cd ../; rm -r -f servicename; git submodule add gitrepository servicename')
    expect(successMessage.length).toBeGreaterThan(0)
    expect(errorMessage.length).toBeGreaterThan(0)
    done()
  }

  const command = {
    executeCommand: mockExecuteCommand
  }

  addServiceCommand.callback(['node', 'path', 'something', 'servicename', 'gitrepository', 'forkrepository'], null, command)
})

test('addServiceCommand modifies command for powershell', (done) => {
  const mockExecuteCommand = (commandString, successMessage, errorMessage, nextFunctionCall) => {
    expect(commandString).toEqual('cd services; git clone forkrepository servicename; cd servicename; git remote rm origin; git remote add origin gitrepository; git push origin master; cd ../; rm -r -fo servicename; git submodule add gitrepository servicename')
    expect(successMessage.length).toBeGreaterThan(0)
    expect(errorMessage.length).toBeGreaterThan(0)
    done()
  }

  const command = {
    executeCommand: mockExecuteCommand,
    parameters: { shell: 'powershell' }
  }

  addServiceCommand.callback(['node', 'path', 'something', 'servicename', 'gitrepository', 'forkrepository'], null, command)
})

test('addServiceCommand adds service as submodule directly from repo when fork-service argument is not provided', (done) => {
  const mockExecuteCommand = (commandString, successMessage, errorMessage, nextFunctionCall) => {
    expect(commandString).toEqual('cd services; git submodule add gitrepository servicename')
    expect(successMessage.length).toBeGreaterThan(0)
    expect(errorMessage.length).toBeGreaterThan(0)
    done()
  }

  const command = {
    executeCommand: mockExecuteCommand
  }

  addServiceCommand.callback(['node', 'path', 'something', 'servicename', 'gitrepository', undefined], null, command)
})

test('addServiceCommand prints usage when service-name argument is not passed in', (done) => {
  const mockPrintMessage = (message) => {
    expect(message).toEqual('Usage: node bin/scepter ' + addServiceCommand.usage)
    done()
  }

  const command = {
    printMessage: mockPrintMessage
  }

  addServiceCommand.callback(['node', 'path', 'something', undefined, 'git-repository', 'target-repository'], null, command)
})

test('addServiceCommand prints usage when git-repository argument is not passed in', (done) => {
  const mockPrintMessage = (message) => {
    expect(message).toEqual('Usage: node bin/scepter ' + addServiceCommand.usage)
    done()
  }

  const command = {
    printMessage: mockPrintMessage
  }

  addServiceCommand.callback(['node', 'path', 'something', 'servicename', undefined, 'target-repository'], null, command)
})
