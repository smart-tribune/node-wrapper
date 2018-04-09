# Smart Tribune Node.js Wrapper #

## Introduction ##

Provides an easy to use Node.js wrapper for the lastest version of [Smart Tribune API](https://www.smart-tribune.com/developers/api?v=v1.1). This will help you to authenticate and call Smart Tribune API with a few lines of code runing Node.js language.

### Prerequisites ###

Make sure to have the following informations:

* Smart Tribune API Key
* Smart Tribune API Secret
* [Node.js](https://nodejs.org/) installed on your machine

## Installation ##

Create a working folder :
```
mkdir myAPI
```

Go into the ```myAPI``` folder and install the ```wrapper-st``` module :
```
cd myAPI
npm install wrapper-st
```

A new ```node_modules```  folder is created. Now, create an ```index.js``` file :
```
vim index.js
```

You are now ready to make some api calls !

## Usage ##

In your ```index.js``` file, you need to require the .js wrapper :
```
var wrapper = require('wrapper-st');
```

as well as all required modules :
```
var express = require('express');
var request = require('request');
```

Now, you have to setting up your API Key & API Secret :
```
var config = {
    API_URL: "https://api.smart-tribune.com/v1.1",
    CONSUMER_KEY: "", // Insert your consumer key here
    CONSUMER_SECRET: "", // Insert your consumer secret here
    CALLBACK_URL: ""
};
```

Then, you have to create a server with express framework :
```
var app = express();
app.set('port', (process.env.PORT) || 5000);
app.listen(app.get('port'), function () {
  console.log('Running on port', app.get('port'));
});
```

It's done.

What you're going to do next depends on what you want to GET, POST, PUT or DELETE from Smart Tribune servers through the API. Check out our [API documentation](https://www.smart-tribune.com/developers/api?v=v1.1) to see all the available endpoints and resources.



## Examples ##

* Retrieve platform informations :
```
app.get('/', function (req, res) {

    var context = {};

    wrapper.connectSmartTribune(config, context, function (error, result) {
        var url = 'https://api.smart-tribune.com/v1.1/platforms',
            params = {
                id: XXX
            };

        request.get({ url: url, oauth: result, qs: params, json: true }, function (error, r, body) {
            if (!error && r.statusCode == 200) {
                callback(null, message);
            } else {
                callback(error);
            }
        });
    });
});
```

Don't forget to replace the endpoint depend on what you want to request (all urls are available in the [API documentation](https://www.smart-tribune.com/developers/api?v=v1.1)).

You have to set parameters, so here, only the platform ID is required.

## Reporting issues ##

Open an issue on github.