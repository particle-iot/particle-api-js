# Particle

[src/Particle.js:17-593](https://github.com/spark/particle-api-js/blob/6bd9caa3857f308fb538601a987cb5ba83fa1137/src/Particle.js#L17-L593 "Source code on GitHub")

Particle Cloud API wrapper.

See <https://docs.particle.io/reference/javascript/> for examples
of using the `Particle` class.

Most Particle methods take a single unnamed argument object documented as
`$0` with key/value pairs for each option.

## constructor

[src/Particle.js:25-28](https://github.com/spark/particle-api-js/blob/6bd9caa3857f308fb538601a987cb5ba83fa1137/src/Particle.js#L25-L28 "Source code on GitHub")

Contructor for the Cloud API wrapper.

Create a new Particle object and call methods below on it.

**Parameters**

-   `options` **\[[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)](default {})** Options to be used for all requests (see [Defaults](../src/Defaults.js))

## login

[src/Particle.js:37-46](https://github.com/spark/particle-api-js/blob/6bd9caa3857f308fb538601a987cb5ba83fa1137/src/Particle.js#L37-L46 "Source code on GitHub")

Login to Particle Cloud using an existing Particle acccount.

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.username` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Username for the Particle account
    -   `$0.password` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Password for the Particle account
    -   `$0.tokenDuration` **\[[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)](default this.tokenDuration)** How long the access token should last in seconds

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## createUser

[src/Particle.js:55-61](https://github.com/spark/particle-api-js/blob/6bd9caa3857f308fb538601a987cb5ba83fa1137/src/Particle.js#L55-L61 "Source code on GitHub")

Create a user account for the Particle Cloud

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.username` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Email of the new user
    -   `$0.password` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Password
    -   `$0.accountInfo` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Object that contains account information fields such as user real name, company name, business account flag etc

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## verifyUser

[src/Particle.js:68-72](https://github.com/spark/particle-api-js/blob/6bd9caa3857f308fb538601a987cb5ba83fa1137/src/Particle.js#L68-L72 "Source code on GitHub")

Verify new user account via verification email

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.token` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the string token sent in the verification email

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## resetPassword

[src/Particle.js:79-81](https://github.com/spark/particle-api-js/blob/6bd9caa3857f308fb538601a987cb5ba83fa1137/src/Particle.js#L79-L81 "Source code on GitHub")

Send reset password email for a Particle Cloud user account

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.username` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Email of the user

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## removeAccessToken

[src/Particle.js:90-94](https://github.com/spark/particle-api-js/blob/6bd9caa3857f308fb538601a987cb5ba83fa1137/src/Particle.js#L90-L94 "Source code on GitHub")

Revoke an access token

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.username` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Username of the Particle cloud account that the token belongs to.
    -   `$0.password` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Password for the account
    -   `$0.token` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access token you wish to revoke

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## listAccessTokens

[src/Particle.js:102-104](https://github.com/spark/particle-api-js/blob/6bd9caa3857f308fb538601a987cb5ba83fa1137/src/Particle.js#L102-L104 "Source code on GitHub")

List all valid access tokens for a Particle Cloud account

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.username` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Username
    -   `$0.password` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Password

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## listDevices

[src/Particle.js:111-113](https://github.com/spark/particle-api-js/blob/6bd9caa3857f308fb538601a987cb5ba83fa1137/src/Particle.js#L111-L113 "Source code on GitHub")

List devices claimed to the account

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## getDevice

[src/Particle.js:121-123](https://github.com/spark/particle-api-js/blob/6bd9caa3857f308fb538601a987cb5ba83fa1137/src/Particle.js#L121-L123 "Source code on GitHub")

Get detailed informationa about a device

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## claimDevice

[src/Particle.js:131-136](https://github.com/spark/particle-api-js/blob/6bd9caa3857f308fb538601a987cb5ba83fa1137/src/Particle.js#L131-L136 "Source code on GitHub")

Claim a device to the account. The device must be online and unclaimed.

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID
    -   `$0.requestTransfer`  
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## removeDevice

[src/Particle.js:144-146](https://github.com/spark/particle-api-js/blob/6bd9caa3857f308fb538601a987cb5ba83fa1137/src/Particle.js#L144-L146 "Source code on GitHub")

Unclaim / Remove a device from your account

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## renameDevice

[src/Particle.js:155-157](https://github.com/spark/particle-api-js/blob/6bd9caa3857f308fb538601a987cb5ba83fa1137/src/Particle.js#L155-L157 "Source code on GitHub")

Rename a device

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.name` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Desired Name
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## getClaimCode

[src/Particle.js:165-167](https://github.com/spark/particle-api-js/blob/6bd9caa3857f308fb538601a987cb5ba83fa1137/src/Particle.js#L165-L167 "Source code on GitHub")

Generate a claim code to use in the device claiming process.

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token
    -   `$0.iccid` **\[[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** ICCID of the SIM card used in the Electron

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## getVariable

[src/Particle.js:187-189](https://github.com/spark/particle-api-js/blob/6bd9caa3857f308fb538601a987cb5ba83fa1137/src/Particle.js#L187-L189 "Source code on GitHub")

Get the value of a device variable

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.name` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Variable name
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## signalDevice

[src/Particle.js:198-202](https://github.com/spark/particle-api-js/blob/6bd9caa3857f308fb538601a987cb5ba83fa1137/src/Particle.js#L198-L202 "Source code on GitHub")

Instruct the device to turn on/off the LED in a rainbow pattern

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.signal` **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Signal on or off
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## flashDevice

[src/Particle.js:212-221](https://github.com/spark/particle-api-js/blob/6bd9caa3857f308fb538601a987cb5ba83fa1137/src/Particle.js#L212-L221 "Source code on GitHub")

Compile and flash application firmware to a device

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.files` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Object containing files to be compiled. Keys should be the filenames, and the values should be a path or Buffer of the file contents.
    -   `$0.targetVersion` **\[[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** System firmware version to compile against (optional, default `latest`)
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** String

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## flashTinker

[src/Particle.js:229-233](https://github.com/spark/particle-api-js/blob/6bd9caa3857f308fb538601a987cb5ba83fa1137/src/Particle.js#L229-L233 "Source code on GitHub")

Flash the Tinker application to a device

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## compileCode

[src/Particle.js:243-252](https://github.com/spark/particle-api-js/blob/6bd9caa3857f308fb538601a987cb5ba83fa1137/src/Particle.js#L243-L252 "Source code on GitHub")

Compile firmware using the Particle Cloud

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.files` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Object containing files to be compiled. Keys should be the filenames, and the values should be a path or Buffer of the file contents.
    -   `$0.platformId` **\[[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)]** Platform id number of the device you are compiling for. Common values are 0=Core, 6=Photon, 10=Electron.
    -   `$0.targetVersion` **\[[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** System firmware version to compile against (optional, default `latest`)
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## downloadFirmwareBinary

[src/Particle.js:260-269](https://github.com/spark/particle-api-js/blob/6bd9caa3857f308fb538601a987cb5ba83fa1137/src/Particle.js#L260-L269 "Source code on GitHub")

Download a firmware binary

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.binaryId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Binary ID received from a successful compile call
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Request](https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/request)** 

## sendPublicKey

[src/Particle.js:279-287](https://github.com/spark/particle-api-js/blob/6bd9caa3857f308fb538601a987cb5ba83fa1137/src/Particle.js#L279-L287 "Source code on GitHub")

Send a new device public key to the Particle Cloud

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.key` **([String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Buffer](https://nodejs.org/api/buffer.html))** Public key contents
    -   `$0.algorithm` **\[[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** Algorithm used to generate the public key. Valid values are `rsa` or `ecc`. (optional, default `rsa`)
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## callFunction

[src/Particle.js:297-301](https://github.com/spark/particle-api-js/blob/6bd9caa3857f308fb538601a987cb5ba83fa1137/src/Particle.js#L297-L301 "Source code on GitHub")

Call a device function

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.name` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Function name
    -   `$0.argument` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Function argument
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## getEventStream

[src/Particle.js:313-337](https://github.com/spark/particle-api-js/blob/6bd9caa3857f308fb538601a987cb5ba83fa1137/src/Particle.js#L313-L337 "Source code on GitHub")

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

[src/Particle.js:347-353](https://github.com/spark/particle-api-js/blob/6bd9caa3857f308fb538601a987cb5ba83fa1137/src/Particle.js#L347-L353 "Source code on GitHub")

Publish a event to the Particle Cloud

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.name` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Event name
    -   `$0.data` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Event data
    -   `$0.isPrivate` **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Should the event be publicly available?
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## createWebhook

[src/Particle.js:372-380](https://github.com/spark/particle-api-js/blob/6bd9caa3857f308fb538601a987cb5ba83fa1137/src/Particle.js#L372-L380 "Source code on GitHub")

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

[src/Particle.js:388-390](https://github.com/spark/particle-api-js/blob/6bd9caa3857f308fb538601a987cb5ba83fa1137/src/Particle.js#L388-L390 "Source code on GitHub")

Delete a webhook

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.hookId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Webhook ID
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## listWebhooks

[src/Particle.js:397-399](https://github.com/spark/particle-api-js/blob/6bd9caa3857f308fb538601a987cb5ba83fa1137/src/Particle.js#L397-L399 "Source code on GitHub")

List all webhooks owned by the account

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## getUserInfo

[src/Particle.js:406-408](https://github.com/spark/particle-api-js/blob/6bd9caa3857f308fb538601a987cb5ba83fa1137/src/Particle.js#L406-L408 "Source code on GitHub")

Get details about the current user

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## setUserInfo

[src/Particle.js:418-426](https://github.com/spark/particle-api-js/blob/6bd9caa3857f308fb538601a987cb5ba83fa1137/src/Particle.js#L418-L426 "Source code on GitHub")

Set details on the current user

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.stripeToken` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Set user's stripe token for payment
    -   `$0.accountInfo` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Set user's extended info fields (name, business account, company name, etc)
    -   `$0.password` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Change authenticated user password
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## listBuildTargets

[src/Particle.js:446-452](https://github.com/spark/particle-api-js/blob/6bd9caa3857f308fb538601a987cb5ba83fa1137/src/Particle.js#L446-L452 "Source code on GitHub")

List valid build targets to be used for compiling

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token
    -   `$0.onlyFeatured` **\[[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)]** Only list featured build targets (optional, default `false`)

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## listLibraries

[src/Particle.js:475-486](https://github.com/spark/particle-api-js/blob/6bd9caa3857f308fb538601a987cb5ba83fa1137/src/Particle.js#L475-L486 "Source code on GitHub")

List firmware libraries

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token
    -   `$0.page` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** Page index (default, first page)
    -   `$0.limit` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** Number of items per page
    -   `$0.filter` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Search term for the libraries
    -   `$0.sort` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Ordering key for the library list
    -   `$0.architectures` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** List of architectures to filter
    -   `$0.category` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Category to filter
    -   `$0.category` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Category to filter
    -   `$0.scope` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The library scope to list. Default is 'all'. Other values are-   'all' - list public libraries and my private libraries
        -   'public' - list only public libraries
        -   'private' - list only my private libraries
        -   'mine' - list my libraries (public and private)
        -   'official' - list only official libraries
        -   'verified' - list only verified libraries
        -   'featured' - list only featured libraries
    -   `$0.excludeScopes` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** list of scopes to exclude

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## getLibrary

[src/Particle.js:499-501](https://github.com/spark/particle-api-js/blob/6bd9caa3857f308fb538601a987cb5ba83fa1137/src/Particle.js#L499-L501 "Source code on GitHub")

Get firmware library details

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token
    -   `$0.name` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Name of the library to fetch
    -   `$0.version` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Version of the library to fetch (default: latest)

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## getLibraryVersions

[src/Particle.js:511-516](https://github.com/spark/particle-api-js/blob/6bd9caa3857f308fb538601a987cb5ba83fa1137/src/Particle.js#L511-L516 "Source code on GitHub")

Firmware library details for each version

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token
    -   `$0.name` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Name of the library to fetch
    -   `$0.page` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** Page index (default, first page)
    -   `$0.limit` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** Number of items per page

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## contributeLibrary

[src/Particle.js:524-531](https://github.com/spark/particle-api-js/blob/6bd9caa3857f308fb538601a987cb5ba83fa1137/src/Particle.js#L524-L531 "Source code on GitHub")

Contribute a new library version int the compressed archive

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token
    -   `$0.archive` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Compressed archive file containing the library sources

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## deleteLibrary

[src/Particle.js:544-546](https://github.com/spark/particle-api-js/blob/6bd9caa3857f308fb538601a987cb5ba83fa1137/src/Particle.js#L544-L546 "Source code on GitHub")

Delete one version of a library or an entire published library

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token
    -   `$0.name` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Name of the library to delete
    -   `$0.force` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Key to force deleting a public library

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## downloadFile

[src/Particle.js:553-564](https://github.com/spark/particle-api-js/blob/6bd9caa3857f308fb538601a987cb5ba83fa1137/src/Particle.js#L553-L564 "Source code on GitHub")

Download an external file that may not be on the API

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.url` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** URL of the file.

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** Resolves to a buffer with the file data
