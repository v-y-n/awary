**This software is under development and not stable**
  
Awary is a simple software that allows you to **store** data in the form of a **log** or **metric**
using HTTP requests, there is no processing of these data.  
  
Documentation is available at [docs.awary.app](https://docs.awary.app) and in the /docs directory as
markdown files.

## Features

- Add logs and update metrics with a simple HTTP request.
- Logs support tags.
- Each metric update is kept in an history.
- Customize your dashboard with charts or simple numbers.
- Multiple API keys per project.

## Quickstart

*Note: the repository has a docker-compose file for the MongoDB database but you can connect to your own instance if you want.*

### Prerequisites

- Node.js & npm
- make
- (optional) docker & docker-compose

### Configuration

1. Copy the server config example `server/conf-example.env` to `server/conf.env`, then edit it to fill the required fields, everything should be documented inside the file itself.
2. Edit the web app config file `web-app/.env.production` and change the `REACT_APP_API_URL` to match the location of the server.

### Launch it

1. `make db` to launch MongoDB with docker (optional).
2. `make server-setup` to install the server dependencies (only the first time).
3. `make web-app-setup` to install the web app dependencies (only the first time).
4. `make server` to launch the server.
5. `make web-app` to launch the web app.

## Building the documentation

1. Install **make**, **python** and **pip** if you don't already have them.
2. Install mkdocs with `pip install mkdocs`.
3. Install mkdocs material theme with `pip install mkdocs-material`.
4. Build the docs with `make docs`.
