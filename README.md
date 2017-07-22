# ts-typie

A small utility for installing TypeScript definition files using npm.

---

ts-typie reads your `package.json` file and tries to install TypeScript definition files for all your installed modules, so you don't have to do it manually.

For every package you have installed, ts-typie also checks for included definition files that come packed with the npm module itself (e.g. moment includes own definition files) and skips the module if it finds bundled definition files.

## Usage

Just install ts-typie globally using `npm install ts-typie -g` and use it in all your TypeScript Projects by running the command `ts-typie` in your terminal in your project folder.