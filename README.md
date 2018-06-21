# What have ASTs ever done for us?

Talk given first [Manchester Frontend Meetup](https://www.meetup.com/en-AU/Manchester-Frontend-Meetup/events/251063895/)

[Slides](https://docs.google.com/presentation/d/1SkFKi2qMgY4CCY2QgFqmSBSSIOZCuUeA-6EJpE98KyY/edit?usp=sharing)

```shell
npm install
```

## Examples

### Parsing

File: `./src/1-tree.js`
[ASTExplorer Example](http://astexplorer.net/#/gist/dac18349029956be575f591964f57362/51d2eeb5ddde532967e120f691ce6203c356eb63)

### ESLInt (Error Between Headphones)

File: `./src/2-errors.js`
Uses [ESLint](https://eslint.org/) with [eslint-plugin-local-rules](https://www.npmjs.com/package/eslint-plugin-local-rules)

- Basic eslint Rule: `./eslint-rules/no-cond-assign.js`.
- Guarding `console.log` with and `if(process.env.NODE_ENV == 'development')`.

  Uncomment in `.eslintrc`

  ```js
  // , "local-rules/no-unguarded-console": "error"
  ```

  Files: `./eslint-rules/no-unguarded-console.js` and `./eslint-rules/no-unguarded-console.complete.js`

### Babel Plugins

File: `./src/3-babel-plugins.js`
OutputFile: `./dist/3-babel-plugins.js`

Key-value pairs

- SOME_VALUE = 2
- process.env.NODE_ENV = development

To build without the plugin.
```shell
npm run build
```

#### Basic define plugin

Plugin: `./src/plugin/3_1-plugin-transform-defined.js`

```shell
npm run build:define
```

#### Actual define plugin ([npm](https://www.npmjs.com/package/babel-plugin-transform-define) | [GitHub](https://github.com/FormidableLabs/babel-plugin-transform-define))

Plugin: `./src/plugin/3_1-plugin-transform-defined.js`

```shell
npm run build:full-define
```

#### Macros

- [babel-plugin-macros](https://www.npmjs.com/package/babel-plugin-macros)
- [preval.macro](https://github.com/kentcdodds/preval.macro)
- [codegen-macro](https://github.com/kentcdodds/codegen.macro)

Unmcomment
```js
// import preval from 'preval.macro';
// import codegen from 'codegen.macro';

...

// const one = preval`module.exports = 1 + 2 - 1 - 1`;

// codegen`module.exports = ['a', 'b', 'c'].map(l => 'export const ' + l + ' = ' + JSON.stringify(l)).join(';')`;

```

```shell
npm run build
npm run build:define
npm run build:full-define
```
