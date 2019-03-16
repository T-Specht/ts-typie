# ts-typie

A small utility for installing TypeScript definition files using npm.

---

ts-typie reads your `package.json` file and tries to install TypeScript definition files for all your installed modules, so you don't have to do it manually.

For every package you have installed, ts-typie also checks for included definition files that come packed with the npm module itself (e.g. moment includes own definition files) and skips the module if it finds bundled definition files.

## Install

Install ts-typie as a dev dependancy e.g `npm install -D ts-typie`.  

## Usage
### Command:
`ts-typie [options]`
### Options:
| Option | Info |
| - | - |
| `--help`, `-h` | Output usage information |
| `--tool [value]`, `-t [value]` | Which package manager tool to use (defaults to first available) |
| `--version`, `-v` | Output the version number |
