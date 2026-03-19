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
    -   [listEnvVars](#listenvvars)
    -   [updateEnvVars](#updateenvvars)
    -   [setEnvVar](#setenvvar)
    -   [deleteEnvVar](#deleteenvvar)
    -   [renderEnvVars](#renderenvvars)
    -   [reviewEnvVarsRollout](#reviewenvvarsrollout)
    -   [startEnvVarsRollout](#startenvvarsrollout)
    -   [setDefaultAuth](#setdefaultauth)
    -   [get](#get)
    -   [head](#head)
    -   [post](#post)
    -   [put](#put)
    -   [patch](#patch)
    -   [delete](#delete)
    -   [request](#request)

## Particle

Defined in: [Particle.ts:18](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L18)

Particle Cloud API wrapper.

See <https://docs.particle.io/reference/javascript/> for examples
of using the `Particle` class.

Most Particle methods take a single unnamed argument object documented as
`options` with key/value pairs for each option.

### constructor

Defined in: [Particle.ts:42](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L42)

Contructor for the Cloud API wrapper.

Create a new Particle object and call methods below on it.

**Parameters**

-   `options?` **`ParticleOptions` = `{}`** Options for this API call Options to be used for all requests (see [Defaults](../src/Defaults.js))

Returns **`Particle`**

### login

Defined in: [Particle.ts:99](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L99)

Login to Particle Cloud using an existing Particle acccount.

**Parameters**

-   `options` **`LoginOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`LoginResponse`>>** A promise that resolves with the response data

### sendOtp

Defined in: [Particle.ts:125](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L125)

If login failed with an 'mfa_required' error, this must be called with a valid OTP code to login

**Parameters**

-   `options` **`SendOtpOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`LoginResponse`>>** A promise that resolves with the response data

### enableMfa

Defined in: [Particle.ts:149](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L149)

Enable MFA on the currently logged in user

**Parameters**

-   `options` **`EnableMfaOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`EnableMfaResponse`>>** A promise that resolves with the response data

### confirmMfa

Defined in: [Particle.ts:164](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L164)

Confirm MFA for the user. This must be called with current TOTP code, determined from the results of enableMfa(). You will be prompted to enter an OTP code every time you login after enrollment is confirmed.

**Parameters**

-   `options` **`ConfirmMfaOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`ConfirmMfaResponse`>>** A promise that resolves with the response data

### disableMfa

Defined in: [Particle.ts:189](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L189)

Disable MFA for the user.

**Parameters**

-   `options` **`DisableMfaOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### createCustomer

Defined in: [Particle.ts:209](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L209)

Create Customer for Product.

**Parameters**

-   `options` **`CreateCustomerOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`CreateCustomerResponse`>>** A promise that resolves with the response data

### loginAsClientOwner

Defined in: [Particle.ts:232](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L232)

Login to Particle Cloud using an OAuth client.

**Parameters**

-   `options?` **`LoginAsClientOwnerOptions` = `{}`** Options for this API call

Returns **`Promise`<`JSONResponse`<`LoginResponse`>>** A promise that resolves with the response data

### createUser

Defined in: [Particle.ts:257](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L257)

Create a user account for the Particle Cloud

**Parameters**

-   `options` **`CreateUserOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### resetPassword

Defined in: [Particle.ts:279](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L279)

Send reset password email for a Particle Cloud user account

**Parameters**

-   `options` **`ResetPasswordOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### deleteAccessToken

Defined in: [Particle.ts:296](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L296)

Revoke an access token

**Parameters**

-   `options` **`DeleteAccessTokenOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### deleteCurrentAccessToken

Defined in: [Particle.ts:312](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L312)

Revoke the current session access token

**Parameters**

-   `options` **`DeleteCurrentAccessTokenOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### deleteActiveAccessTokens

Defined in: [Particle.ts:329](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L329)

Revoke all active access tokens

**Parameters**

-   `options` **`DeleteActiveAccessTokensOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### deleteUser

Defined in: [Particle.ts:347](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L347)

Delete the current user

**Parameters**

-   `options` **`DeleteUserOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### trackingIdentity

Defined in: [Particle.ts:367](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L367)

Retrieves the information that is used to identify the current login for tracking.

**Parameters**

-   `options?` **`TrackingIdentityOptions` = `{}`** Options for this API call

Returns **`Promise`<`JSONResponse`<`TrackingIdentityResponse`>>** A promise that resolves with the response data

### listDevices

Defined in: [Particle.ts:393](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L393)

List devices claimed to the account or product

**Parameters**

-   `options` **`ListDevicesOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`DeviceListResponse` \| `DeviceInfo`[]>>** A promise that resolves with the response data

### getDevice

Defined in: [Particle.ts:425](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L425)

Get detailed informationa about a device

**Parameters**

-   `options` **`GetDeviceOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`DeviceInfo`>>** A promise that resolves with the response data

### claimDevice

Defined in: [Particle.ts:440](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L440)

Claim a device to the account. The device must be online and unclaimed.

**Parameters**

-   `options` **`ClaimDeviceOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`ClaimResponse`>>** A promise that resolves with the response data

### addDeviceToProduct

Defined in: [Particle.ts:465](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L465)

Add a device to a product or move device out of quarantine.

**Parameters**

-   `options` **`AddDeviceToProductOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### removeDevice

Defined in: [Particle.ts:497](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L497)

Unclaim / Remove a device from your account or product, or deny quarantine

**Parameters**

-   `options` **`RemoveDeviceOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### removeDeviceOwner

Defined in: [Particle.ts:513](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L513)

Unclaim a product device its the owner, but keep it in the product

**Parameters**

-   `options` **`RemoveDeviceOwnerOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### renameDevice

Defined in: [Particle.ts:529](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L529)

Rename a device

**Parameters**

-   `options` **`RenameDeviceOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`DeviceInfo`>>** A promise that resolves with the response data

### signalDevice

Defined in: [Particle.ts:544](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L544)

Instruct the device to turn on/off the LED in a rainbow pattern

**Parameters**

-   `options` **`SignalDeviceOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`DeviceInfo`>>** A promise that resolves with the response data

### setDeviceNotes

Defined in: [Particle.ts:559](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L559)

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

Returns **`Promise`<`JSONResponse`<`DeviceInfo`>>** A promise that resolves with the response data

### markAsDevelopmentDevice

Defined in: [Particle.ts:574](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L574)

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

Returns **`Promise`<`JSONResponse`<`DeviceInfo`>>** A promise that resolves with the response data

### lockDeviceProductFirmware

Defined in: [Particle.ts:590](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L590)

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

Returns **`Promise`<`JSONResponse`<`DeviceInfo`>>** A promise that resolves with the response data

### unlockDeviceProductFirmware

Defined in: [Particle.ts:604](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L604)

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

Returns **`Promise`<`JSONResponse`<`DeviceInfo`>>** A promise that resolves with the response data

### updateDevice

Defined in: [Particle.ts:625](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L625)

Update multiple device attributes at the same time

**Parameters**

-   `options` **`UpdateDeviceOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`DeviceInfo`>>** A promise that resolves with the response data

### unprotectDevice

Defined in: [Particle.ts:657](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L657)

Disable device protection.

**Parameters**

-   `options` **`UnprotectDeviceOptions`** Options for this API call.

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### provisionDevice

Defined in: [Particle.ts:684](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L684)

Provision a new device for products that allow self-provisioning

**Parameters**

-   `options` **`ProvisionDeviceOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`DeviceInfo`>>** A promise that resolves with the response data

### getClaimCode

Defined in: [Particle.ts:706](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L706)

Generate a claim code to use in the device claiming process.
To generate a claim code for a product, the access token MUST belong to a
customer of the product.

**Parameters**

-   `options` **`GetClaimCodeOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`ClaimCodeResponse`>>** A promise that resolves with the response data

### getVariable

Defined in: [Particle.ts:722](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L722)

Get the value of a device variable

**Parameters**

-   `options` **`GetVariableOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`DeviceVariableResponse`>>** A promise that resolves with the response data

### flashDevice

Defined in: [Particle.ts:742](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L742)

Compile and flash application firmware to a device. Pass a pre-compiled binary to flash it directly to the device.

**Parameters**

-   `options` **`FlashDeviceOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### compileCode

Defined in: [Particle.ts:766](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L766)

Compile firmware using the Particle Cloud

**Parameters**

-   `options` **`CompileCodeOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`CompileResponse`>>** A promise that resolves with the response data

### downloadFirmwareBinary

Defined in: [Particle.ts:795](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L795)

Download a firmware binary

**Parameters**

-   `options` **`DownloadFirmwareBinaryOptions`** Options for this API call

Returns **`Promise`<`Buffer` \| `ArrayBuffer`>** A promise that resolves with the binary data

### sendPublicKey

Defined in: [Particle.ts:817](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L817)

Send a new device public key to the Particle Cloud

**Parameters**

-   `options` **`SendPublicKeyOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### callFunction

Defined in: [Particle.ts:845](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L845)

Call a device function

**Parameters**

-   `options` **`CallFunctionOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`FunctionCallResponse`>>** A promise that resolves with the response data

### getEventStream

Defined in: [Particle.ts:863](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L863)

Get a stream of events

**Parameters**

-   `options` **`GetEventStreamOptions`** Options for this API call

Returns **`Promise`<`EventStream`>** A promise that resolves with the response data emit 'event' events.

### publishEvent

Defined in: [Particle.ts:902](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L902)

Publish a event to the Particle Cloud

**Parameters**

-   `options` **`PublishEventOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### Hook

Defined in: [Particle.ts:940](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L940)

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

Defined in: [Particle.ts:937](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L937)

Create a webhook

**Parameters**

-   `options` **`CreateWebhookOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`CreateWebhookResponse`>>** A promise that resolves with the response data

### deleteWebhook

Defined in: [Particle.ts:971](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L971)

Delete a webhook

**Parameters**

-   `options` **`DeleteWebhookOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### listWebhooks

Defined in: [Particle.ts:985](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L985)

List all webhooks owned by the account or product

**Parameters**

-   `options` **`ListWebhooksOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`WebhookInfo`[]>>** A promise that resolves with the response data

### createIntegration

Defined in: [Particle.ts:1005](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1005)

Create an integration to send events to an external service

See the API docs for details https://docs.particle.io/reference/api/#integrations-webhooks-

**Parameters**

-   `options` **`CreateIntegrationOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`IntegrationInfo`>>** A promise that resolves with the response data

### editIntegration

Defined in: [Particle.ts:1027](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1027)

Edit an integration to send events to an external service

See the API docs for details https://docs.particle.io/reference/api/#integrations-webhooks-

**Parameters**

-   `options` **`EditIntegrationOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`IntegrationInfo`>>** A promise that resolves with the response data

### deleteIntegration

Defined in: [Particle.ts:1044](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1044)

Delete an integration to send events to an external service

**Parameters**

-   `options` **`DeleteIntegrationOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### listIntegrations

Defined in: [Particle.ts:1058](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1058)

List all integrations owned by the account or product

**Parameters**

-   `options` **`ListIntegrationsOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`IntegrationInfo`[]>>** A promise that resolves with the response data

### getUserInfo

Defined in: [Particle.ts:1071](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1071)

Get details about the current user

**Parameters**

-   `options` Options for this API call
    -   `auth?` **`string`** The access token. Can be ignored if provided in constructor
    -   `headers?` **`Record`<`string`, `string`>** Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
    -   `context?` **\{ `tool?`: `ToolContext`; `project?`: `ProjectContext`; \}** Request context
        -   `context.tool?` **`ToolContext`**
        -   `context.project?` **`ProjectContext`**

Returns **`Promise`<`JSONResponse`<`UserInfo`>>** A promise that resolves with the response data

### setUserInfo

Defined in: [Particle.ts:1084](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1084)

Set details on the current user

**Parameters**

-   `options` **`SetUserInfoOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`UserInfo`>>** A promise that resolves with the response data

### changeUsername

Defined in: [Particle.ts:1100](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1100)

Change username (i.e, email)

**Parameters**

-   `options` **`ChangeUsernameOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### changeUserPassword

Defined in: [Particle.ts:1121](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1121)

Change user's password

**Parameters**

-   `options` **`ChangeUserPasswordOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### listSIMs

Defined in: [Particle.ts:1145](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1145)

List SIM cards owned by a user or product

**Parameters**

-   `options` **`ListSIMsOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`SimInfo`[]>>** A promise that resolves with the response data

### getSIMDataUsage

Defined in: [Particle.ts:1161](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1161)

Get data usage for one SIM card for the current billing period

**Parameters**

-   `options` **`GetSIMDataUsageOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`SimDataUsage`>>** A promise that resolves with the response data

### getFleetDataUsage

Defined in: [Particle.ts:1178](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1178)

Get data usage for all SIM cards in a product the current billing period

**Parameters**

-   `options` **`GetFleetDataUsageOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`SimDataUsage`>>** A promise that resolves with the response data

### checkSIM

Defined in: [Particle.ts:1196](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1196)

Check SIM status

**Parameters**

-   `options` **`CheckSIMOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`SimInfo`>>** A promise that resolves with the response data

### removeSIM

Defined in: [Particle.ts:1210](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1210)

Remove a SIM card from an account so it can be activated by a different account

**Parameters**

-   `options` **`RemoveSIMOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### listBuildTargets

Defined in: [Particle.ts:1224](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1224)

List valid build targets to be used for compiling

**Parameters**

-   `options` **`ListBuildTargetsOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`BuildTargetsResponse`>>** A promise that resolves with the response data

### listLibraries

Defined in: [Particle.ts:1253](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1253)

List firmware libraries

**Parameters**

-   `options` **`ListLibrariesOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<\{ `data`: `LibraryInfo`[]; \}>>** A promise

### getLibrary

Defined in: [Particle.ts:1286](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1286)

Get firmware library details

**Parameters**

-   `options` **`GetLibraryOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<\{ `data`: `LibraryInfo`; \}>>** A promise

### getLibraryVersions

Defined in: [Particle.ts:1307](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1307)

Firmware library details for each version

**Parameters**

-   `options` **`GetLibraryVersionsOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<\{ `data`: `LibraryInfo`[]; \}>>** A promise

### contributeLibrary

Defined in: [Particle.ts:1327](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1327)

Contribute a new library version from a compressed archive

**Parameters**

-   `options` **`ContributeLibraryOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<\{ `data`: `LibraryInfo`; \}>>** A promise

### publishLibrary

Defined in: [Particle.ts:1351](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1351)

Publish the latest version of a library to the public

**Parameters**

-   `options` **`PublishLibraryOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<\{ `data`: `LibraryInfo`; \}>>** A promise

### deleteLibrary

Defined in: [Particle.ts:1372](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1372)

Delete one version of a library or an entire private library

**Parameters**

-   `options` **`DeleteLibraryOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### downloadFile

Defined in: [Particle.ts:1390](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1390)

Download an external file that may not be on the API

**Parameters**

-   `options` **`DownloadFileOptions`** Options for this API call

Returns **`Promise`<`Buffer` \| `ArrayBuffer`>** A promise that resolves with the binary data

### listOAuthClients

Defined in: [Particle.ts:1403](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1403)

List OAuth client created by the account

**Parameters**

-   `options` **`ListOAuthClientsOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<\{ `clients`: `OAuthClientInfo`[]; \}>>** A promise

### createOAuthClient

Defined in: [Particle.ts:1421](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1421)

Create an OAuth client

**Parameters**

-   `options` **`CreateOAuthClientOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OAuthClientInfo`>>** A promise that resolves with the response data

### updateOAuthClient

Defined in: [Particle.ts:1439](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1439)

Update an OAuth client

**Parameters**

-   `options` **`UpdateOAuthClientOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OAuthClientInfo`>>** A promise that resolves with the response data

### deleteOAuthClient

Defined in: [Particle.ts:1455](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1455)

Delete an OAuth client

**Parameters**

-   `options` **`DeleteOAuthClientOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### listProducts

Defined in: [Particle.ts:1468](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1468)

List products the account has access to

**Parameters**

-   `options` **`ListProductsOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<\{ `products`: `ProductInfo`[]; \}>>** A promise

### getProduct

Defined in: [Particle.ts:1481](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1481)

Get detailed information about a product

**Parameters**

-   `options` **`GetProductOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<\{ `product`: `ProductInfo`; \}>>** A promise

### listProductFirmware

Defined in: [Particle.ts:1494](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1494)

List product firmware versions

**Parameters**

-   `options` **`ListProductFirmwareOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`ProductFirmwareInfo`[]>>** A promise that resolves with the response data

### uploadProductFirmware

Defined in: [Particle.ts:1512](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1512)

List product firmware versions

**Parameters**

-   `options` **`UploadProductFirmwareOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`ProductFirmwareInfo`>>** A promise that resolves with the response data

### getProductFirmware

Defined in: [Particle.ts:1540](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1540)

Get information about a product firmware version

**Parameters**

-   `options` **`GetProductFirmwareOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`ProductFirmwareInfo`>>** A promise that resolves with the response data

### updateProductFirmware

Defined in: [Particle.ts:1561](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1561)

Update information for a product firmware version

**Parameters**

-   `options` **`UpdateProductFirmwareOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`ProductFirmwareInfo`>>** A promise that resolves with the response data

### downloadProductFirmware

Defined in: [Particle.ts:1576](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1576)

Download a product firmware binary

**Parameters**

-   `options` **`DownloadProductFirmwareOptions`** Options for this API call

Returns **`Promise`<`Buffer` \| `ArrayBuffer`>** A promise that resolves with the binary data

### downloadManufacturingBackup

Defined in: [Particle.ts:1596](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1596)

Download a tachyon manufacturing backup files

**Parameters**

-   `options` **`DownloadManufacturingBackupOptions`** Options for this API call

Returns **`Promise`<`Buffer` \| `ArrayBuffer`>** A promise that resolves with the binary data

### releaseProductFirmware

Defined in: [Particle.ts:1617](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1617)

Release a product firmware version as the default version

**Parameters**

-   `options` **`ReleaseFirmwareOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### listTeamMembers

Defined in: [Particle.ts:1631](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1631)

List product team members

**Parameters**

-   `options` **`ListTeamMembersOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`TeamMember`[]>>** A promise that resolves with the response data

### inviteTeamMember

Defined in: [Particle.ts:1650](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1650)

Invite Particle user to a product team

**Parameters**

-   `options` **`InviteTeamMemberOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### removeTeamMember

Defined in: [Particle.ts:1670](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1670)

Remove Particle user to a product team

**Parameters**

-   `options` **`RemoveTeamMemberOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### lookupSerialNumber

Defined in: [Particle.ts:1688](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1688)

Fetch details about a serial number

**Parameters**

-   `options` **`LookupSerialNumberOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`SerialNumberResponse`>>** A promise that resolves with the response data

### getProductConfiguration

Defined in: [Particle.ts:1706](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1706)

Get product configuration

**Parameters**

-   `options` **`GetProductConfigurationOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`ProductConfigurationResponse`>>** A promise that resolves with the response data

### getProductConfigurationSchema

Defined in: [Particle.ts:1724](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1724)

Get product configuration schema

**Parameters**

-   `options` **`GetProductConfigurationSchemaOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`object`>>** A promise that resolves with the response data

### getProductDeviceConfiguration

Defined in: [Particle.ts:1744](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1744)

Get product device's configuration

**Parameters**

-   `options` **`GetProductDeviceConfigurationOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`ProductConfigurationResponse`>>** A promise that resolves with the response data

### getProductDeviceConfigurationSchema

Defined in: [Particle.ts:1763](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1763)

Get product device's configuration schema

**Parameters**

-   `options` **`GetProductDeviceConfigurationSchemaOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`object`>>** A promise that resolves with the response data

### setProductConfiguration

Defined in: [Particle.ts:1783](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1783)

Set product configuration

**Parameters**

-   `options` **`SetProductConfigurationOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`ProductConfigurationResponse`>>** A promise that resolves with the response data

### setProductDeviceConfiguration

Defined in: [Particle.ts:1804](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1804)

Set product configuration for a specific device within the product

**Parameters**

-   `options` **`SetProductDeviceConfigurationOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`ProductConfigurationResponse`>>** A promise that resolves with the response data

### getProductLocations

Defined in: [Particle.ts:1831](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1831)

Query location for devices within a product

**Parameters**

-   `options` **`GetProductLocationsOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`LocationListResponse`>>** A promise that resolves with the response data

### getProductDeviceLocations

Defined in: [Particle.ts:1865](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1865)

Query location for one device within a product

**Parameters**

-   `options` **`GetProductDeviceLocationsOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`DeviceLocationInfo`>>** A promise that resolves with the response data

### executeLogic

Defined in: [Particle.ts:1893](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1893)

Executes the provided logic function once and returns the result. No logs, runs, etc are saved

NOTE: Any external interactions such as Particle.publish will actually occur when the logic is executed.

**Parameters**

-   `options` **`ExecuteLogicOptions`** The options for creating the logic function.

Returns **`Promise`<`JSONResponse`<`ExecuteLogicResponse`>>** A promise that resolves with the response data

### createLogicFunction

Defined in: [Particle.ts:1921](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1921)

Creates a new logic function in the specified organization or sandbox using the provided function data.

When you create a logic function with Event logic triggers, events will immediately
start being handled by the function code.

When you create a Scheduled logic trigger, it will immediately be scheduled at the next time
according to the cron and start_at properties.

**Parameters**

-   `options` **`CreateLogicFunctionOptions`** The options for creating the logic function.

Returns **`Promise`<`JSONResponse`<\{ `logic_function`: `LogicFunction`; \}>>** A promise that resolves to the created logic function data.

### getLogicFunction

Defined in: [Particle.ts:1943](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1943)

Get a logic function in the specified organization or sandbox by logic function ID.

**Parameters**

-   `options` **`GetLogicFunctionOptions`** The options for the logic function.

Returns **`Promise`<`JSONResponse`<\{ `logic_function`: `LogicFunction`; \}>>** A promise that resolves to the specified logic function data.

### updateLogicFunction

Defined in: [Particle.ts:1967](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1967)

Updates an existing logic function in the specified organization or sandbox using the provided function data.

If you include an id on a logic trigger, it will update the logic trigger in place.

**Parameters**

-   `options` **`UpdateLogicFunctionOptions`** The options for updating the logic function.

Returns **`Promise`<`JSONResponse`<\{ `logic_function`: `LogicFunction`; \}>>** A promise that resolves to the updated logic function data.

### deleteLogicFunction

Defined in: [Particle.ts:1989](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L1989)

Deletes a logic function in the specified organization or sandbox by logic function ID.

**Parameters**

-   `options` **`DeleteLogicFunctionOptions`** The options for deleting the logic function.

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### listLogicFunctions

Defined in: [Particle.ts:2010](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L2010)

Lists all logic functions in the specified organization or sandbox.

**Parameters**

-   `options` **`ListLogicFunctionsOptions`** The options for listing logic functions.

Returns **`Promise`<`JSONResponse`<\{ `logic_functions`: `LogicFunction`[]; \}>>** A promise that resolves to an array of logic functions data.

### listLogicRuns

Defined in: [Particle.ts:2034](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L2034)

Lists all logic runs for the specified logic function in the specified organization or sandbox.

**Parameters**

-   `options` **`ListLogicRunsOptions`** The options for the request.

Returns **`Promise`<`JSONResponse`<\{ `logic_runs`: `LogicRun`[]; \}>>** A promise that resolves to an array of logic run data.

### getLogicRun

Defined in: [Particle.ts:2056](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L2056)

Retrieves a logic run by its ID for the specified logic function in the specified organization or sandbox.

**Parameters**

-   `options` **`GetLogicRunOptions`** The options for the request.

Returns **`Promise`<`JSONResponse`<\{ `logic_run`: `LogicRun`; \}>>** A promise that resolves to an array of logic run data for the specified logic run ID.

### getLogicRunLogs

Defined in: [Particle.ts:2078](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L2078)

Retrieves the logs for a logic run by its ID for the specified logic function in the specified organization or sandbox.

**Parameters**

-   `options` **`GetLogicRunLogsOptions`** The options for the request.

Returns **`Promise`<`JSONResponse`<\{ `logs`: `LogicRunLog`[]; \}>>** A promise that resolves to the logs for the specified logic run ID.

### createLedger

Defined in: [Particle.ts:2099](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L2099)

Creates a new ledger definition in the specified organization or sandbox.

**Parameters**

-   `options` **`CreateLedgerOptions`** The options for creating the ledger definition.

Returns **`Promise`<`JSONResponse`<`LedgerDefinition`>>** A promise that resolves with the response data

### getLedger

Defined in: [Particle.ts:2121](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L2121)

Get a ledger definition in the specified organization or sandbox by ledger name.

**Parameters**

-   `options` **`GetLedgerOptions`** The options for the ledger definition.

Returns **`Promise`<`JSONResponse`<`LedgerDefinition`>>** A promise that resolves with the response data

### updateLedger

Defined in: [Particle.ts:2143](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L2143)

Updates an existing ledger definition in the specified organization or sandbox.

**Parameters**

-   `options` **`UpdateLedgerOptions`** The options for updating the ledger definition.

Returns **`Promise`<`JSONResponse`<`LedgerDefinition`>>** A promise that resolves with the response data

### archiveLedger

Defined in: [Particle.ts:2165](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L2165)

Archives a ledger definition in the specified organization or sandbox by ledger name.

**Parameters**

-   `options` **`ArchiveLedgerOptions`** The options for archiving the ledger definition.

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### Scope

Defined in: [Particle.ts:2436](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L2436)

Type: `"Owner" | "Product" | "Device"`

### listLedgers

Defined in: [Particle.ts:2193](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L2193)

Lists all ledger definitions in the specified organization or sandbox.

**Parameters**

-   `options` **`ListLedgersOptions`** The options for listing ledger definitions.

Returns **`Promise`<`JSONResponse`<\{ `ledger_definitions`: `LedgerDefinition`[]; \}>>** A promise that resolves to an array of ledger definition data.

### getLedgerInstance

Defined in: [Particle.ts:2221](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L2221)

Get ledger instance data.

**Parameters**

-   `options` **`GetLedgerInstanceOptions`** The options for the ledger instance.

Returns **`Promise`<`JSONResponse`<`LedgerInstance`>>** A promise that resolves with the response data

### SetMode

Defined in: [Particle.ts:2492](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L2492)

Type: `"Replace" | "Merge"`

### setLedgerInstance

Defined in: [Particle.ts:2249](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L2249)

Set ledger instance data.

**Parameters**

-   `options` **`SetLedgerInstanceOptions`** The options for updating the ledger instance.

Returns **`Promise`<`JSONResponse`<`LedgerInstance`>>** A promise that resolves with the response data

### deleteLedgerInstance

Defined in: [Particle.ts:2275](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L2275)

Delete a ledger instance in the specified organization or sandbox by ledger name.

**Parameters**

-   `options` **`DeleteLedgerInstanceOptions`** The options for archiving the ledger instance.

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### listLedgerInstances

Defined in: [Particle.ts:2298](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L2298)

Lists ledger instances in the specified organization or sandbox.

**Parameters**

-   `options` **`ListLedgerInstancesOptions`** The options for listing ledger instances.

Returns **`Promise`<`JSONResponse`<`LedgerInstanceListResponse`>>** A promise that resolves with the response data

### listLedgerInstanceVersions

Defined in: [Particle.ts:2326](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L2326)

List ledger instance versions

**Parameters**

-   `options` **`ListLedgerInstanceVersionsOptions`** The options for the ledger instance.

Returns **`Promise`<`JSONResponse`<`LedgerVersionListResponse`>>** A promise that resolves with the response data

### getLedgerInstanceVersion

Defined in: [Particle.ts:2353](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L2353)

Get specific ledger instance version

**Parameters**

-   `options` **`GetLedgerInstanceVersionOptions`** The options for the ledger instance.

Returns **`Promise`<`JSONResponse`<`LedgerInstance`>>** A promise that resolves with the response data

### listDeviceOsVersions

Defined in: [Particle.ts:2376](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L2376)

List Device OS versions

**Parameters**

-   `options` **`ListDeviceOsVersionsOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`DeviceOsVersion`[]>>** A promise that resolves with the response data

### getDeviceOsVersion

Defined in: [Particle.ts:2405](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L2405)

Get a specific Device OS version

**Parameters**

-   `options` **`GetDeviceOsVersionOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`DeviceOsVersion`>>** A promise that resolves with the response data

### listEnvVars

Defined in: [Particle.ts:2430](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L2430)

List environment variables for the given scope.

**Parameters**

-   `options` **`ListEnvVarsOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`EnvVarsResponse`>>** A promise that resolves with the env vars data

### updateEnvVars

Defined in: [Particle.ts:2452](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L2452)

Bulk update environment variables with set/unset operations.

**Parameters**

-   `options` **`UpdateEnvVarsOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`EnvVarsResponse`>>** A promise that resolves with the updated env vars data

### setEnvVar

Defined in: [Particle.ts:2476](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L2476)

Set a single environment variable.

**Parameters**

-   `options` **`SetEnvVarOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`EnvVarsResponse`>>** A promise that resolves with the updated env vars data

### deleteEnvVar

Defined in: [Particle.ts:2499](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L2499)

Delete a single environment variable.

**Parameters**

-   `options` **`DeleteEnvVarOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`EnvVarsResponse`>>** A promise that resolves with the updated env vars data

### renderEnvVars

Defined in: [Particle.ts:2520](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L2520)

Get the rendered (flattened) environment variables for the given scope.

**Parameters**

-   `options` **`RenderEnvVarsOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`EnvVarsRenderResponse`>>** A promise that resolves with the rendered env vars

### reviewEnvVarsRollout

Defined in: [Particle.ts:2541](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L2541)

Review the pending environment variables rollout changes.

**Parameters**

-   `options` **`ReviewEnvVarsRolloutOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`EnvVarsRolloutResponse`>>** A promise that resolves with the rollout diff

### startEnvVarsRollout

Defined in: [Particle.ts:2563](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L2563)

Start rolling out environment variables to devices.

**Parameters**

-   `options` **`StartEnvVarsRolloutOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`EnvVarsRolloutStartResponse`>>** A promise that resolves with success status

### setDefaultAuth

Defined in: [Particle.ts:2576](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L2576)

Set default auth token that will be used in each method if `auth` is not provided

**Parameters**

-   `auth` **`string`** The access token

Returns **`void`**

###### Throws

When not auth string is provided

### get

> **get**<`T`>(`params`: `T.GetHeadOptions`): `Promise`<`JSONResponse`<`T`>>

Defined in: [Particle.ts:2633](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L2633)

Make a GET request

###### Type Parameters

###### T

`T` = `object`

**Parameters**

-   `params` **`T.GetHeadOptions`**

Returns **`Promise`<`JSONResponse`<`T`>>** A promise that resolves with the response data

### head

> **head**<`T`>(`params`: `T.GetHeadOptions`): `Promise`<`JSONResponse`<`T`>>

Defined in: [Particle.ts:2649](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L2649)

Make a HEAD request

###### Type Parameters

###### T

`T` = `object`

**Parameters**

-   `params` **`T.GetHeadOptions`**

Returns **`Promise`<`JSONResponse`<`T`>>** A promise that resolves with the response data

### post

> **post**<`T`>(`params`: `T.MutateOptions`): `Promise`<`JSONResponse`<`T`>>

Defined in: [Particle.ts:2665](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L2665)

Make a POST request

###### Type Parameters

###### T

`T` = `object`

**Parameters**

-   `params` **`T.MutateOptions`**

Returns **`Promise`<`JSONResponse`<`T`>>** A promise that resolves with the response data

### put

> **put**<`T`>(`params`: `T.MutateOptions`): `Promise`<`JSONResponse`<`T`>>

Defined in: [Particle.ts:2682](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L2682)

Make a PUT request

###### Type Parameters

###### T

`T` = `object`

**Parameters**

-   `params` **`T.MutateOptions`**

Returns **`Promise`<`JSONResponse`<`T`>>** A promise that resolves with the response data

### patch

> **patch**<`T`>(`params`: `T.MutateOptions`): `Promise`<`JSONResponse`<`T`>>

Defined in: [Particle.ts:2698](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L2698)

Make a PATCH request

###### Type Parameters

###### T

`T` = `object`

**Parameters**

-   `params` **`T.MutateOptions`**

Returns **`Promise`<`JSONResponse`<`T`>>** A promise that resolves with the response data

### delete

> **delete**<`T`>(`params`: `T.MutateOptions`): `Promise`<`JSONResponse`<`T`>>

Defined in: [Particle.ts:2714](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L2714)

Make a DELETE request

###### Type Parameters

###### T

`T` = `object`

**Parameters**

-   `params` **`T.MutateOptions`**

Returns **`Promise`<`JSONResponse`<`T`>>** A promise that resolves with the response data

### request

Defined in: [Particle.ts:2735](https://github.com/particle-iot/particle-api-js/blob/d5b9ba7920d6470da0d87fe65cf56f5eb56b791e/src/Particle.ts#L2735)

**Parameters**

-   `args` **`AgentRequestOptions`** An obj with all the possible request configurations

Returns **`Promise`<`RequestResponse`<`object`>>** A promise that resolves with the response data
