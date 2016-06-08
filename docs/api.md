# Particle

[src/Particle.js:16-521](https://github.com/spark/particle-api-js/blob/30d462f342a494e7aff6a57b4f1a1aca18814953/src/Particle.js#L16-L521 "Source code on GitHub")

Particle Cloud API wrapper.

See <https://docs.particle.io/reference/javascript/> for examples
of using the `Particle` class.

Most Particle methods take a single unnamed argument object documented as
`$0` with key/value pairs for each option.

## constructor

[src/Particle.js:24-27](https://github.com/spark/particle-api-js/blob/30d462f342a494e7aff6a57b4f1a1aca18814953/src/Particle.js#L24-L27 "Source code on GitHub")

Contructor for the Cloud API wrapper.

Create a new Particle object and call methods below on it.

**Parameters**

-   `options` **\[[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)](default Defaults)** Options to be used for all requests (see [Defaults](../src/Defaults.js))

## login

[src/Particle.js:36-45](https://github.com/spark/particle-api-js/blob/30d462f342a494e7aff6a57b4f1a1aca18814953/src/Particle.js#L36-L45 "Source code on GitHub")

Login to Particle Cloud using an existing Particle acccount.

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.username` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Username for the Particle account
    -   `$0.password` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Password for the Particle account
    -   `$0.tokenDuration` **\[[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)](default this.tokenDuration)** How long the access token should last in seconds

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## createUser

[src/Particle.js:53-57](https://github.com/spark/particle-api-js/blob/30d462f342a494e7aff6a57b4f1a1aca18814953/src/Particle.js#L53-L57 "Source code on GitHub")

Create a user account for the Particle Cloud

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.username` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Email of the new user
    -   `$0.password` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Password

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## resetPassword

[src/Particle.js:64-66](https://github.com/spark/particle-api-js/blob/30d462f342a494e7aff6a57b4f1a1aca18814953/src/Particle.js#L64-L66 "Source code on GitHub")

Send reset password email for a Particle Cloud user account

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.username` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Email of the user

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## removeAccessToken

[src/Particle.js:75-79](https://github.com/spark/particle-api-js/blob/30d462f342a494e7aff6a57b4f1a1aca18814953/src/Particle.js#L75-L79 "Source code on GitHub")

Revoke an access token

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.username` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Username of the Particle cloud account that the token belongs to.
    -   `$0.password` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Password for the account
    -   `$0.token` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access token you wish to revoke

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## listAccessTokens

[src/Particle.js:87-89](https://github.com/spark/particle-api-js/blob/30d462f342a494e7aff6a57b4f1a1aca18814953/src/Particle.js#L87-L89 "Source code on GitHub")

List all valid access tokens for a Particle Cloud account

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.username` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Username
    -   `$0.password` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Password

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## listDevices

[src/Particle.js:96-98](https://github.com/spark/particle-api-js/blob/30d462f342a494e7aff6a57b4f1a1aca18814953/src/Particle.js#L96-L98 "Source code on GitHub")

List devices claimed to the account

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## getDevice

[src/Particle.js:106-108](https://github.com/spark/particle-api-js/blob/30d462f342a494e7aff6a57b4f1a1aca18814953/src/Particle.js#L106-L108 "Source code on GitHub")

Get detailed informationa about a device

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## claimDevice

[src/Particle.js:116-121](https://github.com/spark/particle-api-js/blob/30d462f342a494e7aff6a57b4f1a1aca18814953/src/Particle.js#L116-L121 "Source code on GitHub")

Claim a device to the account. The device must be online and unclaimed.

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID
    -   `$0.requestTransfer`  
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## removeDevice

[src/Particle.js:129-131](https://github.com/spark/particle-api-js/blob/30d462f342a494e7aff6a57b4f1a1aca18814953/src/Particle.js#L129-L131 "Source code on GitHub")

Unclaim / Remove a device from your account

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## renameDevice

[src/Particle.js:140-142](https://github.com/spark/particle-api-js/blob/30d462f342a494e7aff6a57b4f1a1aca18814953/src/Particle.js#L140-L142 "Source code on GitHub")

Rename a device

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.name` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Desired Name
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## getClaimCode

[src/Particle.js:150-152](https://github.com/spark/particle-api-js/blob/30d462f342a494e7aff6a57b4f1a1aca18814953/src/Particle.js#L150-L152 "Source code on GitHub")

Generate a claim code to use in the device claiming process.

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token
    -   `$0.iccid` **\[[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** ICCID of the SIM card used in the Electron

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## getVariable

[src/Particle.js:172-174](https://github.com/spark/particle-api-js/blob/30d462f342a494e7aff6a57b4f1a1aca18814953/src/Particle.js#L172-L174 "Source code on GitHub")

Get the value of a device variable

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.name` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Variable name
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## signalDevice

[src/Particle.js:183-187](https://github.com/spark/particle-api-js/blob/30d462f342a494e7aff6a57b4f1a1aca18814953/src/Particle.js#L183-L187 "Source code on GitHub")

Instruct the device to turn on/off the LED in a rainbow pattern

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.signal` **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Signal on or off
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## flashDevice

[src/Particle.js:197-206](https://github.com/spark/particle-api-js/blob/30d462f342a494e7aff6a57b4f1a1aca18814953/src/Particle.js#L197-L206 "Source code on GitHub")

Compile and flash application firmware to a device

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.files` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Object containing files to be compiled. Keys should be the filenames, and the values should be a path or Buffer of the file contents.
    -   `$0.targetVersion` **\[[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** System firmware version to compile against (optional, default `latest`)
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** String

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## flashTinker

[src/Particle.js:214-218](https://github.com/spark/particle-api-js/blob/30d462f342a494e7aff6a57b4f1a1aca18814953/src/Particle.js#L214-L218 "Source code on GitHub")

Flash the Tinker application to a device

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## compileCode

[src/Particle.js:228-237](https://github.com/spark/particle-api-js/blob/30d462f342a494e7aff6a57b4f1a1aca18814953/src/Particle.js#L228-L237 "Source code on GitHub")

Compile firmware using the Particle Cloud

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.files` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Object containing files to be compiled. Keys should be the filenames, and the values should be a path or Buffer of the file contents.
    -   `$0.platformId` **\[[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)]** Platform id number of the device you are compiling for. Common values are 0=Core, 6=Photon, 10=Electron.
    -   `$0.targetVersion` **\[[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** System firmware version to compile against (optional, default `latest`)
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## downloadFirmwareBinary

[src/Particle.js:245-254](https://github.com/spark/particle-api-js/blob/30d462f342a494e7aff6a57b4f1a1aca18814953/src/Particle.js#L245-L254 "Source code on GitHub")

Download a firmware binary

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.binaryId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Binary ID received from a successful compile call
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Request](https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/request)** 

## sendPublicKey

[src/Particle.js:264-272](https://github.com/spark/particle-api-js/blob/30d462f342a494e7aff6a57b4f1a1aca18814953/src/Particle.js#L264-L272 "Source code on GitHub")

Send a new device public key to the Particle Cloud

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.key` **([String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Buffer](https://nodejs.org/api/buffer.html))** Public key contents
    -   `$0.algorithm` **\[[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** Algorithm used to generate the public key. Valid values are `rsa` or `ecc`. (optional, default `rsa`)
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## callFunction

[src/Particle.js:282-286](https://github.com/spark/particle-api-js/blob/30d462f342a494e7aff6a57b4f1a1aca18814953/src/Particle.js#L282-L286 "Source code on GitHub")

Call a device function

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.name` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Function name
    -   `$0.argument` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Function argument
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## getEventStream

[src/Particle.js:298-322](https://github.com/spark/particle-api-js/blob/30d462f342a494e7aff6a57b4f1a1aca18814953/src/Particle.js#L298-L322 "Source code on GitHub")

Get a stream of events

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **\[[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** Device ID or Name, or `mine` to indicate only your devices.
    -   `$0.name` **\[[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** Event Name
    -   `$0.org` **\[[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** Organization Slug
    -   `$0.product` **\[[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** Product Slug or Product ID
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** If the promise resolves, the resolution value will be an EventStream object that will
emit 'event' events, as well as the specific named event.

## publishEvent

[src/Particle.js:332-338](https://github.com/spark/particle-api-js/blob/30d462f342a494e7aff6a57b4f1a1aca18814953/src/Particle.js#L332-L338 "Source code on GitHub")

Publish a event to the Particle Cloud

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.name` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Event name
    -   `$0.data` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Event data
    -   `$0.isPrivate` **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Should the event be publicly available?
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## createWebhook

[src/Particle.js:357-365](https://github.com/spark/particle-api-js/blob/30d462f342a494e7aff6a57b4f1a1aca18814953/src/Particle.js#L357-L365 "Source code on GitHub")

Create a webhook

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.name` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Webhook name
    -   `$0.url` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** URL the webhook should hit
    -   `$0.requestType` **\[[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** HTTP method to use (optional, default `POST`)
    -   `$0.headers` **\[[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** Additional headers to add to the webhook
    -   `$0.json` **\[[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** JSON data
    -   `$0.query` **\[[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** Query string data
    -   `$0.responseTemplate` **\[[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** Webhook response template
    -   `$0.responseTopic` **\[[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** Webhook response topic
    -   `$0.rejectUnauthorized` **\[[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)]** Reject invalid HTTPS certificates
    -   `$0.webhookAuth` **\[[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** HTTP Basic Auth information
    -   `$0.form` **\[[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** Form data
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## deleteWebhook

[src/Particle.js:373-375](https://github.com/spark/particle-api-js/blob/30d462f342a494e7aff6a57b4f1a1aca18814953/src/Particle.js#L373-L375 "Source code on GitHub")

Delete a webhook

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.hookId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Webhook ID
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## listWebhooks

[src/Particle.js:382-384](https://github.com/spark/particle-api-js/blob/30d462f342a494e7aff6a57b4f1a1aca18814953/src/Particle.js#L382-L384 "Source code on GitHub")

List all webhooks owned by the account

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## getUserInfo

[src/Particle.js:391-393](https://github.com/spark/particle-api-js/blob/30d462f342a494e7aff6a57b4f1a1aca18814953/src/Particle.js#L391-L393 "Source code on GitHub")

Get details about the current user

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## listBuildTargets

[src/Particle.js:419-425](https://github.com/spark/particle-api-js/blob/30d462f342a494e7aff6a57b4f1a1aca18814953/src/Particle.js#L419-L425 "Source code on GitHub")

List valid build targets to be used for compiling

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token
    -   `$0.onlyFeatured` **\[[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)]** Only list featured build targets (optional, default `false`)

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 
