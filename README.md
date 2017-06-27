# STIR

A personalized waking app and social performance.

## Getting started

This repo is based on starter code from IBM Watson, which can be found here: https://github.com/watson-developer-cloud/personality-insights-nodejs. The IBM Watson Personality Insights API uses linguistic analysis to extract cognitive and social characteristics from input text.

The following directions for getting set up with the repo are from IBM Watson:

1. You need a Bluemix account. If you don't have one, [sign up][sign_up]. Experimental Watson Services are free to use.

2. Download and install the [Cloud-foundry CLI][cloud_foundry] tool if you haven't already.

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

## License

  This sample code is licensed under Apache 2.0.

## Privacy Notice

Sample web applications that include this package may be configured to track deployments to [IBM Bluemix](https://www.bluemix.net/) and other Cloud Foundry platforms. The following information is sent to a [Deployment Tracker](https://github.com/IBM-Bluemix/cf-deployment-tracker-service) service on each deployment:

* Node.js package version
* Node.js repository URL
* Application Name (`application_name`)
* Space ID (`space_id`)
* Application Version (`application_version`)
* Application URIs (`application_uris`)
* Labels of bound services
* Number of instances for each bound service and associated plan information

This data is collected from the `package.json` file in the sample application and the `VCAP_APPLICATION` and `VCAP_SERVICES` environment variables in IBM Bluemix and other Cloud Foundry platforms. This data is used by IBM to track metrics around deployments of sample applications to IBM Bluemix to measure the usefulness of our examples, so that we can continuously improve the content we offer to you. Only deployments of sample applications that include code to ping the Deployment Tracker service will be tracked.
