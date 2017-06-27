# STIR

A personalized waking app and social performance.

## Getting started

This repo is based on [starter code](https://github.com/watson-developer-cloud/personality-insights-nodejs) from IBM Watson. The IBM Watson Personality Insights API uses linguistic analysis to extract cognitive and social characteristics from input text.

The following directions for getting set up with the repo are from IBM Watson:

1. You need a Bluemix account. If you don't have one, [sign up](https://console.bluemix.net/registration/). Experimental Watson Services are free to use.

2. Download and install the [Cloud-foundry CLI](https://github.com/cloudfoundry/cli) tool if you haven't already.

3. Edit the `manifest.yml` file and change `<application-name>` to something unique. The name you use determines the URL of your application. For example, `<application-name>.mybluemix.net`.

  ```yaml
  applications:
  - services:
    - my-service-instance
    name: <application-name>
    command: npm start
    path: .
    memory: 512M
  ```

4. Connect to Bluemix with the command line tool.

  ```sh
  cf api https://api.ng.bluemix.net
  cf login
  ```

5. Create and retrieve service keys to access the [Personality Insights][service_url] service:

  ```none
  cf create-service personality_insights lite my-pi-service
  cf create-service-key my-pi-service myKey
  cf service-key my-pi-service myKey
  ```

6. Create a `.env` file in the root directory by copying the sample `.env.example` file using the following command:

  ```none
  cp .env.example .env
  ```
  You will update the `.env` with the information you retrieved in steps 5.

  The `.env` file will look something like the following:

  ```none
  PERSONALITY_INSIGHTS_USERNAME=<username>
  PERSONALITY_INSIGHTS_PASSWORD=<password>
  ```

7. Install the dependencies you application need:

  ```none
  npm install
  ```

8. Start the application locally:

  ```none
  npm start
  ```

9. Point your browser to [http://localhost:3000](http://localhost:3000).

10. **Optional:** Push the application to Bluemix:

  ```none
  cf push
  ```

After completing the steps above, you are ready to test your application. Start a browser and enter the URL of your application.

            <your application name>.mybluemix.net


### Directory structure

```none
.
├── app.js                       // express entry point
├── config                       // express configuration
│   ├── error-handler.js
│   ├── express.js
│   ├── i18n.js
│   ├── passport.js
│   └── security.js
├── helpers                      // utility modules
│   ├── personality-insights.js
│   └── twitter-helper.js
├── i18n                         // internationalization
│   ├── en.json
│   ├── es.json
│   └── ja.json
├── manifest.yml
├── package.json
├── public
│   ├── css
│   ├── data                     
│   ├── fonts
│   ├── images
│   └── js
├── router.js                   // express routes
├── server.js                   // application entry point
├── test
└── views                       // ejs views
```
