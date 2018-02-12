# SCEPTER-command-service
SCEPTER plugin command to manage project services

[![scepter-logo](http://res.cloudinary.com/source-4-society/image/upload/v1514622047/scepter_hzpcqt.png)](https://github.com/source4societyorg/SCEPTER-core)

[![js-standard-style](https://cdn.rawgit.com/standard/standard/master/badge.svg)](http://standardjs.com)

[![Build Status](https://travis-ci.org/source4societyorg/SCEPTER-command-service.svg?branch=master)](https://travis-ci.org/source4societyorg/SCEPTER-command-service)

[![codecov](https://codecov.io/gh/source4societyorg/SCEPTER-command-service/branch/master/graph/badge.svg)](https://codecov.io/gh/source4societyorg/SCEPTER-command-service)

[![Serverless](http://public.serverless.com/badges/v1.svg)](http://serverless.com)

# Installation

1. Setup a SCEPTER project by following the instructions from [SCEPTER-Core](https://github.com/source4societyorg/SCEPTER-core).
2. Be sure to recursively install the SCEPTER-Core boilerplates submodules. You can do this by cloning SCEPTER-Core with the --recursive flag or by issuing the `git submodule update --init` command from the project directory.
3. Execute `node bin/scepter.js list:all` to display a list of installed commands to verify this command has been installed.

# Commands

`service:create <service-name> <target-repository> [<template>]`

This command will create a new service using the Serverless Framework by forking the associated template repository. `[<template>]` defaults to `nodejs` and will create a new service using [SCEPTER-service-template-nodejs](https://github.com/source4societyorg/SCEPTER-service-template-nodejs). Other acceptable arguments for `[<template>]` include `csharp`. The `service-name` will determine what folder under the `services` folder the submodule will be created in and modify the configuration to name the service accordingly when deployed to cloud service providers. The `target-repository` is the URL of the repository that the new service will be pushed to. 

To add an existing service, see the `service:add` command.

`service:add <service-name> <git-repository> [<fork-repository>]`

This command will add the service from the uri provided by `git-repository` as a submodule to the project in the `services` folder in a folder named after `service-name`. If a `fork-repository` uri is provided, the service will be forked into `git-repository` first before `git-repository` is added as a submodule to the project.

`service:invoke <service-name> <provider> [<optional sls arguments>]`

This command is for services that have multiple serverless.yml configurations for various providers defined (Otherwise use `serverless invoke` instead). The serverless.yml for each provider should be defined in a folder named `config` within the service folder. Each file should be named `serverless_template_<provider>.yml` with the name of the provider substituted in. Running this command will swap out the base serverless.yml file with the template of the specified provider so that a service can be invoked with that particular configuration. The optional sls arguments would be the same as those passed in to the `serverless invoke` command [like this one](https://serverless.com/framework/docs/providers/aws/cli-reference/invoke/).

`service:deploy <service-name> <provider> [<optional sls arguments>]`

This command is for services that have multiple serverless.yml configurations for various providers defined (Otherwise use `serverless deploy` instead). The serverless.yml for each provider should be defined in a folder named `config` within the service folder. Each file should be named `serverless_template_<provider>.yml` with the name of the provider substituted in. Running this command will swap out the base serverless.yml file with the template of the specified provider so that a service can be deployed across multiple providers with a single command. It will also run `yarn install` and `yarn test` commands and will only deploy if successful error code is returnd