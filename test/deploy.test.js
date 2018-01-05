const deployServiceCommand = require('../deploy.js')

test('deployServiceCommand has the correct command property', () => {
  expect(deployServiceCommand.command).toEqual('service:deploy')
})

test('deployServiceCommand has a usage property defined', () => {
  expect(typeof deployServiceCommand.usage).toBe('string')
  expect(deployServiceCommand.usage.length).toBeGreaterThan(0)
})

test('deployServiceCommand has callback which sets up and kicks off command execution', (done) => {
  const mockExecuteCommand = (commandString, successMessage, errorMessage, nextFunctionCall) => {
    expect(successMessage.length).toBeGreaterThan(0)
    expect(errorMessage.length).toBeGreaterThan(0)
    expect(nextFunctionCall).toBeUndefined()
    expect(deployServiceCommand.serviceName).toEqual('servicename')
    expect(deployServiceCommand.provider).toEqual('provider')
    expect(deployServiceCommand.slsArgs).toEqual('--stage dev ')
    done()
  }

  const command = {
    executeCommand: mockExecuteCommand
  }

  deployServiceCommand.callback(['node', 'path', 'something', 'servicename', 'provider', '--stage', 'dev'], null, command)
})

test('deployServiceCommand prints usage when servicename argument is not passed in', (done) => {
  const mockPrintMessage = (message) => {
    expect(message).toEqual('Usage: node bin/scepter ' + deployServiceCommand.usage)
    done()
  }

  const command = {
    printMessage: mockPrintMessage
  }

  deployServiceCommand.callback(['node', 'path', 'something', undefined, 'provider', '--stage', 'dev'], null, command)
})

test('deployServiceCommand prints usage when provider argument is not passed in', (done) => {
  const mockPrintMessage = (message) => {
    expect(message).toEqual('Usage: node bin/scepter ' + deployServiceCommand.usage)
    done()
  }

  const command = {
    printMessage: mockPrintMessage
  }

  deployServiceCommand.callback(['node', 'path', 'something', 'servicename', undefined, 'invoke', '--stage', 'dev'], null, command)
})
