# Dock Bank
This api is responsible for managing and performing banking actions on customer accounts.

## Requirements

- git
- yarn 1.22.10+
- docker 20.10.8+
- docker-compose 1.25.0+

## How to run

Ensure you are in the project's root directory

Run the application, generate dependencies and start mysql
```sh
 ./scripts/development.sh
```

Run unit tests
```sh
 ./scripts/unit-tests.sh
```

Run integration tests
```sh
 ./scripts/unit-tests.sh
```

install all dependencies
```sh
 ./scripts/install-dep.sh "yarn"
```

install only one
```sh
 ./scripts/install-dep.sh "yarn i <dependency-name>"
```

# Doc

In the `docs` folder you will find an insomina collection, with an example for all the application routes.

Note: import in insomia as json

## Project structure

```
├── scripts
├── src
│   └── app
│       ├── api
│       │   ├── helpers
│       │   ├── middlewares
│       │   └── routes
│       ├── infra
│       │   ├── modules
│       │   └── repositories
│       ├── models
│       └── services
│           ├── errors
│           └── protocols
└── tests
    ├── integration
    │   └── account
    └── unit
        └── services
```
---
### Folders description

**scripts**: Contains automation scripts to assist in development

**src**: Application and serve source code

**src/app**: Contains application code

**src/app/api/**: 

**src/app/api/helpers**: Helper files and functions for initial API setup
**src/app/api/middleware**: Contains the application middleware
**src/app/api/routes**: Contains application routes

**src/app/infra**: The outermost layer of code, usually where things are coupled with libs and third-party interfaces

**src/app/infra/modules**: Contains third-party lib wrappers, which expose a more stable interface to the app.
**src/app/infra/repositories**: Responsible for communication with external data source, be it persistence or api

**src/app/models**: Data model of the entities present in the application

**src/app/service**: Expert services who know about business rules. importantly, this layer shouldn't know anything about http

**tests**: contain the test source code
___

### Read the technical debits section
debitos.md