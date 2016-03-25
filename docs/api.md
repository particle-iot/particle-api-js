# callFunction

[src/Particle.js:258-262](https://github.com/spark/particle-api-js/blob/fcc35d0601f35e273ea09f4b37c3cfe1f8cb4f7e/src/Particle.js#L258-L262 "Source code on GitHub")

Call a device function

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.name` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Function name
    -   `$0.argument` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Function argument
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# claimDevice

[src/Particle.js:92-97](https://github.com/spark/particle-api-js/blob/fcc35d0601f35e273ea09f4b37c3cfe1f8cb4f7e/src/Particle.js#L92-L97 "Source code on GitHub")

Claim a device to the account. The device must be online and unclaimed.

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID
    -   `$0.requestTransfer`  
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# compileCode

[src/Particle.js:204-213](https://github.com/spark/particle-api-js/blob/fcc35d0601f35e273ea09f4b37c3cfe1f8cb4f7e/src/Particle.js#L204-L213 "Source code on GitHub")

Compile firmware using the Particle Cloud

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.files` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Object containing files to be compiled. Keys should be the filenames, and the values should be a path or Buffer of the file contents.
    -   `$0.platformId` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)=** Platform id number of the device you are compiling for. Common values are 0=Core, 6=Photon, 10=Electron.
    -   `$0.targetVersion` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)=** System firmware version to compile against (optional, default `latest`)
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# createUser

[src/Particle.js:38-42](https://github.com/spark/particle-api-js/blob/fcc35d0601f35e273ea09f4b37c3cfe1f8cb4f7e/src/Particle.js#L38-L42 "Source code on GitHub")

Create a user account for the Particle Cloud

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.username` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Desired username
    -   `$0.password` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Password

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# createWebhook

[src/Particle.js:331-339](https://github.com/spark/particle-api-js/blob/fcc35d0601f35e273ea09f4b37c3cfe1f8cb4f7e/src/Particle.js#L331-L339 "Source code on GitHub")

Create a webhook

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.name` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Webhook name
    -   `$0.url` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** URL the webhook should hit
    -   `$0.requestType` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)=** HTTP method to use (optional, default `POST`)
    -   `$0.headers` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)=** Additional headers to add to the webhook
    -   `$0.json` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)=** JSON data
    -   `$0.query` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)=** Query string data
    -   `$0.rejectUnauthorized` **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)=** Reject invalid HTTPS certificates
    -   `$0.webhookAuth` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)=** HTTP Basic Auth information
    -   `$0.form` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)=** Form data
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# deleteWebhook

