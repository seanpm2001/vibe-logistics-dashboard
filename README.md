# vibe-logistics-dashboard
This website generates front page of new logistics system.

Please don't delete or modify `./index.html` if you don't know what to do.
## Version for
**npm > ^7.0.0 | ^8.0.0**

NVM is recommended, install nvm by yourself.

(using node v16.11.0 (npm v8.0.0))

```
nvm install v16.11.0
nvm use v16.11.0
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
// 没对接API的情况下请使用 npm run dev:mock
npm run dev 
npm run dev:mock // API use mockjs
npm run serve // preview prod env
```

### Compiles and minifies for production
```
npm run build:beta
npm run build:prod
npm run build:mock // API use mockjs
```

### Lints and fixes files
```
npm run lint
```

_____
## Technology stack
* CLI:
  * vite (run and build faster)
  * vue-cli3 (easier)
* MVVM framework:
  * vue3 (virtual dom)
  * vuex (state management)
* Router:
  * vue-router (history pattern)
* UI framework:
  * element-plus (sass and less dependence, import indemand)
* API simulation:
  * mockjs (import indemand)
* Js compatibility:
  * babel (convert js and help element import css indemand)
* Js efficiency:
  * lodash
* Formatter:
  * eslint (format code)

### See more info in [package.json](./package.json).

_____
### Customize configuration
See [Vite Configuration Reference](https://vitejs.cn/guide/).

See [Vue-Cli Configuration Reference](https://cli.vuejs.org/config/).

See [Eslint Configuration Reference](https://eslint.bootcss.com/docs/user-guide/getting-started).

_____
### Specification
#### File name
* js: `keba-case` (In addition to some special cases)
* vue: `upper-camel-case`
* directory: `camel-case`

#### Import order
1. node-modules `dependency`
2. `.vue` file
3. `.js` file
#### Function name
* API related (query/find/create/update/delete)
* Click/Change/Confirm Event: (handleXXX) @click="handleXXX"
* Operation related (view/edit/submit/remove)


#### Other
* Html template `""` , JS `''`
* Couputed value must return a value!!!
* v-for must set v-key (unique value like id)
* don't use v-for and v-if in the same element
* use simple expression in vue template
* use multi-words for components name
* component style declarations are scoped like `.unit-page .button`


#### API data name
* list: `{ items: [], total: 0 }`
* single: `{ item: {} }`

#### Tips
* Use `Uppercase Component Name` in `template`, like `<Batch />` for readability.
* Import missing style like `element-plus/theme-chalk/src/message.scss` once in single root page, don't import it in components like `Batch.vue` again.
