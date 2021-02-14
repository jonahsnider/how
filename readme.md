# How

[![Build Status](https://github.com/pizzafox/how/workflows/CI/badge.svg)](https://github.com/pizzafox/how/actions)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/xojs/xo)

Learn how to use CLI apps.

## Usage

Install using your favorite Node.js package manager:

```sh
npm i -g @pizzafox/how
yarn global add @pizzafox/how
pnpm i -g add @pizzafox/how
```

You can also use `npx` when in a pinch, but a global install is preferred:

```sh
npx @pizzafox/how <app>
pnpx @pizzafox/how <app>
```

A common-ish CPU & OS as well as a recent version of Node.js (something that can run modules natively) are required to run how.
Your package manager should prevent you from installing how if your system is incompatible.

```sh
how <app>
```

### Example

Learn how to use `tar`:

```sh
how tar
```

## Contributing

### Prequisites

This project uses [Node.js](https://nodejs.org) to run, so make sure you've got a recent version installed.

This project uses [Yarn](https://yarnpkg.com) 2 to manage dependencies and run scripts.
After cloning the repository you can use this command to install dependencies:

```sh
yarn
```

### Building

Run the `build` script to compile the TypeScript source code into JavaScript in the `tsc_output` folder.

### Style

This project uses [Prettier](https://prettier.io) to validate the formatting and style across the codebase.

You can run Prettier in the project with this command:

```sh
yarn run style
```

### Linting

There is intentionally no lint script.
Contributors are expected to write flawless code.

### Testing

There are no unit tests for the same reason there is no lint script.
