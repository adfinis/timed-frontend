<p align="center">
  <img width="500" src="/public/assets/logo_text.png?raw=true">
  <br><br>
</p>

<p align="center">
  <a href="https://travis-ci.org/adfinis-sygroup/timed-frontend">
    <img alt="Build Status" src="https://img.shields.io/travis/adfinis-sygroup/timed-frontend.svg?style=flat-square">
  </a>
  <a href="https://coveralls.io/github/adfinis-sygroup/timed-frontend">
    <img alt="Coverage" src="https://img.shields.io/coveralls/adfinis-sygroup/timed-frontend.svg?style=flat-square">
  </a>
  <a href="/LICENSE">
    <img alt="License" src="https://img.shields.io/github/license/adfinis-sygroup/timed-frontend.svg?style=flat-square">
  </a>
</p>

## Requirements

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Installation

* `git clone git@github.com/adfinis-sygroup/timed-frontend`
* `cd timed-frontend`
* `yarn install`
* `bower install`

## Configurations

If you wish to add custom exports to the analysis section, you can create an environment variable with the name `TIMED_REPORT_EXPORT` and add a JSON Array as value.
```
TIMED_REPORT_EXPORT=[{"label":"Special Export","url":"/api/v1/special/export"}]
```
In development you can create a `.env` file and add the environment variable.
```
echo 'TIMED_REPORT_EXPORT=[{"label":"Special Export","url":"/api/v1/special/export"}]' > .env
```

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Running Tests

* `COVERAGE=true ember test`
* `COVERAGE=true ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

## License
Code released under the [GNU Affero General Public License v3.0](LICENSE).