[src/Particle.js:347-349](https://github.com/spark/particle-api-js/blob/fcc35d0601f35e273ea09f4b37c3cfe1f8cb4f7e/src/Particle.js#L347-L349 "Source code on GitHub")

Delete a webhook

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.hookId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Webhook ID
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# downloadFirmwareBinary

[src/Particle.js:221-230](https://github.com/spark/particle-api-js/blob/fcc35d0601f35e273ea09f4b37c3cfe1f8cb4f7e/src/Particle.js#L221-L230 "Source code on GitHub")

Download a firmware binary

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.binaryId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Binary ID received from a successful compile call
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Request](https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/request)** 

# flashDevice

[src/Particle.js:173-182](https://github.com/spark/particle-api-js/blob/fcc35d0601f35e273ea09f4b37c3cfe1f8cb4f7e/src/Particle.js#L173-L182 "Source code on GitHub")

Compile and flash application firmware to a device

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.files` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Object containing files to be compiled. Keys should be the filenames, and the values should be a path or Buffer of the file contents.
    -   `$0.targetVersion` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)=** System firmware version to compile against (optional, default `latest`)
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** String

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# flashTinker

[src/Particle.js:190-194](https://github.com/spark/particle-api-js/blob/fcc35d0601f35e273ea09f4b37c3cfe1f8cb4f7e/src/Particle.js#L190-L194 "Source code on GitHub")

Flash the Tinker application to a device

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# getClaimCode

[src/Particle.js:126-128](https://github.com/spark/particle-api-js/blob/fcc35d0601f35e273ea09f4b37c3cfe1f8cb4f7e/src/Particle.js#L126-L128 "Source code on GitHub")

Generate a claim code to use in the device claiming process.

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token
    -   `$0.iccid` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)=** ICCID of the SIM card used in the Electron

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# getDevice

[src/Particle.js:82-84](https://github.com/spark/particle-api-js/blob/fcc35d0601f35e273ea09f4b37c3cfe1f8cb4f7e/src/Particle.js#L82-L84 "Source code on GitHub")

Get detailed informationa about a device

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# getEventStream

[src/Particle.js:274-298](https://github.com/spark/particle-api-js/blob/fcc35d0601f35e273ea09f4b37c3cfe1f8cb4f7e/src/Particle.js#L274-L298 "Source code on GitHub")

Get a stream of events

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)=** Device ID or Name, or `mine` to indicate only your devices.
    -   `$0.name` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)=** Event Name
    -   `$0.org` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)=** Organization Slug
    -   `$0.product` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)=** Product Slug
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** If the promise resolves, the resolution value will be an EventStream object that will
emit 'event' events, as well as the specific named event.

# getUserInfo

[src/Particle.js:365-367](https://github.com/spark/particle-api-js/blob/fcc35d0601f35e273ea09f4b37c3cfe1f8cb4f7e/src/Particle.js#L365-L367 "Source code on GitHub")

Get details about the current user

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# getVariable

[src/Particle.js:148-150](https://github.com/spark/particle-api-js/blob/fcc35d0601f35e273ea09f4b37c3cfe1f8cb4f7e/src/Particle.js#L148-L150 "Source code on GitHub")

Get the value of a device variable

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.name` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Variable name
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# listAccessTokens

[src/Particle.js:63-65](https://github.com/spark/particle-api-js/blob/fcc35d0601f35e273ea09f4b37c3cfe1f8cb4f7e/src/Particle.js#L63-L65 "Source code on GitHub")

List all valid access tokens for a Particle Cloud account

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.username` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Username
    -   `$0.password` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Password

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# listBuildTargets

[src/Particle.js:393-399](https://github.com/spark/particle-api-js/blob/fcc35d0601f35e273ea09f4b37c3cfe1f8cb4f7e/src/Particle.js#L393-L399 "Source code on GitHub")

List valid build targets to be used for compiling

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token
    -   `$0.onlyFeatured` **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)=** Only list featured build targets (optional, default `false`)

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# listDevices

[src/Particle.js:72-74](https://github.com/spark/particle-api-js/blob/fcc35d0601f35e273ea09f4b37c3cfe1f8cb4f7e/src/Particle.js#L72-L74 "Source code on GitHub")

List devices claimed to the account

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# listWebhooks

[src/Particle.js:356-358](https://github.com/spark/particle-api-js/blob/fcc35d0601f35e273ea09f4b37c3cfe1f8cb4f7e/src/Particle.js#L356-L358 "Source code on GitHub")

List all webhooks owned by the account

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# login

[src/Particle.js:21-30](https://github.com/spark/particle-api-js/blob/fcc35d0601f35e273ea09f4b37c3cfe1f8cb4f7e/src/Particle.js#L21-L30 "Source code on GitHub")

Login to Particle Cloud using an existing Particle acccount.

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.username` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Username for the Particle account
    -   `$0.password` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Password for the Particle account
    -   `$0.tokenDuration` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)=(default this.tokenDuration)** How long the access token should last in seconds

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# publishEvent

[src/Particle.js:308-314](https://github.com/spark/particle-api-js/blob/fcc35d0601f35e273ea09f4b37c3cfe1f8cb4f7e/src/Particle.js#L308-L314 "Source code on GitHub")

Publish a event to the Particle Cloud

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.name` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Event name
    -   `$0.data` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Event data
    -   `$0.isPrivate` **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Should the event be publicly available?
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# removeAccessToken

[src/Particle.js:51-55](https://github.com/spark/particle-api-js/blob/fcc35d0601f35e273ea09f4b37c3cfe1f8cb4f7e/src/Particle.js#L51-L55 "Source code on GitHub")

Revoke an access token

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.username` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Username of the Particle cloud account that the token belongs to.
    -   `$0.password` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Password for the account
    -   `$0.token` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access token you wish to revoke

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# removeDevice

[src/Particle.js:105-107](https://github.com/spark/particle-api-js/blob/fcc35d0601f35e273ea09f4b37c3cfe1f8cb4f7e/src/Particle.js#L105-L107 "Source code on GitHub")

Unclaim / Remove a device from your account

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# renameDevice

[src/Particle.js:116-118](https://github.com/spark/particle-api-js/blob/fcc35d0601f35e273ea09f4b37c3cfe1f8cb4f7e/src/Particle.js#L116-L118 "Source code on GitHub")

Rename a device

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.name` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Desired Name
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# sendPublicKey

[src/Particle.js:240-248](https://github.com/spark/particle-api-js/blob/fcc35d0601f35e273ea09f4b37c3cfe1f8cb4f7e/src/Particle.js#L240-L248 "Source code on GitHub")

Send a new device public key to the Particle Cloud

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.key` **([String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)\|[Buffer](https://nodejs.org/api/buffer.html))** Public key contents
    -   `$0.algorithm` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)=** Algorithm used to generate the public key. Valid values are `rsa` or `ecc`. (optional, default `rsa`)
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# signalDevice

[src/Particle.js:159-163](https://github.com/spark/particle-api-js/blob/fcc35d0601f35e273ea09f4b37c3cfe1f8cb4f7e/src/Particle.js#L159-L163 "Source code on GitHub")

Instruct the device to turn on/off the LED in a rainbow pattern

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.signal` **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Signal on or off
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 
