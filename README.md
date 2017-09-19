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

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with NPM v5+)
* [Bower](https://bower.io/)
* [Ember CLI](https://ember-cli.com/)
* [Chrome](https://www.google.com/chrome/)
* [Firefox](https://www.mozilla.org/firefox/)

## Installation

* `git clone git@github.com/adfinis-sygroup/timed-frontend`
* `cd timed-frontend`
* `npm install`
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

If you have a running [backend](https://github.com/adfinis-sygroup/timed-backend) you need to run

* `ember serve --proxy=http://localhost:8000`

### Running Tests

* `COVERAGE=true ember test`
* `COVERAGE=true ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

## License
Code released under the [GNU Affero General Public License v3.0](LICENSE).

