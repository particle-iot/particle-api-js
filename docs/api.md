# callFunction

[src/Particle.js:239-243](https://github.com/spark/particle-api-js/blob/d7c87e5131a468c2a7577f123303ea5584a72992/src/Particle.js#L239-L243 "Source code on GitHub")

Call a device function

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.name` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Function name
    -   `$0.argument` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Function argument
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# claimDevice

[src/Particle.js:91-95](https://github.com/spark/particle-api-js/blob/d7c87e5131a468c2a7577f123303ea5584a72992/src/Particle.js#L91-L95 "Source code on GitHub")

Claim a device to the account. The device must be online and unclaimed.

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# compileCode

[src/Particle.js:202-211](https://github.com/spark/particle-api-js/blob/d7c87e5131a468c2a7577f123303ea5584a72992/src/Particle.js#L202-L211 "Source code on GitHub")

Compile firmware using the Particle Cloud

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.files` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Object containing files to be compiled. Keys should be the filenames, and the values should be a path or Buffer of the file contents.
    -   `$0.platformId` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)=** Platform id number of the device you are compiling for. Common values are 0=Core, 6=Photon, 10=Electron.
    -   `$0.targetVersion` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)=** System firmware version to compile against (optional, default `latest`)
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# createUser

[src/Particle.js:37-41](https://github.com/spark/particle-api-js/blob/d7c87e5131a468c2a7577f123303ea5584a72992/src/Particle.js#L37-L41 "Source code on GitHub")

Create a user account for the Particle Cloud

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.username` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Desired username
    -   `$0.password` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Password

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# createWebhook

[src/Particle.js:300-308](https://github.com/spark/particle-api-js/blob/d7c87e5131a468c2a7577f123303ea5584a72992/src/Particle.js#L300-L308 "Source code on GitHub")

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

[src/Particle.js:316-318](https://github.com/spark/particle-api-js/blob/d7c87e5131a468c2a7577f123303ea5584a72992/src/Particle.js#L316-L318 "Source code on GitHub")

Delete a webhook

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.hookId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Webhook ID
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# flashDevice

[src/Particle.js:171-180](https://github.com/spark/particle-api-js/blob/d7c87e5131a468c2a7577f123303ea5584a72992/src/Particle.js#L171-L180 "Source code on GitHub")

Compile and flash application firmware to a device

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.files` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Object containing files to be compiled. Keys should be the filenames, and the values should be a path or Buffer of the file contents.
    -   `$0.targetVersion` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)=** System firmware version to compile against (optional, default `latest`)
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** String

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# flashTinker

