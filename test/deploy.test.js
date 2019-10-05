const deployServiceCommand = require('../deploy.js')
const immutable = require('immutable')

const mockCredentials = immutable.fromJS({
  environments: {
    development: {
      provider: {
        testprovider: {
          region: 'mockRegion'
        }
      }
    }
  }
})

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
    expect(deployServiceCommand.slsArgs).toEqual('extra ')
    done()
  }

  const command = {
    executeCommand: mockExecuteCommand
  }

  deployServiceCommand.callback(['node', 'path', 'something', 'servicename', 'provider', 'development', 'extra'], mockCredentials, command)
})

test('deployServiceCommand prints usage when servicename argument is not passed in', (done) => {
  const mockPrintMessage = (message) => {
    expect(message).toEqual('Usage: node bin/scepter ' + deployServiceCommand.usage)
    done()
  }

  const command = {
    printMessage: mockPrintMessage
  }

  deployServiceCommand.callback(['node', 'path', 'something', undefined, 'provider', '--stage', 'dev'], mockCredentials, command)
})

test('deployServiceCommand prints usage when provider argument is not passed in', (done) => {
  const mockPrintMessage = (message) => {
    expect(message).toEqual('Usage: node bin/scepter ' + deployServiceCommand.usage)
    done()
  }

  const command = {
    printMessage: mockPrintMessage
  }

  deployServiceCommand.callback(['node', 'path', 'something', 'servicename', undefined, 'development', 'extra'], mockCredentials, command)
})

test('deployServiceCommand prints usage when environment argument is not passed in', (done) => {
  const mockPrintMessage = (message) => {
    expect(message).toEqual('Usage: node bin/scepter ' + deployServiceCommand.usage)
    done()
  }

  const command = {
    printMessage: mockPrintMessage
  }

  deployServiceCommand.callback(['node', 'path', 'something', 'servicename', 'provider', undefined, 'extra'], mockCredentials, command)
})

test('deployServiceCommand executes different command for powershell', (done) => {
  const mockCommand = {
    parameters: { shell: 'powershell' },
    executeCommand: (command, successMessage, errorMessage) => {
      expect(command).toEqual('yarn scepter cloud:configure development testprovider; if($?) { cd ./services/servicename; yarn buildtestprovider; cp ../*.js ./build }; if($?) { cp ../../config/*.json ./build/ }; if($?) { cd ./build; yarn sls deploy extra --stage=development --region=mockRegion }')
      expect(successMessage.length).toBeGreaterThan(0)
      expect(errorMessage.length).toBeGreaterThan(0)
      done()
    }
  }
  deployServiceCommand.callback(['node', 'path', 'something', 'servicename', 'testprovider', 'development', 'extra'], mockCredentials, mockCommand)
})
