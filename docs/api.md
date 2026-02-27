### Table of Contents

-   [Particle](#particle)
    -   [constructor](#constructor)
    -   [login](#login)
    -   [sendOtp](#sendotp)
    -   [enableMfa](#enablemfa)
    -   [confirmMfa](#confirmmfa)
    -   [disableMfa](#disablemfa)
    -   [createCustomer](#createcustomer)
    -   [loginAsClientOwner](#loginasclientowner)
    -   [createUser](#createuser)
    -   [resetPassword](#resetpassword)
    -   [deleteAccessToken](#deleteaccesstoken)
    -   [deleteCurrentAccessToken](#deletecurrentaccesstoken)
    -   [deleteActiveAccessTokens](#deleteactiveaccesstokens)
    -   [deleteUser](#deleteuser)
    -   [trackingIdentity](#trackingidentity)
    -   [listDevices](#listdevices)
    -   [getDevice](#getdevice)
    -   [claimDevice](#claimdevice)
    -   [addDeviceToProduct](#adddevicetoproduct)
    -   [removeDevice](#removedevice)
    -   [removeDeviceOwner](#removedeviceowner)
    -   [renameDevice](#renamedevice)
    -   [signalDevice](#signaldevice)
    -   [setDeviceNotes](#setdevicenotes)
    -   [markAsDevelopmentDevice](#markasdevelopmentdevice)
    -   [lockDeviceProductFirmware](#lockdeviceproductfirmware)
    -   [unlockDeviceProductFirmware](#unlockdeviceproductfirmware)
    -   [updateDevice](#updatedevice)
    -   [unprotectDevice](#unprotectdevice)
    -   [provisionDevice](#provisiondevice)
    -   [getClaimCode](#getclaimcode)
    -   [getVariable](#getvariable)
    -   [flashDevice](#flashdevice)
    -   [compileCode](#compilecode)
    -   [downloadFirmwareBinary](#downloadfirmwarebinary)
    -   [sendPublicKey](#sendpublickey)
    -   [callFunction](#callfunction)
    -   [getEventStream](#geteventstream)
    -   [publishEvent](#publishevent)
    -   [Hook](#hook)
    -   [createWebhook](#createwebhook)
    -   [deleteWebhook](#deletewebhook)
    -   [listWebhooks](#listwebhooks)
    -   [createIntegration](#createintegration)
    -   [editIntegration](#editintegration)
    -   [deleteIntegration](#deleteintegration)
    -   [listIntegrations](#listintegrations)
    -   [getUserInfo](#getuserinfo)
    -   [setUserInfo](#setuserinfo)
    -   [changeUsername](#changeusername)
    -   [changeUserPassword](#changeuserpassword)
    -   [listSIMs](#listsims)
    -   [getSIMDataUsage](#getsimdatausage)
    -   [getFleetDataUsage](#getfleetdatausage)
    -   [checkSIM](#checksim)
    -   [activateSIM](#activatesim)
    -   [deactivateSIM](#deactivatesim)
    -   [reactivateSIM](#reactivatesim)
    -   [updateSIM](#updatesim)
    -   [removeSIM](#removesim)
    -   [listBuildTargets](#listbuildtargets)
    -   [listLibraries](#listlibraries)
    -   [getLibrary](#getlibrary)
    -   [getLibraryVersions](#getlibraryversions)
    -   [contributeLibrary](#contributelibrary)
    -   [publishLibrary](#publishlibrary)
    -   [deleteLibrary](#deletelibrary)
    -   [downloadFile](#downloadfile)
    -   [listOAuthClients](#listoauthclients)
    -   [createOAuthClient](#createoauthclient)
    -   [updateOAuthClient](#updateoauthclient)
    -   [deleteOAuthClient](#deleteoauthclient)
    -   [listProducts](#listproducts)
    -   [getProduct](#getproduct)
    -   [listProductFirmware](#listproductfirmware)
    -   [uploadProductFirmware](#uploadproductfirmware)
    -   [getProductFirmware](#getproductfirmware)
    -   [updateProductFirmware](#updateproductfirmware)
    -   [downloadProductFirmware](#downloadproductfirmware)
    -   [downloadManufacturingBackup](#downloadmanufacturingbackup)
    -   [releaseProductFirmware](#releaseproductfirmware)
    -   [listTeamMembers](#listteammembers)
    -   [inviteTeamMember](#inviteteammember)
    -   [removeTeamMember](#removeteammember)
    -   [lookupSerialNumber](#lookupserialnumber)
    -   [createMeshNetwork](#createmeshnetwork)
    -   [removeMeshNetwork](#removemeshnetwork)
    -   [listMeshNetworks](#listmeshnetworks)
    -   [getMeshNetwork](#getmeshnetwork)
    -   [updateMeshNetwork](#updatemeshnetwork)
    -   [addMeshNetworkDevice](#addmeshnetworkdevice)
    -   [removeMeshNetworkDevice](#removemeshnetworkdevice)
    -   [listMeshNetworkDevices](#listmeshnetworkdevices)
    -   [getProductConfiguration](#getproductconfiguration)
    -   [getProductConfigurationSchema](#getproductconfigurationschema)
    -   [getProductDeviceConfiguration](#getproductdeviceconfiguration)
    -   [getProductDeviceConfigurationSchema](#getproductdeviceconfigurationschema)
    -   [setProductConfiguration](#setproductconfiguration)
    -   [setProductDeviceConfiguration](#setproductdeviceconfiguration)
    -   [getProductLocations](#getproductlocations)
    -   [getProductDeviceLocations](#getproductdevicelocations)
    -   [executeLogic](#executelogic)
    -   [createLogicFunction](#createlogicfunction)
    -   [getLogicFunction](#getlogicfunction)
    -   [updateLogicFunction](#updatelogicfunction)
    -   [deleteLogicFunction](#deletelogicfunction)
    -   [listLogicFunctions](#listlogicfunctions)
    -   [listLogicRuns](#listlogicruns)
    -   [getLogicRun](#getlogicrun)
    -   [getLogicRunLogs](#getlogicrunlogs)
    -   [createLedger](#createledger)
    -   [getLedger](#getledger)
    -   [updateLedger](#updateledger)
    -   [archiveLedger](#archiveledger)
    -   [Scope](#scope)
    -   [listLedgers](#listledgers)
    -   [getLedgerInstance](#getledgerinstance)
    -   [SetMode](#setmode)
    -   [setLedgerInstance](#setledgerinstance)
    -   [deleteLedgerInstance](#deleteledgerinstance)
    -   [listLedgerInstances](#listledgerinstances)
    -   [listLedgerInstanceVersions](#listledgerinstanceversions)
    -   [getLedgerInstanceVersion](#getledgerinstanceversion)
    -   [listDeviceOsVersions](#listdeviceosversions)
    -   [getDeviceOsVersion](#getdeviceosversion)
    -   [setDefaultAuth](#setdefaultauth)
    -   [get](#get)
    -   [head](#head)
    -   [post](#post)
    -   [put](#put)
    -   [delete](#delete)
    -   [request](#request)

## Particle

Defined in: [Particle.ts:52](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L52)

Particle Cloud API wrapper.

See <https://docs.particle.io/reference/javascript/> for examples
of using the `Particle` class.

Most Particle methods take a single unnamed argument object documented as
`options` with key/value pairs for each option.

### constructor

Defined in: [Particle.ts:74](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L74)

Contructor for the Cloud API wrapper.

Create a new Particle object and call methods below on it.

**Parameters**

-   `options?` Options for this API call Options to be used for all requests (see [Defaults](../src/Defaults.js))
    -   `baseUrl?` **`string`**
    -   `clientId?` **`string`**
    -   `clientSecret?` **`string`**
    -   `tokenDuration?` **`number`**
    -   `auth?` **`string`** The access token. If not specified here, will have to be added to every request

Returns **`Particle`**

### login

Defined in: [Particle.ts:130](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L130)

Login to Particle Cloud using an existing Particle acccount.

**Parameters**

-   `options` **`LoginOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### sendOtp

Defined in: [Particle.ts:156](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L156)

If login failed with an 'mfa_required' error, this must be called with a valid OTP code to login

**Parameters**

-   `options` **`SendOtpOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### enableMfa

Defined in: [Particle.ts:180](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L180)

Enable MFA on the currently logged in user

**Parameters**

-   `options` **`EnableMfaOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### confirmMfa

Defined in: [Particle.ts:195](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L195)

Confirm MFA for the user. This must be called with current TOTP code, determined from the results of enableMfa(). You will be prompted to enter an OTP code every time you login after enrollment is confirmed.

**Parameters**

-   `options` **`ConfirmMfaOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### disableMfa

Defined in: [Particle.ts:220](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L220)

Disable MFA for the user.

**Parameters**

-   `options` **`DisableMfaOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### createCustomer

Defined in: [Particle.ts:240](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L240)

Create Customer for Product.

**Parameters**

-   `options` **`CreateCustomerOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### loginAsClientOwner

Defined in: [Particle.ts:263](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L263)

Login to Particle Cloud using an OAuth client.

**Parameters**

-   `options?` **`LoginAsClientOwnerOptions` = `{}`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### createUser

Defined in: [Particle.ts:288](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L288)

Create a user account for the Particle Cloud

**Parameters**

-   `options` Options for this API call
    -   `username` **`string`** Email of the new user
    -   `password` **`string`** Password
    -   `accountInfo?` **`Record`<`string`, `string` \| `number` \| `boolean`>** Object that contains account information fields such as user real name, company name, business account flag etc
    -   `utm?` **`Record`<`string`, `string`>** Object that contains info about the campaign that lead to this user creation
    -   `headers?` **`Record`<`string`, `string`>** Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
    -   `context?` **\{ `tool?`: `ToolContext`; `project?`: `ProjectContext`; \}** Request context
        -   `context.tool?` **`ToolContext`**
        -   `context.project?` **`ProjectContext`**

Returns **`Promise`<`RequestResponse`>** A promise

### resetPassword

Defined in: [Particle.ts:310](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L310)

Send reset password email for a Particle Cloud user account

**Parameters**

-   `options` **`ResetPasswordOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### deleteAccessToken

Defined in: [Particle.ts:327](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L327)

Revoke an access token

**Parameters**

-   `options` **`DeleteAccessTokenOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### deleteCurrentAccessToken

Defined in: [Particle.ts:343](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L343)

Revoke the current session access token

**Parameters**

-   `options` **`DeleteCurrentAccessTokenOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### deleteActiveAccessTokens

Defined in: [Particle.ts:360](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L360)

Revoke all active access tokens

**Parameters**

-   `options` **`DeleteActiveAccessTokensOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### deleteUser

Defined in: [Particle.ts:378](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L378)

Delete the current user

**Parameters**

-   `options` **`DeleteUserOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### trackingIdentity

Defined in: [Particle.ts:398](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L398)

Retrieves the information that is used to identify the current login for tracking.

**Parameters**

-   `options?` **`TrackingIdentityOptions` = `{}`** Options for this API call

Returns **`Promise`<`RequestResponse`>** Resolve the tracking identify of the current login

### listDevices

Defined in: [Particle.ts:424](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L424)

List devices claimed to the account or product

**Parameters**

-   `options` Options for this API call
    -   `deviceId?` **`string`** (Product only) Filter results to devices with this ID (partial matching)
    -   `deviceName?` **`string`** (Product only) Filter results to devices with this name (partial matching)
    -   `groups?` **`string`[]** (Product only) A list of full group names to filter results to devices belonging to these groups only.
    -   `sortAttr?` **`string`** (Product only) The attribute by which to sort results. See API docs for options.
    -   `sortDir?` **`string`** (Product only) The direction of sorting. See API docs for options.
    -   `page?` **`number`** (Product only) Current page of results
    -   `perPage?` **`number`** (Product only) Records per page
    -   `product?` **`string` \| `number`** List devices in this product ID or slug
    -   `auth?` **`string`** The access token. Can be ignored if provided in constructor
    -   `headers?` **`Record`<`string`, `string`>** Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
    -   `context?` **\{ `tool?`: `ToolContext`; `project?`: `ProjectContext`; \}** Request context
        -   `context.tool?` **`ToolContext`**
        -   `context.project?` **`ProjectContext`**

Returns **`Promise`<`RequestResponse`>** A promise

### getDevice

Defined in: [Particle.ts:456](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L456)

Get detailed informationa about a device

**Parameters**

-   `options` **`GetDeviceOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### claimDevice

Defined in: [Particle.ts:471](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L471)

Claim a device to the account. The device must be online and unclaimed.

**Parameters**

-   `options` **`ClaimDeviceOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### addDeviceToProduct

Defined in: [Particle.ts:496](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L496)

Add a device to a product or move device out of quarantine.

**Parameters**

-   `options` **`AddDeviceToProductOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### removeDevice

Defined in: [Particle.ts:528](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L528)

Unclaim / Remove a device from your account or product, or deny quarantine

**Parameters**

-   `options` **`RemoveDeviceOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### removeDeviceOwner

Defined in: [Particle.ts:544](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L544)

Unclaim a product device its the owner, but keep it in the product

**Parameters**

-   `options` **`RemoveDeviceOwnerOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### renameDevice

Defined in: [Particle.ts:560](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L560)

Rename a device

**Parameters**

-   `options` **`RenameDeviceOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### signalDevice

Defined in: [Particle.ts:575](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L575)

Instruct the device to turn on/off the LED in a rainbow pattern

**Parameters**

-   `options` **`SignalDeviceOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### setDeviceNotes

Defined in: [Particle.ts:590](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L590)

Store some notes about device

**Parameters**

-   `options` Options for this API call
    -   `deviceId` **`string`** Device ID or Name
    -   `notes` **`string`** Your notes about this device
    -   `product?` **`string` \| `number`** Device in this product ID or slug
    -   `auth?` **`string`** The access token. Can be ignored if provided in constructor
    -   `headers?` **`Record`<`string`, `string`>** Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
    -   `context?` **\{ `tool?`: `ToolContext`; `project?`: `ProjectContext`; \}** Request context
        -   `context.tool?` **`ToolContext`**
        -   `context.project?` **`ProjectContext`**

Returns **`Promise`<`RequestResponse`>** A promise

### markAsDevelopmentDevice

Defined in: [Particle.ts:605](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L605)

Mark device as being used in development of a product so it opts out of automatic firmware updates

**Parameters**

-   `options` Options for this API call
    -   `deviceId` **`string`** Device ID or Name
    -   `development?` **`boolean` = `true`** Set to true to mark as development, false to return to product fleet
    -   `product` **`string` \| `number`** Device in this product ID or slug
    -   `auth?` **`string`** The access token. Can be ignored if provided in constructor
    -   `headers?` **`Record`<`string`, `string`>** Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
    -   `context?` **\{ `tool?`: `ToolContext`; `project?`: `ProjectContext`; \}** Request context
        -   `context.tool?` **`ToolContext`**
        -   `context.project?` **`ProjectContext`**

Returns **`Promise`<`RequestResponse`>** A promise

### lockDeviceProductFirmware

Defined in: [Particle.ts:621](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L621)

Mark device as being used in development of a product, so it opts out of automatic firmware updates

**Parameters**

-   `options` Options for this API call
    -   `deviceId` **`string`** Device ID or Name
    -   `desiredFirmwareVersion` **`number`** Lock the product device to run this firmware version.
    -   `flash?` **`boolean`** Immediately flash firmware indicated by desiredFirmwareVersion
    -   `product` **`string` \| `number`** Device in this product ID or slug
    -   `auth?` **`string`** The access token. Can be ignored if provided in constructor
    -   `headers?` **`Record`<`string`, `string`>** Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
    -   `context?` **\{ `tool?`: `ToolContext`; `project?`: `ProjectContext`; \}** Request context
        -   `context.tool?` **`ToolContext`**
        -   `context.project?` **`ProjectContext`**

Returns **`Promise`<`RequestResponse`>** A promise

### unlockDeviceProductFirmware

Defined in: [Particle.ts:635](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L635)

Mark device as receiving automatic firmware updates

**Parameters**

-   `options` Options for this API call
    -   `deviceId` **`string`** Device ID or Name
    -   `product` **`string` \| `number`** Device in this product ID or slug
    -   `auth?` **`string`** The access token. Can be ignored if provided in constructor
    -   `headers?` **`Record`<`string`, `string`>** Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
    -   `context?` **\{ `tool?`: `ToolContext`; `project?`: `ProjectContext`; \}** Request context
        -   `context.tool?` **`ToolContext`**
        -   `context.project?` **`ProjectContext`**

Returns **`Promise`<`RequestResponse`>** A promise

### updateDevice

Defined in: [Particle.ts:656](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L656)

Update multiple device attributes at the same time

**Parameters**

-   `options` **`UpdateDeviceOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### unprotectDevice

Defined in: [Particle.ts:688](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L688)

Disable device protection.

**Parameters**

-   `options` **`UnprotectDeviceOptions`** Options for this API call.

Returns **`Promise`<`RequestResponse`>** A promise

### provisionDevice

Defined in: [Particle.ts:715](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L715)

Provision a new device for products that allow self-provisioning

**Parameters**

-   `options` **`ProvisionDeviceOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### getClaimCode

Defined in: [Particle.ts:737](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L737)

Generate a claim code to use in the device claiming process.
To generate a claim code for a product, the access token MUST belong to a
customer of the product.

**Parameters**

-   `options` **`GetClaimCodeOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### getVariable

Defined in: [Particle.ts:753](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L753)

Get the value of a device variable

**Parameters**

-   `options` **`GetVariableOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### flashDevice

Defined in: [Particle.ts:773](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L773)

Compile and flash application firmware to a device. Pass a pre-compiled binary to flash it directly to the device.

**Parameters**

-   `options` **`FlashDeviceOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### compileCode

Defined in: [Particle.ts:797](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L797)

Compile firmware using the Particle Cloud

**Parameters**

-   `options` **`CompileCodeOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### downloadFirmwareBinary

Defined in: [Particle.ts:826](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L826)

Download a firmware binary

**Parameters**

-   `options` **`DownloadFirmwareBinaryOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### sendPublicKey

Defined in: [Particle.ts:848](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L848)

Send a new device public key to the Particle Cloud

**Parameters**

-   `options` Options for this API call
    -   `deviceId` **`string`** Device ID or Name
    -   `key` **`string` \| `Buffer`** Public key contents
    -   `algorithm?` **`string`** Algorithm used to generate the public key. Valid values are `rsa` or `ecc`.
    -   `auth?` **`string`** The access token. Can be ignored if provided in constructor
    -   `headers?` **`Record`<`string`, `string`>** Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
    -   `context?` **\{ `tool?`: `ToolContext`; `project?`: `ProjectContext`; \}** Request context
        -   `context.tool?` **`ToolContext`**
        -   `context.project?` **`ProjectContext`**

Returns **`Promise`<`RequestResponse`>** A promise

### callFunction

Defined in: [Particle.ts:876](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L876)

Call a device function

**Parameters**

-   `options` **`CallFunctionOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### getEventStream

Defined in: [Particle.ts:894](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L894)

Get a stream of events

**Parameters**

-   `options` **`GetEventStreamOptions`** Options for this API call

Returns **`Promise`<`EventStream`>** If the promise resolves, the resolution value will be an EventStream object that will emit 'event' events.

### publishEvent

Defined in: [Particle.ts:933](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L933)

Publish a event to the Particle Cloud

**Parameters**

-   `options` Options for this API call
    -   `name` **`string`** Event name
    -   `data?` **`string`** Event data
    -   `isPrivate?` **`boolean`** Should the event be publicly available?
    -   `product?` **`string` \| `number`** Event for this product ID or slug
    -   `auth?` **`string`** The access token. Can be ignored if provided in constructor
    -   `headers?` **`Record`<`string`, `string`>** Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
    -   `context?` **\{ `tool?`: `ToolContext`; `project?`: `ProjectContext`; \}** Request context
        -   `context.tool?` **`ToolContext`**
        -   `context.project?` **`ProjectContext`**

Returns **`Promise`<`RequestResponse`>** A promise

### Hook

Defined in: [Particle.ts:940](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L940)

Type: `Object`

**Properties**

-   `method` **`string`** (optional, default `POST`) Type of web request triggered by the Webhook (GET, POST, PUT, or DELETE)
-   `auth` **`object`** (optional) Auth data like `{ user: 'me', pass: '1234' }` for basic auth or `{ bearer: 'token' }` to send with the Webhook request
-   `headers` **`object`** (optional) Additional headers to add to the Webhook like `{ 'X-ONE': '1', X-TWO: '2' }`
-   `query` **`object`** (optional) Query params to add to the Webhook request like `{ foo: 'foo', bar: 'bar' }`
-   `json` **`object`** (optional) JSON data to send with the Webhook request - sets `Content-Type` to `application/json`
-   `form` **`object`** (optional) Form data to send with the Webhook request - sets `Content-Type` to `application/x-www-form-urlencoded`
-   `body` **`string`** (optional) Custom body to send with the Webhook request
-   `responseTemplate` **`object`** (optional) Template to use to customize the Webhook response body
-   `responseEvent` **`object`** (optional) The Webhook response event name that your devices can subscribe to
-   `errorResponseEvent` **`object`** (optional) The Webhook error response event name that your devices can subscribe to

### createWebhook

Defined in: [Particle.ts:968](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L968)

Create a webhook

**Parameters**

-   `options` Options for this API call
    -   `event` **`string`** The name of the Particle event that should trigger the Webhook
    -   `url` **`string`** The web address that will be targeted when the Webhook is triggered
    -   `device?` **`string`** Trigger Webhook only for this device ID or Name
    -   `rejectUnauthorized?` **`boolean`** Set to `false` to skip SSL certificate validation of the target URL
    -   `noDefaults?` **`boolean`** Don't include default event data in the webhook request
    -   `hook?` **\{ `method?`: `string`; `auth?`: `Record`<`string`, `string`>; `headers?`: `Record`<`string`, `string`>; `query?`: `Record`<`string`, `string`>; `json?`: `object`; `form?`: `object`; `body?`: `string`; `responseTemplate?`: `string`; `responseEvent?`: `string`; `errorResponseEvent?`: `string`; \}** Webhook configuration settings
        -   `hook.method?` **`string`**
        -   `hook.auth?` **`Record`<`string`, `string`>**
        -   `hook.headers?` **`Record`<`string`, `string`>**
        -   `hook.query?` **`Record`<`string`, `string`>**
        -   `hook.json?` **`object`**
        -   `hook.form?` **`object`**
        -   `hook.body?` **`string`**
        -   `hook.responseTemplate?` **`string`**
        -   `hook.responseEvent?` **`string`**
        -   `hook.errorResponseEvent?` **`string`**
    -   `product?` **`string` \| `number`** Webhook for this product ID or slug
    -   `auth?` **`string`** The access token. Can be ignored if provided in constructor
    -   `headers?` **`Record`<`string`, `string`>** Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
    -   `context?` **\{ `tool?`: `ToolContext`; `project?`: `ProjectContext`; \}** Request context
        -   `context.tool?` **`ToolContext`**
        -   `context.project?` **`ProjectContext`**

Returns **`Promise`<`RequestResponse`>** A promise

### deleteWebhook

Defined in: [Particle.ts:1002](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1002)

Delete a webhook

**Parameters**

-   `options` **`DeleteWebhookOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### listWebhooks

Defined in: [Particle.ts:1016](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1016)

List all webhooks owned by the account or product

**Parameters**

-   `options` **`ListWebhooksOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### createIntegration

Defined in: [Particle.ts:1036](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1036)

Create an integration to send events to an external service

See the API docs for details https://docs.particle.io/reference/api/#integrations-webhooks-

**Parameters**

-   `options` **`CreateIntegrationOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### editIntegration

Defined in: [Particle.ts:1058](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1058)

Edit an integration to send events to an external service

See the API docs for details https://docs.particle.io/reference/api/#integrations-webhooks-

**Parameters**

-   `options` **`EditIntegrationOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### deleteIntegration

Defined in: [Particle.ts:1075](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1075)

Delete an integration to send events to an external service

**Parameters**

-   `options` **`DeleteIntegrationOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### listIntegrations

Defined in: [Particle.ts:1089](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1089)

List all integrations owned by the account or product

**Parameters**

-   `options` **`ListIntegrationsOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### getUserInfo

Defined in: [Particle.ts:1102](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1102)

Get details about the current user

**Parameters**

-   `options` Options for this API call
    -   `auth?` **`string`** The access token. Can be ignored if provided in constructor
    -   `headers?` **`Record`<`string`, `string`>** Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
    -   `context?` **\{ `tool?`: `ToolContext`; `project?`: `ProjectContext`; \}** Request context
        -   `context.tool?` **`ToolContext`**
        -   `context.project?` **`ProjectContext`**

Returns **`Promise`<`RequestResponse`>** A promise

### setUserInfo

Defined in: [Particle.ts:1115](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1115)

Set details on the current user

**Parameters**

-   `options` Options for this API call
    -   `accountInfo?` **`Record`<`string`, `string` \| `number` \| `boolean`>** Set user's extended info fields (name, business account, company name, etc)
    -   `auth?` **`string`** The access token. Can be ignored if provided in constructor
    -   `headers?` **`Record`<`string`, `string`>** Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
    -   `context?` **\{ `tool?`: `ToolContext`; `project?`: `ProjectContext`; \}** Request context
        -   `context.tool?` **`ToolContext`**
        -   `context.project?` **`ProjectContext`**

Returns **`Promise`<`RequestResponse`>** A promise

### changeUsername

Defined in: [Particle.ts:1131](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1131)

Change username (i.e, email)

**Parameters**

-   `options` **`ChangeUsernameOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### changeUserPassword

Defined in: [Particle.ts:1152](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1152)

Change user's password

**Parameters**

-   `options` **`ChangeUserPasswordOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### listSIMs

Defined in: [Particle.ts:1176](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1176)

List SIM cards owned by a user or product

**Parameters**

-   `options` **`ListSIMsOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### getSIMDataUsage

Defined in: [Particle.ts:1192](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1192)

Get data usage for one SIM card for the current billing period

**Parameters**

-   `options` **`GetSIMDataUsageOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### getFleetDataUsage

Defined in: [Particle.ts:1209](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1209)

Get data usage for all SIM cards in a product the current billing period

**Parameters**

-   `options` **`GetFleetDataUsageOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### checkSIM

Defined in: [Particle.ts:1227](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1227)

Check SIM status

**Parameters**

-   `options` **`CheckSIMOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### activateSIM

Defined in: [Particle.ts:1244](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1244)

Activate and add SIM cards to an account or product

**Parameters**

-   `options` **`ActivateSIMOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### deactivateSIM

Defined in: [Particle.ts:1265](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1265)

Deactivate a SIM card so it doesn't incur data usage in future months.

**Parameters**

-   `options` **`DeactivateSIMOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### reactivateSIM

Defined in: [Particle.ts:1282](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1282)

Reactivate a SIM card the was deactivated or unpause a SIM card that was automatically paused

**Parameters**

-   `options` **`ReactivateSIMOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### updateSIM

Defined in: [Particle.ts:1299](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1299)

Update SIM card data limit

**Parameters**

-   `options` **`UpdateSIMOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### removeSIM

Defined in: [Particle.ts:1315](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1315)

Remove a SIM card from an account so it can be activated by a different account

**Parameters**

-   `options` **`RemoveSIMOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### listBuildTargets

Defined in: [Particle.ts:1329](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1329)

List valid build targets to be used for compiling

**Parameters**

-   `options` **`ListBuildTargetsOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### listLibraries

Defined in: [Particle.ts:1358](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1358)

List firmware libraries

**Parameters**

-   `options` **`ListLibrariesOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### getLibrary

Defined in: [Particle.ts:1391](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1391)

Get firmware library details

**Parameters**

-   `options` **`GetLibraryOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### getLibraryVersions

Defined in: [Particle.ts:1412](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1412)

Firmware library details for each version

**Parameters**

-   `options` **`GetLibraryVersionsOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### contributeLibrary

Defined in: [Particle.ts:1432](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1432)

Contribute a new library version from a compressed archive

**Parameters**

-   `options` **`ContributeLibraryOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### publishLibrary

Defined in: [Particle.ts:1456](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1456)

Publish the latest version of a library to the public

**Parameters**

-   `options` **`PublishLibraryOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### deleteLibrary

Defined in: [Particle.ts:1477](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1477)

Delete one version of a library or an entire private library

**Parameters**

-   `options` **`DeleteLibraryOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### downloadFile

Defined in: [Particle.ts:1495](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1495)

Download an external file that may not be on the API

**Parameters**

-   `options` **`DownloadFileOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** Resolves to a buffer with the file data

### listOAuthClients

Defined in: [Particle.ts:1508](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1508)

List OAuth client created by the account

**Parameters**

-   `options` **`ListOAuthClientsOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### createOAuthClient

Defined in: [Particle.ts:1526](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1526)

Create an OAuth client

**Parameters**

-   `options` Options for this API call
    -   `name` **`string`** Name of the OAuth client
    -   `type` **`string`** web, installed or web
    -   `redirect_uri?` **`string`** URL to redirect after OAuth flow. Only for type web.
    -   `scope?` **`Record`<`string`, `string`>** Limits what the access tokens created by this client can do.
    -   `product?` **`string` \| `number`** Create client for this product ID or slug
    -   `auth?` **`string`** The access token. Can be ignored if provided in constructor
    -   `headers?` **`Record`<`string`, `string`>** Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
    -   `context?` **\{ `tool?`: `ToolContext`; `project?`: `ProjectContext`; \}** Request context
        -   `context.tool?` **`ToolContext`**
        -   `context.project?` **`ProjectContext`**

Returns **`Promise`<`RequestResponse`>** A promise

### updateOAuthClient

Defined in: [Particle.ts:1544](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1544)

Update an OAuth client

**Parameters**

-   `options` **`UpdateOAuthClientOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### deleteOAuthClient

Defined in: [Particle.ts:1560](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1560)

Delete an OAuth client

**Parameters**

-   `options` **`DeleteOAuthClientOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### listProducts

Defined in: [Particle.ts:1573](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1573)

List products the account has access to

**Parameters**

-   `options` **`ListProductsOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### getProduct

Defined in: [Particle.ts:1586](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1586)

Get detailed information about a product

**Parameters**

-   `options` **`GetProductOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### listProductFirmware

Defined in: [Particle.ts:1599](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1599)

List product firmware versions

**Parameters**

-   `options` **`ListProductFirmwareOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### uploadProductFirmware

Defined in: [Particle.ts:1617](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1617)

List product firmware versions

**Parameters**

-   `options` **`UploadProductFirmwareOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### getProductFirmware

Defined in: [Particle.ts:1645](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1645)

Get information about a product firmware version

**Parameters**

-   `options` **`GetProductFirmwareOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### updateProductFirmware

Defined in: [Particle.ts:1666](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1666)

Update information for a product firmware version

**Parameters**

-   `options` **`UpdateProductFirmwareOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### downloadProductFirmware

Defined in: [Particle.ts:1681](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1681)

Download a product firmware binary

**Parameters**

-   `options` **`DownloadProductFirmwareOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise that resolves with either the requested data or an error object

### downloadManufacturingBackup

Defined in: [Particle.ts:1701](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1701)

Download a tachyon manufacturing backup files

**Parameters**

-   `options` **`DownloadManufacturingBackupOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise with a zip file that contains all manufacturing backup files for the specific device.

### releaseProductFirmware

Defined in: [Particle.ts:1722](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1722)

Release a product firmware version as the default version

**Parameters**

-   `options` **`ReleaseFirmwareOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### listTeamMembers

Defined in: [Particle.ts:1736](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1736)

List product team members

**Parameters**

-   `options` **`ListTeamMembersOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### inviteTeamMember

Defined in: [Particle.ts:1755](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1755)

Invite Particle user to a product team

**Parameters**

-   `options` **`InviteTeamMemberOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### removeTeamMember

Defined in: [Particle.ts:1775](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1775)

Remove Particle user to a product team

**Parameters**

-   `options` **`RemoveTeamMemberOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### lookupSerialNumber

Defined in: [Particle.ts:1793](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1793)

Fetch details about a serial number

**Parameters**

-   `options` **`LookupSerialNumberOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### createMeshNetwork

Defined in: [Particle.ts:1813](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1813)

Create a mesh network

**Parameters**

-   `options` **`CreateMeshNetworkOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### removeMeshNetwork

Defined in: [Particle.ts:1832](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1832)

Remove a mesh network.

**Parameters**

-   `options` **`RemoveMeshNetworkOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### listMeshNetworks

Defined in: [Particle.ts:1846](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1846)

List all mesh networks

**Parameters**

-   `options` **`ListMeshNetworksOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### getMeshNetwork

Defined in: [Particle.ts:1860](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1860)

Get information about a mesh network.

**Parameters**

-   `options` **`GetMeshNetworkOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### updateMeshNetwork

Defined in: [Particle.ts:1875](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1875)

Modify a mesh network.

**Parameters**

-   `options` **`UpdateMeshNetworkOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### addMeshNetworkDevice

Defined in: [Particle.ts:1895](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1895)

Add a device to a mesh network.

**Parameters**

-   `options` Options for this API call
    -   `networkId` **`string`** Network ID or name
    -   `deviceId` **`string`** Device ID
    -   `auth?` **`string`** The access token. Can be ignored if provided in constructor
    -   `headers?` **`Record`<`string`, `string`>** Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
    -   `context?` **\{ `tool?`: `ToolContext`; `project?`: `ProjectContext`; \}** Request context
        -   `context.tool?` **`ToolContext`**
        -   `context.project?` **`ProjectContext`**

Returns **`Promise`<`RequestResponse`>** A promise

### removeMeshNetworkDevice

Defined in: [Particle.ts:1916](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1916)

Remove a device from a mesh network.

**Parameters**

-   `options` **`RemoveMeshNetworkDeviceOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### listMeshNetworkDevices

Defined in: [Particle.ts:1947](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1947)

List all devices of a mesh network.

**Parameters**

-   `options` **`ListMeshNetworkDevicesOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### getProductConfiguration

Defined in: [Particle.ts:1967](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1967)

Get product configuration

**Parameters**

-   `options` **`GetProductConfigurationOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### getProductConfigurationSchema

Defined in: [Particle.ts:1985](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L1985)

Get product configuration schema

**Parameters**

-   `options` **`GetProductConfigurationSchemaOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### getProductDeviceConfiguration

Defined in: [Particle.ts:2005](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L2005)

Get product device's configuration

**Parameters**

-   `options` **`GetProductDeviceConfigurationOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### getProductDeviceConfigurationSchema

Defined in: [Particle.ts:2024](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L2024)

Get product device's configuration schema

**Parameters**

-   `options` **`GetProductDeviceConfigurationSchemaOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### setProductConfiguration

Defined in: [Particle.ts:2044](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L2044)

Set product configuration

**Parameters**

-   `options` **`SetProductConfigurationOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### setProductDeviceConfiguration

Defined in: [Particle.ts:2065](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L2065)

Set product configuration for a specific device within the product

**Parameters**

-   `options` **`SetProductDeviceConfigurationOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### getProductLocations

Defined in: [Particle.ts:2092](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L2092)

Query location for devices within a product

**Parameters**

-   `options` **`GetProductLocationsOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### getProductDeviceLocations

Defined in: [Particle.ts:2126](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L2126)

Query location for one device within a product

**Parameters**

-   `options` **`GetProductDeviceLocationsOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise

### executeLogic

Defined in: [Particle.ts:2154](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L2154)

Executes the provided logic function once and returns the result. No logs, runs, etc are saved

NOTE: Any external interactions such as Particle.publish will actually occur when the logic is executed.

**Parameters**

-   `options` **`ExecuteLogicOptions`** The options for creating the logic function.

Returns **`Promise`<`RequestResponse`>** A promise that resolves to the created logic function data.

### createLogicFunction

Defined in: [Particle.ts:2182](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L2182)

Creates a new logic function in the specified organization or sandbox using the provided function data.

When you create a logic function with Event logic triggers, events will immediately
start being handled by the function code.

When you create a Scheduled logic trigger, it will immediately be scheduled at the next time
according to the cron and start_at properties.

**Parameters**

-   `options` The options for creating the logic function.
    -   `auth?` **`string`** The access token. Can be ignored if provided in constructor
    -   `org?` **`string`** The Organization ID or slug. If not provided, the request will go to your sandbox account.
    -   `logicFunction` **\{ `name`: `string`; `description?`: `string`; `enabled?`: `boolean`; `source`: \{ `type`: `"JavaScript"`; `code`: `string`; \}; `logic_triggers?`: `object`[]; `api_username?`: `string`; \}** The logic function object containing the function details.
        -   `logicFunction.name` **`string`**
        -   `logicFunction.description?` **`string`**
        -   `logicFunction.enabled?` **`boolean`**
        -   `logicFunction.source` **\{ `type`: `"JavaScript"`; `code`: `string`; \}**
        -   `logicFunction.source.type` **`"JavaScript"`**
        -   `logicFunction.source.code` **`string`**
        -   `logicFunction.logic_triggers?` **`object`[]**
        -   `logicFunction.api_username?` **`string`**
    -   `headers?` **`Record`<`string`, `string`>** Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
    -   `context?` **\{ `tool?`: `ToolContext`; `project?`: `ProjectContext`; \}** Request context
        -   `context.tool?` **`ToolContext`**
        -   `context.project?` **`ProjectContext`**

Returns **`Promise`<`RequestResponse`>** A promise that resolves to the created logic function data.

### getLogicFunction

Defined in: [Particle.ts:2204](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L2204)

Get a logic function in the specified organization or sandbox by logic function ID.

**Parameters**

-   `options` **`GetLogicFunctionOptions`** The options for the logic function.

Returns **`Promise`<`RequestResponse`>** A promise that resolves to the specified logic function data.

### updateLogicFunction

Defined in: [Particle.ts:2228](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L2228)

Updates an existing logic function in the specified organization or sandbox using the provided function data.

If you include an id on a logic trigger, it will update the logic trigger in place.

**Parameters**

-   `options` The options for updating the logic function.
    -   `auth?` **`string`** The access token. Can be ignored if provided in constructor
    -   `org?` **`string`** The Organization ID or slug. If not provided, the request will go to your sandbox account.
    -   `logicFunctionId` **`string`** The ID of the logic function to update.
    -   `logicFunction` **\{ `name?`: `string`; `description?`: `string`; `enabled?`: `boolean`; `source?`: \{ `type`: `"JavaScript"`; `code`: `string`; \}; `logic_triggers?`: `object`[]; \}** The logic function object containing the logic function details.
        -   `logicFunction.name?` **`string`**
        -   `logicFunction.description?` **`string`**
        -   `logicFunction.enabled?` **`boolean`**
        -   `logicFunction.source?` **\{ `type`: `"JavaScript"`; `code`: `string`; \}**
        -   `logicFunction.source.type` **`"JavaScript"`**
        -   `logicFunction.source.code` **`string`**
        -   `logicFunction.logic_triggers?` **`object`[]**
    -   `headers?` **`Record`<`string`, `string`>** Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
    -   `context?` **\{ `tool?`: `ToolContext`; `project?`: `ProjectContext`; \}** Request context.
        -   `context.tool?` **`ToolContext`**
        -   `context.project?` **`ProjectContext`**

Returns **`Promise`<`RequestResponse`>** A promise that resolves to the updated logic function data.

### deleteLogicFunction

Defined in: [Particle.ts:2250](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L2250)

Deletes a logic function in the specified organization or sandbox by logic function ID.

**Parameters**

-   `options` **`DeleteLogicFunctionOptions`** The options for deleting the logic function.

Returns **`Promise`<`RequestResponse`>** A promise that resolves to an object containing the deleted logic function ID.

### listLogicFunctions

Defined in: [Particle.ts:2271](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L2271)

Lists all logic functions in the specified organization or sandbox.

**Parameters**

-   `options` **`ListLogicFunctionsOptions`** The options for listing logic functions.

Returns **`Promise`<`RequestResponse`>** A promise that resolves to an array of logic functions data.

### listLogicRuns

Defined in: [Particle.ts:2295](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L2295)

Lists all logic runs for the specified logic function in the specified organization or sandbox.

**Parameters**

-   `options` **`ListLogicRunsOptions`** The options for the request.

Returns **`Promise`<`RequestResponse`>** A promise that resolves to an array of logic run data.

### getLogicRun

Defined in: [Particle.ts:2317](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L2317)

Retrieves a logic run by its ID for the specified logic function in the specified organization or sandbox.

**Parameters**

-   `options` **`GetLogicRunOptions`** The options for the request.

Returns **`Promise`<`RequestResponse`>** A promise that resolves to an array of logic run data for the specified logic run ID.

### getLogicRunLogs

Defined in: [Particle.ts:2339](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L2339)

Retrieves the logs for a logic run by its ID for the specified logic function in the specified organization or sandbox.

**Parameters**

-   `options` **`GetLogicRunLogsOptions`** The options for the request.

Returns **`Promise`<`RequestResponse`>** A promise that resolves to the logs for the specified logic run ID.

### createLedger

Defined in: [Particle.ts:2360](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L2360)

Creates a new ledger definition in the specified organization or sandbox.

**Parameters**

-   `options` **`CreateLedgerOptions`** The options for creating the ledger definition.

Returns **`Promise`<`RequestResponse`>** A promise that resolves to the created ledger definition data.

### getLedger

Defined in: [Particle.ts:2382](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L2382)

Get a ledger definition in the specified organization or sandbox by ledger name.

**Parameters**

-   `options` **`GetLedgerOptions`** The options for the ledger definition.

Returns **`Promise`<`RequestResponse`>** A promise that resolves to the specified ledger definition data.

### updateLedger

Defined in: [Particle.ts:2404](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L2404)

Updates an existing ledger definition in the specified organization or sandbox.

**Parameters**

-   `options` **`UpdateLedgerOptions`** The options for updating the ledger definition.

Returns **`Promise`<`RequestResponse`>** A promise that resolves to the updated ledger definition data.

### archiveLedger

Defined in: [Particle.ts:2426](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L2426)

Archives a ledger definition in the specified organization or sandbox by ledger name.

**Parameters**

-   `options` **`ArchiveLedgerOptions`** The options for archiving the ledger definition.

Returns **`Promise`<`RequestResponse`>** A promise that resolves to an object confirming the ledger definition was archived.

### Scope

Defined in: [Particle.ts:2436](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L2436)

Type: `"Owner" | "Product" | "Device"`

### listLedgers

Defined in: [Particle.ts:2454](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L2454)

Lists all ledger definitions in the specified organization or sandbox.

**Parameters**

-   `options` **`ListLedgersOptions`** The options for listing ledger definitions.

Returns **`Promise`<`RequestResponse`>** A promise that resolves to an array of ledger definition data.

### getLedgerInstance

Defined in: [Particle.ts:2482](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L2482)

Get ledger instance data.

**Parameters**

-   `options` **`GetLedgerInstanceOptions`** The options for the ledger instance.

Returns **`Promise`<`RequestResponse`>** A promise that resolves to the specified ledger instance data.

### SetMode

Defined in: [Particle.ts:2492](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L2492)

Type: `"Replace" | "Merge"`

### setLedgerInstance

Defined in: [Particle.ts:2510](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L2510)

Set ledger instance data.

**Parameters**

-   `options` **`SetLedgerInstanceOptions`** The options for updating the ledger instance.

Returns **`Promise`<`RequestResponse`>** A promise that resolves to the updated ledger instance data.

### deleteLedgerInstance

Defined in: [Particle.ts:2536](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L2536)

Delete a ledger instance in the specified organization or sandbox by ledger name.

**Parameters**

-   `options` **`DeleteLedgerInstanceOptions`** The options for archiving the ledger instance.

Returns **`Promise`<`RequestResponse`>** A promise that resolves to an object confirming the ledger instance was deleted.

### listLedgerInstances

Defined in: [Particle.ts:2559](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L2559)

Lists ledger instances in the specified organization or sandbox.

**Parameters**

-   `options` **`ListLedgerInstancesOptions`** The options for listing ledger instances.

Returns **`Promise`<`RequestResponse`>** A promise that resolves to an array of ledger instance data.

### listLedgerInstanceVersions

Defined in: [Particle.ts:2587](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L2587)

List ledger instance versions

**Parameters**

-   `options` **`ListLedgerInstanceVersionsOptions`** The options for the ledger instance.

Returns **`Promise`<`RequestResponse`>** A promise that resolves to an array of ledger instance data.

### getLedgerInstanceVersion

Defined in: [Particle.ts:2614](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L2614)

Get specific ledger instance version

**Parameters**

-   `options` **`GetLedgerInstanceVersionOptions`** The options for the ledger instance.

Returns **`Promise`<`RequestResponse`>** A promise that resolves to the specified ledger instance data.

### listDeviceOsVersions

Defined in: [Particle.ts:2637](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L2637)

List Device OS versions

**Parameters**

-   `options` **`ListDeviceOsVersionsOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise that resolves to the list of Device OS versions.

### getDeviceOsVersion

Defined in: [Particle.ts:2666](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L2666)

Get a specific Device OS version

**Parameters**

-   `options` **`GetDeviceOsVersionOptions`** Options for this API call

Returns **`Promise`<`RequestResponse`>** A promise that resolves to the specified Device OS version data.

### setDefaultAuth

Defined in: [Particle.ts:2682](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L2682)

Set default auth token that will be used in each method if `auth` is not provided

**Parameters**

-   `auth` **`string`** The access token

Returns **`void`**

###### Throws

When not auth string is provided

### get

Defined in: [Particle.ts:2719](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L2719)

Make a GET request

**Parameters**

-   `params` **`GetHeadOptions`**

Returns **`Promise`<`RequestResponse`>** A promise that resolves with either the requested data or an error object

### head

Defined in: [Particle.ts:2735](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L2735)

Make a HEAD request

**Parameters**

-   `params` **`GetHeadOptions`**

Returns **`Promise`<`RequestResponse`>** A promise that resolves with either the requested data or an error object

### post

Defined in: [Particle.ts:2751](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L2751)

Make a POST request

**Parameters**

-   `params` **`MutateOptions`**

Returns **`Promise`<`RequestResponse`>** A promise that resolves with either the requested data or an error object

### put

Defined in: [Particle.ts:2768](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L2768)

Make a PUT request

**Parameters**

-   `params` **`MutateOptions`**

Returns **`Promise`<`RequestResponse`>** A promise that resolves with either the requested data or an error object

### delete

Defined in: [Particle.ts:2784](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L2784)

Make a DELETE request

**Parameters**

-   `params` **`MutateOptions`**

Returns **`Promise`<`RequestResponse`>** A promise that resolves with either the requested data or an error object

### request

Defined in: [Particle.ts:2805](https://github.com/particle-iot/particle-api-js/blob/1ff11101c73cd1eace34db0ab80571f08ad72bc1/src/Particle.ts#L2805)

**Parameters**

-   `args` **`AgentRequestOptions`** An obj with all the possible request configurations

Returns **`Promise`<`RequestResponse`>** A promise that resolves with either the requested data or an error object
