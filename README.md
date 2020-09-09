# Interactive Catchment Explorer for Vulnerability Assessment of Native Trout Species in the Crown of the Continent Ecosystem

Jeffrey D Walker, PhD <jeff@walkerenvres.com>  
[Walker Environmental Research, LLC](https://walkerenvres.com)


## Project setup

Install dependencies

```sh
yarn install
```

Configuration is set using `.env` files for each environment (`development`, `staging`, `production`). See [vue-cli](https://cli.vuejs.org/guide/mode-and-env.html) for details.

There are two required configuration variables:

```
BASE_URL=/ # root path for the application
VUE_APP_API_URL=http://localhost:8000/  # location for fetching data, set to baseURL for axios
```

The default `.env` files can be overriden with `.local` variants (e.g. `.env.development.local`).

## Generate Datasets

The datasets and configuration files for this application are stored in the `data/` folder.

The scripts for generating these datasets are located in a separate repository: [walkerjeffd/sheds-norock](https://github.com/walkerjeffd/sheds-norock).

## Development Server

To run the application in development mode, run the `dev` command, which serves the `data/` folder at port `8000`, and runs the vue CLI `serve` command.

```sh
yarn dev
```

## Production Build

Run the `build` command to build the application for production. The output is saved to the `dist/` folder.

```sh
yarn build
```

For staging build, run `build:staging`

```sh
yarn build:staging
```

## Deployment

After building the application, copy the contents of `dist/` and `data/` to the production server.

```sh
rsync -av --delete dist/ user@host:/path/to/app
rsync -av --delete data/ user@host:/path/to/data
```

If the application is deployed to S3, use the AWS CLI.

```sh
aws s3 sync dist/ s3://<WEBSITE_BUCKET_NAME>/<BASE_URL> --delete
aws s3 sync data/ s3://<DATA_BUCKET_NAME>/ --delete
```

## License

MIT (see `LICENSE`)
