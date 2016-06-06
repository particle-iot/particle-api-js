# Particle

[src/Particle.js:16-512](https://github.com/spark/particle-api-js/blob/82873b6c1e11b6e478648b53b4a9eaaf3afd8055/src/Particle.js#L16-L512 "Source code on GitHub")

Particle Cloud API wrapper.

See <https://docs.particle.io/reference/javascript/> for examples
of using the `Particle` class.

Most Particle methods take a single unnamed argument object documented as
`$0` with key/value pairs for each option.

## constructor

[src/Particle.js:24-27](https://github.com/spark/particle-api-js/blob/82873b6c1e11b6e478648b53b4a9eaaf3afd8055/src/Particle.js#L24-L27 "Source code on GitHub")

Contructor for the Cloud API wrapper.

Create a new Particle object and call methods below on it.

**Parameters**

-   `options` **\[[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)](default Defaults)** Options to be used for all requests (see [Defaults](../src/Defaults.js))

## login

[src/Particle.js:36-45](https://github.com/spark/particle-api-js/blob/82873b6c1e11b6e478648b53b4a9eaaf3afd8055/src/Particle.js#L36-L45 "Source code on GitHub")

Login to Particle Cloud using an existing Particle acccount.

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.username` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Username for the Particle account
    -   `$0.password` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Password for the Particle account
    -   `$0.tokenDuration` **\[[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)](default this.tokenDuration)** How long the access token should last in seconds

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## createUser

[src/Particle.js:53-57](https://github.com/spark/particle-api-js/blob/82873b6c1e11b6e478648b53b4a9eaaf3afd8055/src/Particle.js#L53-L57 "Source code on GitHub")

Create a user account for the Particle Cloud

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.username` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Desired username
    -   `$0.password` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Password

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## removeAccessToken

[src/Particle.js:66-70](https://github.com/spark/particle-api-js/blob/82873b6c1e11b6e478648b53b4a9eaaf3afd8055/src/Particle.js#L66-L70 "Source code on GitHub")

Revoke an access token

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.username` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Username of the Particle cloud account that the token belongs to.
    -   `$0.password` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Password for the account
    -   `$0.token` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access token you wish to revoke

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## listAccessTokens

[src/Particle.js:78-80](https://github.com/spark/particle-api-js/blob/82873b6c1e11b6e478648b53b4a9eaaf3afd8055/src/Particle.js#L78-L80 "Source code on GitHub")

List all valid access tokens for a Particle Cloud account

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.username` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Username
    -   `$0.password` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Password

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## listDevices

[src/Particle.js:87-89](https://github.com/spark/particle-api-js/blob/82873b6c1e11b6e478648b53b4a9eaaf3afd8055/src/Particle.js#L87-L89 "Source code on GitHub")

List devices claimed to the account

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## getDevice

[src/Particle.js:97-99](https://github.com/spark/particle-api-js/blob/82873b6c1e11b6e478648b53b4a9eaaf3afd8055/src/Particle.js#L97-L99 "Source code on GitHub")

Get detailed informationa about a device

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## claimDevice

[src/Particle.js:107-112](https://github.com/spark/particle-api-js/blob/82873b6c1e11b6e478648b53b4a9eaaf3afd8055/src/Particle.js#L107-L112 "Source code on GitHub")

Claim a device to the account. The device must be online and unclaimed.

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID
    -   `$0.requestTransfer`  
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## removeDevice

[src/Particle.js:120-122](https://github.com/spark/particle-api-js/blob/82873b6c1e11b6e478648b53b4a9eaaf3afd8055/src/Particle.js#L120-L122 "Source code on GitHub")

Unclaim / Remove a device from your account

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## renameDevice

[src/Particle.js:131-133](https://github.com/spark/particle-api-js/blob/82873b6c1e11b6e478648b53b4a9eaaf3afd8055/src/Particle.js#L131-L133 "Source code on GitHub")

Rename a device

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.name` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Desired Name
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## getClaimCode

[src/Particle.js:141-143](https://github.com/spark/particle-api-js/blob/82873b6c1e11b6e478648b53b4a9eaaf3afd8055/src/Particle.js#L141-L143 "Source code on GitHub")

Generate a claim code to use in the device claiming process.

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token
    -   `$0.iccid` **\[[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** ICCID of the SIM card used in the Electron

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## getVariable

[src/Particle.js:163-165](https://github.com/spark/particle-api-js/blob/82873b6c1e11b6e478648b53b4a9eaaf3afd8055/src/Particle.js#L163-L165 "Source code on GitHub")

Get the value of a device variable

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.name` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Variable name
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## signalDevice

[src/Particle.js:174-178](https://github.com/spark/particle-api-js/blob/82873b6c1e11b6e478648b53b4a9eaaf3afd8055/src/Particle.js#L174-L178 "Source code on GitHub")

Instruct the device to turn on/off the LED in a rainbow pattern

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.signal` **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Signal on or off
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## flashDevice

[src/Particle.js:188-197](https://github.com/spark/particle-api-js/blob/82873b6c1e11b6e478648b53b4a9eaaf3afd8055/src/Particle.js#L188-L197 "Source code on GitHub")

Compile and flash application firmware to a device

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.files` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Object containing files to be compiled. Keys should be the filenames, and the values should be a path or Buffer of the file contents.
    -   `$0.targetVersion` **\[[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** System firmware version to compile against (optional, default `latest`)
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** String

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## flashTinker

[src/Particle.js:205-209](https://github.com/spark/particle-api-js/blob/82873b6c1e11b6e478648b53b4a9eaaf3afd8055/src/Particle.js#L205-L209 "Source code on GitHub")

Flash the Tinker application to a device

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## compileCode

[src/Particle.js:219-228](https://github.com/spark/particle-api-js/blob/82873b6c1e11b6e478648b53b4a9eaaf3afd8055/src/Particle.js#L219-L228 "Source code on GitHub")

Compile firmware using the Particle Cloud

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.files` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Object containing files to be compiled. Keys should be the filenames, and the values should be a path or Buffer of the file contents.
    -   `$0.platformId` **\[[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)]** Platform id number of the device you are compiling for. Common values are 0=Core, 6=Photon, 10=Electron.
    -   `$0.targetVersion` **\[[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** System firmware version to compile against (optional, default `latest`)
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## downloadFirmwareBinary

[src/Particle.js:236-245](https://github.com/spark/particle-api-js/blob/82873b6c1e11b6e478648b53b4a9eaaf3afd8055/src/Particle.js#L236-L245 "Source code on GitHub")

Download a firmware binary

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.binaryId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Binary ID received from a successful compile call
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Request](https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/request)** 

## sendPublicKey

[src/Particle.js:255-263](https://github.com/spark/particle-api-js/blob/82873b6c1e11b6e478648b53b4a9eaaf3afd8055/src/Particle.js#L255-L263 "Source code on GitHub")

Send a new device public key to the Particle Cloud

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.key` **([String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Buffer](https://nodejs.org/api/buffer.html))** Public key contents
    -   `$0.algorithm` **\[[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** Algorithm used to generate the public key. Valid values are `rsa` or `ecc`. (optional, default `rsa`)
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## callFunction

[src/Particle.js:273-277](https://github.com/spark/particle-api-js/blob/82873b6c1e11b6e478648b53b4a9eaaf3afd8055/src/Particle.js#L273-L277 "Source code on GitHub")

Call a device function

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.name` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Function name
    -   `$0.argument` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Function argument
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## getEventStream

[src/Particle.js:289-313](https://github.com/spark/particle-api-js/blob/82873b6c1e11b6e478648b53b4a9eaaf3afd8055/src/Particle.js#L289-L313 "Source code on GitHub")

Get a stream of events

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **\[[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** Device ID or Name, or `mine` to indicate only your devices.
    -   `$0.name` **\[[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** Event Name
    -   `$0.org` **\[[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** Organization Slug
    -   `$0.product` **\[[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** Product Slug
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** If the promise resolves, the resolution value will be an EventStream object that will
emit 'event' events, as well as the specific named event.

## publishEvent

[src/Particle.js:323-329](https://github.com/spark/particle-api-js/blob/82873b6c1e11b6e478648b53b4a9eaaf3afd8055/src/Particle.js#L323-L329 "Source code on GitHub")

Publish a event to the Particle Cloud

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.name` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Event name
    -   `$0.data` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Event data
    -   `$0.isPrivate` **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Should the event be publicly available?
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## createWebhook

[src/Particle.js:348-356](https://github.com/spark/particle-api-js/blob/82873b6c1e11b6e478648b53b4a9eaaf3afd8055/src/Particle.js#L348-L356 "Source code on GitHub")

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

[src/Particle.js:364-366](https://github.com/spark/particle-api-js/blob/82873b6c1e11b6e478648b53b4a9eaaf3afd8055/src/Particle.js#L364-L366 "Source code on GitHub")

Delete a webhook

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.hookId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Webhook ID
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## listWebhooks

[src/Particle.js:373-375](https://github.com/spark/particle-api-js/blob/82873b6c1e11b6e478648b53b4a9eaaf3afd8055/src/Particle.js#L373-L375 "Source code on GitHub")

List all webhooks owned by the account

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## getUserInfo

[src/Particle.js:382-384](https://github.com/spark/particle-api-js/blob/82873b6c1e11b6e478648b53b4a9eaaf3afd8055/src/Particle.js#L382-L384 "Source code on GitHub")

Get details about the current user

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## listBuildTargets

[src/Particle.js:410-416](https://github.com/spark/particle-api-js/blob/82873b6c1e11b6e478648b53b4a9eaaf3afd8055/src/Particle.js#L410-L416 "Source code on GitHub")

List valid build targets to be used for compiling

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token
    -   `$0.onlyFeatured` **\[[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)]** Only list featured build targets (optional, default `false`)

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 
