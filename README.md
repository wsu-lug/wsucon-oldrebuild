WSUCon Website
==============

This is the [LUG WSUCon website](http://wsucon.wsu.edu).

## Building

### Prerequisites

#### Platforms

In order to build the site, you will need to install:

* [Ruby](https://www.ruby-lang.org)
* [NodeJS](http://nodejs.org)

#### Dependencies

After installing the necessary platforms, you will need to install the project's Gem, NPM, and Bower dependencies.

Install Ruby Gems:
```sh
$ bundle install
```

Install NodeJS packages:
```sh
$ npm install
```

Install Bower packages:
```sh
$ bower install
```

#### Credentials

Sensitive details are stored in a `credentials.json` file, which is excluded from source control. Create this file with the following contents, filling in the values yourself:

```json
{
	"googleAnalyticsTrackingID": ""
}
```

### How to Build

After installing the project's dependencies, you can build the site with:

```sh
$ grunt build
```

The complete site can then be found under the `dist` directory, ready to be deployed.

## Deploying

### How to deploy

When deployment is supported, you will be able to deploy using:

```sh
$ grunt deploy
```

*Note: It may also be valuable to be able to deploy to a staging environment, but that is not evident at this time.*
