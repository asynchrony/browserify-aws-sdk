var fs = require("fs");
var path = require("path");
var assert = require("assert");
var browserify = require('browserify');

describe("index", function() {
  describe("ec2", function() {
    it("works without 'services' option specified", function (done) {
      this.timeout(10*1000);
      testTransformSuccess("EC2", "./bundle-ec2-all.js", { global: true }, done);
    });
    
    it("works with correct 'services' specified", function (done) {
      this.timeout(10*1000);
      testTransformSuccess("EC2", "./bundle-ec2.js", { global: true, services: [ "ec2" ] }, done);
    });
    
    it("fails with wrong 'services' specified", function (done) {
      this.timeout(10*1000);
      testTransformFailure("EC2", "./bundle-ec2-fail.js", { global: true, services: [ "route53" ] }, done);
    });
  });
  
  describe("route53", function() {
    it("works without 'services' option specified", function (done) {
      this.timeout(10*1000);
      testTransformSuccess("Route53", "./bundle-route53-all.js", { global: true }, done);
    });
    
    it("works with correct 'services' specified", function (done) {
      this.timeout(10*1000);
      testTransformSuccess("Route53", "./bundle-route53.js", { global: true, services: [ "route53" ] }, done);
    });
    
    it("fails with wrong 'services' specified", function (done) {
      this.timeout(10*1000);
      testTransformFailure("Route53", "./bundle-route53-fail.js", { global: true, services: [ "ec2" ] }, done);
    });
  });
  
  describe("none", function() {
    it("supports bundling no services", function (done) {
      this.timeout(10*1000);
      testTransformFailure("EC2", "./bundle-none.js", { global: true, services: [ ] }, done);
    });
  });
  
  it("doesn't blow up on jws", function (done) {
    this.timeout(10*1000);
    testTransform("./input-jws.js", "./bundle-jws.js", { global: true }, function(jws) {
      if (!jws) {
        done(new Error("jws was not returned"));
      } else {
        done();
      }
    });
  });
});

function testTransformSuccess(service, bundleFile, transformOptions, done) {
  testTransform("./input-aws.js", bundleFile, transformOptions, function(AWS) {
    try {
      new AWS[service]();
      done();
    } catch (e) {
      done(e);
    }
  });
}

function testTransformFailure(service, bundleFile, transformOptions, done) {
  testTransform("./input-aws.js", bundleFile, transformOptions, function(AWS) {
    try {
      new AWS[service]();
      done(new Error("service call did not fail"));
    } catch (e) {
      done();
    }
  });
}

function testTransform(sampleFile, bundleFile, transformOptions, callback) {
  var samplePath = path.join(__dirname, sampleFile);
  var bundlePath = path.join(__dirname, bundleFile);
  var bundler = browserify({
    standalone: "test",
    browserField: false, // Setup for node app (copy logic of --node in bin/args.js)
    builtins: false,
    commondir: false,
    detectGlobals: true, // Default for bare in cli is true, but we don't care if its slower
    insertGlobalVars: {
      process: function() {},
    }
  });
  bundler.add(samplePath);
  bundler.transform("./index", transformOptions);
  bundler.bundle().pipe(fs.createWriteStream(bundlePath)).on("finish", function() {
    var result = require(bundlePath);
    callback(result);
  });
}
