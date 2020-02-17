## [Code of Conduct](./.github/CODE_OF_CONDUCT.md)

Please [read the full text](./.github/CODE_OF_CONDUCT.md) to understand how to conduct yourself while contributing to this project.

## Semantic Versioning

`yggis` uses [semver](http://semver.org/) versioning.

## Submitting a Pull Request

**Before submitting a pull request,** please make sure the following is done:

1. Fork [the repository](https://github.com/malouro/yggis) and create your branch from `master`.
2. Implement code changes and write tests
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes (`yarn test`).
5. Format your code with [prettier](https://github.com/prettier/prettier) (`yarn format`).
6. Make sure your code lints (`yarn lint`).

### Development Workflow

After cloning yggis, run `yarn install` to fetch its dependencies.

Then, you can run several commands:

- `yarn test` runs unit tests in an interactive test watcher
- `yarn test <pattern>` runs tests with matching filenames
- `yarn test:e2e` runs the end-to-end test suite
- `yarn test:coverage` runs unit tests and reports back test coverage
- `yarn lint` checks the code style
- `yarn build` compiles the cjs and es modules into their respective folders

Make sure that your pull request contains unit tests for any new functionality. This way we can ensure that we don't break your code in the future. (`regressions === notGood`)

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
