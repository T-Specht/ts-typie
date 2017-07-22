#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var child_process_1 = require("child_process");
var request = require("request");
var chalk = require("chalk");
var figures = require("figures");
var cwd = process.cwd();
var packagePath = path.join(cwd, 'package.json');
if (!fs.existsSync(packagePath)) {
    console.error('No package.json file found!');
    process.exit();
}
// Package.json exists
var pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
var dependencies = [];
if (pkg.dependencies) {
    dependencies.push.apply(dependencies, Object.keys(pkg.dependencies));
}
if (pkg.devDependencies) {
    dependencies.push.apply(dependencies, Object.keys(pkg.devDependencies));
}
// Filter out already installed types
var alreadyInstalledTypes = dependencies.filter(function (d) { return /^@types\//.test(d); });
;
dependencies = dependencies.filter(function (d) { return !/^@types\//.test(d); });
var _loop_1 = function (dependency) {
    var dependencyString = chalk.bold(dependency);
    // Check if types are already installed
    if (alreadyInstalledTypes.includes('@types/' + dependency)) {
        console.log(chalk.yellow(figures.play, "Types for " + dependencyString + " already installed. Skipping..."));
        return "continue";
    }
    // Check for included types
    var pkgPath = path.join(cwd, 'node_modules', dependency, 'package.json');
    if (fs.existsSync(pkgPath)) {
        var pkg_1 = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        if (pkg_1.types || pkg_1.typings) {
            console.log(chalk.yellow(figures.warning, "Module " + dependencyString + " includes own types. Skipping..."));
            return "continue";
        }
    }
    // Check if types are available    
    (function (dependency) {
        request('https://www.npmjs.com/package/@types/' + dependency, function (err, res, body) {
            if (res.statusCode == 200) {
                child_process_1.exec("npm install -D @types/" + dependency, function (err, stdout, stderr) {
                    if (!err) {
                        console.log(chalk.green(figures.tick, "@types/" + dependencyString + " installed successfully!"));
                    }
                });
            }
            else {
                console.log(chalk.red(figures.cross, "No types found for " + dependencyString + " in registry. Skipping..."));
            }
        });
    })(dependency);
};
for (var _i = 0, dependencies_1 = dependencies; _i < dependencies_1.length; _i++) {
    var dependency = dependencies_1[_i];
    _loop_1(dependency);
}
