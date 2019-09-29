const invokeServiceCommand = require('../invoke.js')

test('invokeServiceCommand has the correct command property', () => {
  expect(invokeServiceCommand.command).toEqual('service:invoke')
})

test('invokeServiceCommand has a usage property defined', () => {
  expect(typeof invokeServiceCommand.usage).toBe('string')
  expect(invokeServiceCommand.usage.length).toBeGreaterThan(0)
})

test('invokeServiceCommand has callback which sets up and kicks off command execution', (done) => {
  const mockExecuteCommand = (commandString, successMessage, errorMessage, nextFunctionCall) => {
    expect(successMessage.length).toBeGreaterThan(0)
    expect(errorMessage.length).toBeGreaterThan(0)
    expect(nextFunctionCall).toBeUndefined()
    expect(invokeServiceCommand.serviceName).toEqual('servicename')
    expect(invokeServiceCommand.provider).toEqual('provider')
    expect(invokeServiceCommand.slsArgs).toEqual('invoke local -f somefunc ')
    done()
  }

  const command = {
    executeCommand: mockExecuteCommand
  }

  invokeServiceCommand.callback(['node', 'path', 'something', 'servicename', 'provider', 'invoke', 'local', '-f', 'somefunc'], null, command)
})

test('invokeServiceCommand prints usage when servicename argument is not passed in', (done) => {
  const mockPrintMessage = (message) => {
    expect(message).toEqual('Usage: node bin/scepter ' + invokeServiceCommand.usage)
    done()
  }

  const command = {
    printMessage: mockPrintMessage
  }

  invokeServiceCommand.callback(['node', 'path', 'something', undefined, 'provider', 'invoke', 'local', '-f', 'somefunc'], null, command)
})

test('invokeServiceCommand prints usage when provider argument is not passed in', (done) => {
  const mockPrintMessage = (message) => {
    expect(message).toEqual('Usage: node bin/scepter ' + invokeServiceCommand.usage)
    done()
  }

  const command = {
    printMessage: mockPrintMessage
  }

  invokeServiceCommand.callback(['node', 'path', 'something', 'servicename', undefined, 'invoke', 'local', '-f', 'somefunc'], null, command)
})

test('invokeServiceCommand executes different command for powershell', (done) => {
  const mockCommand = {
    parameters: { shell: 'powershell' },
    executeCommand: (command, successMessage, errorMessage) => {
      expect(command).toEqual('if($?) {cd ./services/servicename; yarn buildundefined; cd ./build; yarn sls invoke invoke local -f somefunc }')
      expect(successMessage.length).toBeGreaterThan(0)
      expect(errorMessage.length).toBeGreaterThan(0)
      done()
    }
  }
  invokeServiceCommand.serverlessCommand(mockCommand)
})
