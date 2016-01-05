var transformTools = require("browserify-transform-tools");
var path = require("path");

module.exports = transformTools.makeRequireTransform(
    "browserify-aws-sdk",
    {
        evaluateArguments: true,
        regex: /[\/\\]aws-sdk[\/\\]lib[\/\\]aws\.js$/
    },
    function (args, opts, cb) {
        switch (args[0]) {
            case "./api_loader":
                return cb(null, "{ load: function(svc, version) { return AWS.apiLoader.services[svc][version]; } }");
            case "./services":
                var services = opts.config.services;
                if (services instanceof Array) {
                    services = services.join(",");
                }
                if (services === undefined) {
                    services = "all";
                }
                var inject = "AWS.apiLoader.services = {};\n";
                if (services) {
                    var collector = require(path.resolve(path.dirname(opts.file), "../dist-tools/service-collector"));
                    inject += collector(services);
                }
                return cb(null, inject);
        }
        return cb();
    }
);
