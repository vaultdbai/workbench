# VaultDB Workbench

### [Live Version](http://vaultdb-hosted-content.s3-website.us-east-2.amazonaws.com/workbench/)

A Web App to query VaultDB

## Requirements

- yarn

## Libraries Used

- [React](https://reactjs.org/)
- [Material-UI](https://material-ui.com/)
- [React-Ace](https://github.com/securingsincity/react-ace)

## How to run:

1. [Clone](https://github.com/vaultdbai/workbench.git) the Repository.

Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Unrestricted
$env:NODE_OPTIONS = "--openssl-legacy-provider"

2. Follow Manual Setup Instructions on [this site](https://docs.amplify.aws/lib/storage/getting-started/q/platform/js/#manual-setup-import-storage-bucket) to manually set up connections to your S3 bucket.

3. Add window.S3_BUCKET_NAME=<your_bucket_name> to the config.js file.

4. Run `yarn install` to install the project dependencies.

5. Run `yarn start` to run the app in development mode.

6. App can be seen at: `http://localhost:3000/`

## Page Load Time

Page Load TIme has been calculated by using the [Lighthouse Tool](https://developers.google.com/web/tools/lighthouse).

![img](https://user-images.githubusercontent.com/16102594/121433865-29e5ba80-c99a-11eb-84de-9043ecffc072.png)

### Steps taken to Optimize

1. There was render blocking javascript for google font causing delay, used method mentioned [here](https://pagespeedchecklist.com/asynchronous-google-fonts) to overcome the problem.

2. Import for `react-ace` editor was long tasks running during page load, Converted it to Lasy loaded component using `React.lazy()` for code-splitting and delaying it's loading.

3. Only importing used Module in a component from library rather than importing whole library.

## create-react-app

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). You can find more information on how to perform common tasks [here](https://github.com/facebook/create-react-app/blob/master/packages/cra-template/template/README.md).