[src/Particle.js:188-192](https://github.com/spark/particle-api-js/blob/d7c87e5131a468c2a7577f123303ea5584a72992/src/Particle.js#L188-L192 "Source code on GitHub")

Flash the Tinker application to a device

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# getClaimCode

[src/Particle.js:124-126](https://github.com/spark/particle-api-js/blob/d7c87e5131a468c2a7577f123303ea5584a72992/src/Particle.js#L124-L126 "Source code on GitHub")

Generate a claim code to use in the device claiming process.

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token
    -   `$0.iccid` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)=** ICCID of the SIM card used in the Electron

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# getDevice

[src/Particle.js:81-83](https://github.com/spark/particle-api-js/blob/d7c87e5131a468c2a7577f123303ea5584a72992/src/Particle.js#L81-L83 "Source code on GitHub")

Get detailed informationa about a device

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# getEventStream

[src/Particle.js:252-267](https://github.com/spark/particle-api-js/blob/d7c87e5131a468c2a7577f123303ea5584a72992/src/Particle.js#L252-L267 "Source code on GitHub")

Get a stream of events

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)=** Device ID or Name, or `mine` to indicate only your devices.
    -   `$0.name` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)=** Event Name
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# getUserInfo

[src/Particle.js:334-336](https://github.com/spark/particle-api-js/blob/d7c87e5131a468c2a7577f123303ea5584a72992/src/Particle.js#L334-L336 "Source code on GitHub")

Get details about the current user

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# getVariable

[src/Particle.js:146-148](https://github.com/spark/particle-api-js/blob/d7c87e5131a468c2a7577f123303ea5584a72992/src/Particle.js#L146-L148 "Source code on GitHub")

Get the value of a device variable

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.name` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Variable name
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# listAccessTokens

[src/Particle.js:62-64](https://github.com/spark/particle-api-js/blob/d7c87e5131a468c2a7577f123303ea5584a72992/src/Particle.js#L62-L64 "Source code on GitHub")

List all valid access tokens for a Particle Cloud account

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.username` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Username
    -   `$0.password` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Password

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# listBuildTargets

[src/Particle.js:362-368](https://github.com/spark/particle-api-js/blob/d7c87e5131a468c2a7577f123303ea5584a72992/src/Particle.js#L362-L368 "Source code on GitHub")

List valid build targets to be used for compiling

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token
    -   `$0.onlyFeatured` **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)=** Only list featured build targets (optional, default `false`)

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# listDevices

[src/Particle.js:71-73](https://github.com/spark/particle-api-js/blob/d7c87e5131a468c2a7577f123303ea5584a72992/src/Particle.js#L71-L73 "Source code on GitHub")

List devices claimed to the account

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# listWebhooks

[src/Particle.js:325-327](https://github.com/spark/particle-api-js/blob/d7c87e5131a468c2a7577f123303ea5584a72992/src/Particle.js#L325-L327 "Source code on GitHub")

List all webhooks owned by the account

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# login

[src/Particle.js:20-29](https://github.com/spark/particle-api-js/blob/d7c87e5131a468c2a7577f123303ea5584a72992/src/Particle.js#L20-L29 "Source code on GitHub")

Login to Particle Cloud using an existing Particle acccount.

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.username` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Username for the Particle account
    -   `$0.password` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Password for the Particle account
    -   `$0.tokenDuration` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)=(default this.tokenDuration)** How long the access token should last in seconds

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# publishEvent

[src/Particle.js:277-283](https://github.com/spark/particle-api-js/blob/d7c87e5131a468c2a7577f123303ea5584a72992/src/Particle.js#L277-L283 "Source code on GitHub")

Publish a event to the Particle Cloud

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.name` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Event name
    -   `$0.data` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Event data
    -   `$0.isPrivate` **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Should the event be publicly available?
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# removeAccessToken

[src/Particle.js:50-54](https://github.com/spark/particle-api-js/blob/d7c87e5131a468c2a7577f123303ea5584a72992/src/Particle.js#L50-L54 "Source code on GitHub")

Revoke an access token

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.username` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Username of the Particle cloud account that the token belongs to.
    -   `$0.password` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Password for the account
    -   `$0.token` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access token you wish to revoke

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# removeDevice

[src/Particle.js:103-105](https://github.com/spark/particle-api-js/blob/d7c87e5131a468c2a7577f123303ea5584a72992/src/Particle.js#L103-L105 "Source code on GitHub")

Unclaim / Remove a device from your account

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# renameDevice

[src/Particle.js:114-116](https://github.com/spark/particle-api-js/blob/d7c87e5131a468c2a7577f123303ea5584a72992/src/Particle.js#L114-L116 "Source code on GitHub")

Rename a device

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.name` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Desired Name
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# sendPublicKey

[src/Particle.js:221-229](https://github.com/spark/particle-api-js/blob/d7c87e5131a468c2a7577f123303ea5584a72992/src/Particle.js#L221-L229 "Source code on GitHub")

Send a new device public key to the Particle Cloud

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.key` **([String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)\|[Buffer](https://nodejs.org/api/buffer.html))** Public key contents
    -   `$0.algorithm` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)=** Algorithm used to generate the public key. Valid values are `rsa` or `ecc`. (optional, default `rsa`)
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# signalDevice

[src/Particle.js:157-161](https://github.com/spark/particle-api-js/blob/d7c87e5131a468c2a7577f123303ea5584a72992/src/Particle.js#L157-L161 "Source code on GitHub")

Instruct the device to turn on/off the LED in a rainbow pattern

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.deviceId` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Device ID or Name
    -   `$0.signal` **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Signal on or off
    -   `$0.auth` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Access Token

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 
