# ice-vue-cce

> Interactive Catchment Explorer for Crown of the Continent Ecosystem

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Deployment

Run the `build` command, package up the contents of the `/dist` folder, and then copy to server using `scp`.

```
npm run build
cd dist
tar -czvf ice-cee.tar.gz *
scp ice-cee.tar.gz jeff@ecosheds.org:/home/jeff
```
