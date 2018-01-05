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
    expect(typeof nextFunctionCall).toEqual('function')
    expect(createServiceCommand.serviceName).toEqual('servicename')
    expect(createServiceCommand.template).toEqual('template')
    expect(createServiceCommand.targetRepository).toEqual('targetrepository')
    done()
  }

  const command = {
    executeCommand: mockExecuteCommand
  }

  createServiceCommand.callback(['node', 'path', 'something', 'servicename', 'targetrepository', 'template'], null, command)
})

test('createServiceCommand executes commands in sequence', (done) => {
  function * testCommandsInSequence () {
    while (true) {
      let commandArguments = yield 'serverlessCommandArgument'
      expect(commandArguments[0]).toEqual('cd services; yarn sls create --template template --path services/servicename')
      expect(commandArguments[1].length).toBeGreaterThan(0)
      expect(commandArguments[2].length).toBeGreaterThan(0)
      expect(commandArguments[3].name).toEqual('gitCommandFunction')

      commandArguments = yield 'gitCommandArguments'
      expect(commandArguments[0]).toEqual('cd services/servicename; git init; git add .; git commit -m \'Initial commit\'; git remote add origin targetrepository; git push -f origin master; ln -s ../../config/credentials.json ./credentials.json; cd ../; rm -r -f servicename; git submodule add --force targetrepository servicename')
      expect(commandArguments[1].length).toBeGreaterThan(0)
      expect(commandArguments[2].length).toBeGreaterThan(0)
      expect(commandArguments[3]).toBeUndefined()

      return
    }
  }

  const mockExecuteCommand = (commandString, successMessage, errorMessage, nextFunctionCall) => {
    testGenerator.next([commandString, successMessage, errorMessage, nextFunctionCall])
    if (typeof nextFunctionCall !== 'undefined') {
      nextFunctionCall(command)
    } else {
      done()
    }
  }

  const command = {
    executeCommand: mockExecuteCommand
  }

  const testGenerator = testCommandsInSequence()
  testGenerator.next() // Initialize generator to first yield
  createServiceCommand.callback(['node', 'path', 'something', 'servicename', 'targetrepository', 'template'], null, command)
})

test('createServiceCommand prints usage when servicename argument is not passed in', (done) => {
  const mockPrintMessage = (message) => {
    expect(message).toEqual('Usage: node bin/scepter ' + createServiceCommand.usage)
    done()
  }

  const command = {
    printMessage: mockPrintMessage
  }

  createServiceCommand.callback(['node', 'path', 'something', undefined, 'targetrepository', 'template'], null, command)
})

test('createServiceCommand adjusts for powershell', (done) => {
  function * testCommandsInSequence () {
    while (true) {
      let commandArguments = yield 'serverlessCommandArgument'
      expect(commandArguments[0]).toEqual('cd services; yarn sls create --template template --path services/servicename')
      expect(commandArguments[1].length).toBeGreaterThan(0)
      expect(commandArguments[2].length).toBeGreaterThan(0)
      expect(commandArguments[3].name).toEqual('gitCommandFunction')

      commandArguments = yield 'gitCommandArguments'
      expect(commandArguments[0]).toEqual('cd services/servicename; git init; git add .; git commit -m \'Initial commit\'; git remote add origin targetrepository; git push -f origin master; cmd /c mklink credentials.json ..\\..\\config\\credentials.json; cd ../; rm -r -fo servicename; git submodule add --force targetrepository servicename')
      return
    }
  }

  const mockExecuteCommand = (commandString, successMessage, errorMessage, nextFunctionCall) => {
    testGenerator.next([commandString, successMessage, errorMessage, nextFunctionCall])
    if (typeof nextFunctionCall !== 'undefined') {
      nextFunctionCall(command)
    } else {
      done()
    }
  }

  const command = {
    executeCommand: mockExecuteCommand,
    parameters: { shell: 'powershell' }
  }

  const testGenerator = testCommandsInSequence()
  testGenerator.next() // Initialize generator to first yield
  createServiceCommand.callback(['node', 'path', 'something', 'servicename', 'targetrepository', 'template'], null, command)
})

test('createServiceCommand prints usage when target-repository argument is not passed in', (done) => {
  const mockPrintMessage = (message) => {
    expect(message).toEqual('Usage: node bin/scepter ' + createServiceCommand.usage)
    done()
  }

  const command = {
    printMessage: mockPrintMessage
  }

  createServiceCommand.callback(['node', 'path', 'something', 'servicename', undefined, 'template'], null, command)
})

test('createServiceCommand template defaults to aws-nodejs when argument is not passed in', (done) => {
  const mockExecuteCommand = () => {
    expect(createServiceCommand.template).toEqual('aws-nodejs')
    done()
  }

  const command = {
    executeCommand: mockExecuteCommand
  }

  createServiceCommand.callback(['node', 'path', 'something', 'servicename', 'targetrepository', undefined], null, command)
})
