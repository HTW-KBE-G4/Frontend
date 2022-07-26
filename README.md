# Tanuki Hardware Store (tanuki-hardware-store)

_A Hardware Store Simulation_

## Install the dependencies

```
npm install
```

### Create an .env file and change the API and PORT variables to your desired API endpoint and port the app should run on

```
-> See .env.example in the root directory
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```
quasar dev
```

OR

```
npx quasar dev
```

# Testing

### Run Cypress integration tests with following commands

```
quasar test --e2e Cypress
```

OR

```
npx cypress verify
npx quasar test --e2e Cypress
```

# For production only

### Lint the files

```
npm run lint
```

### Format the files

```
npm run format
```

### Build the app for production

```
quasar build
```

OR

```
npx quasar build
```

### If needed customize the configuration:

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).
