![Timed Logo](/public/assets/logo_text.png)

[![Build Status](https://github.com/adfinis-sygroup/timed-frontend/actions/workflows/test.yml/badge.svg?branch=master)](https://github.com/adfinis-sygroup/timed-frontend/actions/workflows/test.yml)
[![Codecov](https://codecov.io/gh/adfinis-sygroup/timed-frontend/branch/master/graph/badge.svg)](https://codecov.io/gh/adfinis-sygroup/timed-frontend)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

## Requirements

You will need the following things properly installed on your computer.

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)
- [Ember CLI](https://ember-cli.com/)
- [Chrome](https://www.google.com/chrome/)
- [Firefox](https://www.mozilla.org/firefox/)

Optional:

- Docker
- docker-compose

## Installation

- `git clone git@github.com/adfinis-sygroup/timed-frontend`
- `cd timed-frontend`
- `pnpm i`

## Running / Development

- `ember server`
- Visit your app at [http://localhost:4200](http://localhost:4200).

If you have a running [backend](https://github.com/adfinis-sygroup/timed-backend) you need to run

- `ember server --proxy=http://localhost:8000`
  or
- `pnpm start`

If you are using docker-compose you can start a static frontend and the backend by following the instructions in the [backend](https://github.com/adfinis-sygroup/timed-backend)

### Running Tests

- `COVERAGE=true ember test`
- `COVERAGE=true ember test --server`

### Building

- `ember build` (development)
- `ember build --environment production` (production)

## License

Code released under the [GNU Affero General Public License v3.0](LICENSE).
