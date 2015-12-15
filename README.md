# browserify-aws-sdk

A browserify transform to support bundling the aws-sdk library with your code into a single file for Node.js runtime environments.

[![NPM](https://nodei.co/npm/browserify-aws-sdk.png)](https://www.npmjs.com/package/browserify-aws-sdk)
[![Build Status](https://api.travis-ci.org/asynchrony/browserify-aws-sdk.svg?branch=master)](https://travis-ci.org/asynchrony/browserify-aws-sdk)

# Install

Assuming you already have [browserify](https://www.npmjs.com/package/browserify) installed, with [npm](http://npmjs.org) do:

``` sh
npm install --save-dev browserify-aws-sdk
```

# Usage

To use from the command line:

``` sh
# include all services
browserify -g browserify-aws-sdk main.js
# include specified services only
browserify -g [ browserify-aws-sdk --services="ec2,route53" ] main.js
```

or from the api:

``` js
// include all services
b.transform('browserify-aws-sdk', { global: true });
// include specified services only
b.transform('browserify-aws-sdk', { global: true, services: ["ec2", "route53"] });
```
