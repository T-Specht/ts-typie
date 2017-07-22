#!/usr/bin/env node
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
import * as request from "request";
import * as chalk from "chalk";
import * as figures from "figures";


const cwd = process.cwd();
const packagePath = path.join(cwd, 'package.json');

if (!fs.existsSync(packagePath)) {
    console.error('No package.json file found!');
    process.exit();
}

// Package.json exists

const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
let dependencies: string[] = [];

if (pkg.dependencies) {
    dependencies.push(...Object.keys(pkg.dependencies));
}
if (pkg.devDependencies) {
    dependencies.push(...Object.keys(pkg.devDependencies));
}

// Filter out already installed types

let alreadyInstalledTypes = dependencies.filter(d => /^@types\//.test(d));;
dependencies = dependencies.filter(d => !/^@types\//.test(d));

for (let dependency of dependencies) {
     const dependencyString = chalk.bold(dependency)

    // Check if types are already installed

    if(alreadyInstalledTypes.includes('@types/' + dependency)){
        console.log(chalk.yellow(figures.play, `Types for ${dependencyString} already installed. Skipping...`));
        continue;
    }

    // Check for included types
    let pkgPath = path.join(cwd, 'node_modules', dependency, 'package.json');
   

    if(fs.existsSync(pkgPath)){
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        if(pkg.types || pkg.typings){
            console.log(chalk.yellow(figures.warning, `Module ${dependencyString} includes own types. Skipping...`));
            continue;
        }
    }

    // Check if types are available    

     ((dependency) => {
        request('https://www.npmjs.com/package/@types/' + dependency, (err, res, body) => {
            
            if(res.statusCode == 200){
                exec(`npm install -D @types/${dependency}`, (err, stdout, stderr) => {
                    if(!err){
                        console.log(chalk.green(figures.tick, `@types/${dependencyString} installed successfully!`));
                    }
                });
            }else{
                console.log(chalk.red(figures.cross, `No types found for ${dependencyString} in registry. Skipping...`));
            }

        });
    })(dependency); 
    
}