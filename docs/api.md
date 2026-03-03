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

Defined in: [Particle.ts:61](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L61)

Particle Cloud API wrapper.

See <https://docs.particle.io/reference/javascript/> for examples
of using the `Particle` class.

Most Particle methods take a single unnamed argument object documented as
`options` with key/value pairs for each option.

### constructor

Defined in: [Particle.ts:83](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L83)

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

Defined in: [Particle.ts:139](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L139)

Login to Particle Cloud using an existing Particle acccount.

**Parameters**

-   `options` **`LoginOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`LoginResponse`>>** A promise that resolves with the response data

### sendOtp

Defined in: [Particle.ts:165](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L165)

If login failed with an 'mfa_required' error, this must be called with a valid OTP code to login

**Parameters**

-   `options` **`SendOtpOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`LoginResponse`>>** A promise that resolves with the response data

### enableMfa

Defined in: [Particle.ts:189](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L189)

Enable MFA on the currently logged in user

**Parameters**

-   `options` **`EnableMfaOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`EnableMfaResponse`>>** A promise that resolves with the response data

### confirmMfa

Defined in: [Particle.ts:204](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L204)

Confirm MFA for the user. This must be called with current TOTP code, determined from the results of enableMfa(). You will be prompted to enter an OTP code every time you login after enrollment is confirmed.

**Parameters**

-   `options` **`ConfirmMfaOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`ConfirmMfaResponse`>>** A promise that resolves with the response data

### disableMfa

Defined in: [Particle.ts:229](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L229)

Disable MFA for the user.

**Parameters**

-   `options` **`DisableMfaOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### createCustomer

Defined in: [Particle.ts:249](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L249)

Create Customer for Product.

**Parameters**

-   `options` **`CreateCustomerOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`CreateCustomerResponse`>>** A promise that resolves with the response data

### loginAsClientOwner

Defined in: [Particle.ts:272](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L272)

Login to Particle Cloud using an OAuth client.

**Parameters**

-   `options?` **`LoginAsClientOwnerOptions` = `{}`** Options for this API call

Returns **`Promise`<`JSONResponse`<`LoginResponse`>>** A promise that resolves with the response data

### createUser

Defined in: [Particle.ts:297](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L297)

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

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### resetPassword

Defined in: [Particle.ts:319](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L319)

Send reset password email for a Particle Cloud user account

**Parameters**

-   `options` **`ResetPasswordOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### deleteAccessToken

Defined in: [Particle.ts:336](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L336)

Revoke an access token

**Parameters**

-   `options` **`DeleteAccessTokenOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### deleteCurrentAccessToken

Defined in: [Particle.ts:352](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L352)

Revoke the current session access token

**Parameters**

-   `options` **`DeleteCurrentAccessTokenOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### deleteActiveAccessTokens

Defined in: [Particle.ts:369](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L369)

Revoke all active access tokens

**Parameters**

-   `options` **`DeleteActiveAccessTokensOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### deleteUser

Defined in: [Particle.ts:387](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L387)

Delete the current user

**Parameters**

-   `options` **`DeleteUserOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### trackingIdentity

Defined in: [Particle.ts:407](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L407)

Retrieves the information that is used to identify the current login for tracking.

**Parameters**

-   `options?` **`TrackingIdentityOptions` = `{}`** Options for this API call

Returns **`Promise`<`JSONResponse`<`TrackingIdentityResponse`>>** A promise that resolves with the response data

### listDevices

Defined in: [Particle.ts:433](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L433)

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

Returns **`Promise`<`JSONResponse`<`DeviceInfo`[]>>** A promise that resolves with the response data

### getDevice

Defined in: [Particle.ts:465](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L465)

Get detailed informationa about a device

**Parameters**

-   `options` **`GetDeviceOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`DeviceInfo`>>** A promise that resolves with the response data

### claimDevice

Defined in: [Particle.ts:480](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L480)

Claim a device to the account. The device must be online and unclaimed.

**Parameters**

-   `options` **`ClaimDeviceOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`ClaimResponse`>>** A promise that resolves with the response data

### addDeviceToProduct

Defined in: [Particle.ts:505](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L505)

Add a device to a product or move device out of quarantine.

**Parameters**

-   `options` **`AddDeviceToProductOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### removeDevice

Defined in: [Particle.ts:537](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L537)

Unclaim / Remove a device from your account or product, or deny quarantine

**Parameters**

-   `options` **`RemoveDeviceOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### removeDeviceOwner

Defined in: [Particle.ts:553](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L553)

Unclaim a product device its the owner, but keep it in the product

**Parameters**

-   `options` **`RemoveDeviceOwnerOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### renameDevice

Defined in: [Particle.ts:569](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L569)

Rename a device

**Parameters**

-   `options` **`RenameDeviceOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`DeviceInfo`>>** A promise that resolves with the response data

### signalDevice

Defined in: [Particle.ts:584](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L584)

Instruct the device to turn on/off the LED in a rainbow pattern

**Parameters**

-   `options` **`SignalDeviceOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`DeviceInfo`>>** A promise that resolves with the response data

### setDeviceNotes

Defined in: [Particle.ts:599](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L599)

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

Defined in: [Particle.ts:614](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L614)

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

Defined in: [Particle.ts:630](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L630)

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

Defined in: [Particle.ts:644](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L644)

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

Defined in: [Particle.ts:665](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L665)

Update multiple device attributes at the same time

**Parameters**

-   `options` **`UpdateDeviceOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`DeviceInfo`>>** A promise that resolves with the response data

### unprotectDevice

Defined in: [Particle.ts:697](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L697)

Disable device protection.

**Parameters**

-   `options` **`UnprotectDeviceOptions`** Options for this API call.

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### provisionDevice

Defined in: [Particle.ts:724](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L724)

Provision a new device for products that allow self-provisioning

**Parameters**

-   `options` **`ProvisionDeviceOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`DeviceInfo`>>** A promise that resolves with the response data

### getClaimCode

Defined in: [Particle.ts:746](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L746)

Generate a claim code to use in the device claiming process.
To generate a claim code for a product, the access token MUST belong to a
customer of the product.

**Parameters**

-   `options` **`GetClaimCodeOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`ClaimCodeResponse`>>** A promise that resolves with the response data

### getVariable

Defined in: [Particle.ts:762](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L762)

Get the value of a device variable

**Parameters**

-   `options` **`GetVariableOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`DeviceVariableResponse`>>** A promise that resolves with the response data

### flashDevice

Defined in: [Particle.ts:782](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L782)

Compile and flash application firmware to a device. Pass a pre-compiled binary to flash it directly to the device.

**Parameters**

-   `options` **`FlashDeviceOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### compileCode

Defined in: [Particle.ts:806](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L806)

Compile firmware using the Particle Cloud

**Parameters**

-   `options` **`CompileCodeOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`CompileResponse`>>** A promise that resolves with the response data

### downloadFirmwareBinary

Defined in: [Particle.ts:835](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L835)

Download a firmware binary

**Parameters**

-   `options` **`DownloadFirmwareBinaryOptions`** Options for this API call

Returns **`Promise`<`Buffer` \| `ArrayBuffer`>** A promise that resolves with the binary data

### sendPublicKey

Defined in: [Particle.ts:857](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L857)

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

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### callFunction

Defined in: [Particle.ts:885](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L885)

Call a device function

**Parameters**

-   `options` **`CallFunctionOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`FunctionCallResponse`>>** A promise that resolves with the response data

### getEventStream

Defined in: [Particle.ts:903](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L903)

Get a stream of events

**Parameters**

-   `options` **`GetEventStreamOptions`** Options for this API call

Returns **`Promise`<`EventStream`>** A promise that resolves with the response data emit 'event' events.

### publishEvent

Defined in: [Particle.ts:942](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L942)

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

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### Hook

Defined in: [Particle.ts:940](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L940)

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

Defined in: [Particle.ts:977](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L977)

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

Returns **`Promise`<`JSONResponse`<`CreateWebhookResponse`>>** A promise that resolves with the response data

### deleteWebhook

Defined in: [Particle.ts:1011](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1011)

Delete a webhook

**Parameters**

-   `options` **`DeleteWebhookOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### listWebhooks

Defined in: [Particle.ts:1025](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1025)

List all webhooks owned by the account or product

**Parameters**

-   `options` **`ListWebhooksOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`WebhookInfo`[]>>** A promise that resolves with the response data

### createIntegration

Defined in: [Particle.ts:1045](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1045)

Create an integration to send events to an external service

See the API docs for details https://docs.particle.io/reference/api/#integrations-webhooks-

**Parameters**

-   `options` **`CreateIntegrationOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`IntegrationInfo`>>** A promise that resolves with the response data

### editIntegration

Defined in: [Particle.ts:1067](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1067)

Edit an integration to send events to an external service

See the API docs for details https://docs.particle.io/reference/api/#integrations-webhooks-

**Parameters**

-   `options` **`EditIntegrationOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`IntegrationInfo`>>** A promise that resolves with the response data

### deleteIntegration

Defined in: [Particle.ts:1084](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1084)

Delete an integration to send events to an external service

**Parameters**

-   `options` **`DeleteIntegrationOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### listIntegrations

Defined in: [Particle.ts:1098](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1098)

List all integrations owned by the account or product

**Parameters**

-   `options` **`ListIntegrationsOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`IntegrationInfo`[]>>** A promise that resolves with the response data

### getUserInfo

Defined in: [Particle.ts:1111](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1111)

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

Defined in: [Particle.ts:1124](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1124)

Set details on the current user

**Parameters**

-   `options` Options for this API call
    -   `accountInfo?` **`Record`<`string`, `string` \| `number` \| `boolean`>** Set user's extended info fields (name, business account, company name, etc)
    -   `auth?` **`string`** The access token. Can be ignored if provided in constructor
    -   `headers?` **`Record`<`string`, `string`>** Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
    -   `context?` **\{ `tool?`: `ToolContext`; `project?`: `ProjectContext`; \}** Request context
        -   `context.tool?` **`ToolContext`**
        -   `context.project?` **`ProjectContext`**

Returns **`Promise`<`JSONResponse`<`UserInfo`>>** A promise that resolves with the response data

### changeUsername

Defined in: [Particle.ts:1140](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1140)

Change username (i.e, email)

**Parameters**

-   `options` **`ChangeUsernameOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### changeUserPassword

Defined in: [Particle.ts:1161](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1161)

Change user's password

**Parameters**

-   `options` **`ChangeUserPasswordOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### listSIMs

Defined in: [Particle.ts:1185](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1185)

List SIM cards owned by a user or product

**Parameters**

-   `options` **`ListSIMsOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`SimInfo`[]>>** A promise that resolves with the response data

### getSIMDataUsage

Defined in: [Particle.ts:1201](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1201)

Get data usage for one SIM card for the current billing period

**Parameters**

-   `options` **`GetSIMDataUsageOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`SimDataUsage`>>** A promise that resolves with the response data

### getFleetDataUsage

Defined in: [Particle.ts:1218](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1218)

Get data usage for all SIM cards in a product the current billing period

**Parameters**

-   `options` **`GetFleetDataUsageOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`SimDataUsage`>>** A promise that resolves with the response data

### checkSIM

Defined in: [Particle.ts:1236](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1236)

Check SIM status

**Parameters**

-   `options` **`CheckSIMOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`SimInfo`>>** A promise that resolves with the response data

### activateSIM

Defined in: [Particle.ts:1253](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1253)

Activate and add SIM cards to an account or product

**Parameters**

-   `options` **`ActivateSIMOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### deactivateSIM

Defined in: [Particle.ts:1274](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1274)

Deactivate a SIM card so it doesn't incur data usage in future months.

**Parameters**

-   `options` **`DeactivateSIMOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### reactivateSIM

Defined in: [Particle.ts:1291](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1291)

Reactivate a SIM card the was deactivated or unpause a SIM card that was automatically paused

**Parameters**

-   `options` **`ReactivateSIMOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### updateSIM

Defined in: [Particle.ts:1308](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1308)

Update SIM card data limit

**Parameters**

-   `options` **`UpdateSIMOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`SimInfo`>>** A promise that resolves with the response data

### removeSIM

Defined in: [Particle.ts:1324](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1324)

Remove a SIM card from an account so it can be activated by a different account

**Parameters**

-   `options` **`RemoveSIMOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### listBuildTargets

Defined in: [Particle.ts:1338](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1338)

List valid build targets to be used for compiling

**Parameters**

-   `options` **`ListBuildTargetsOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`BuildTargetsResponse`>>** A promise that resolves with the response data

### listLibraries

Defined in: [Particle.ts:1367](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1367)

List firmware libraries

**Parameters**

-   `options` **`ListLibrariesOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<\{ `data`: `LibraryInfo`[]; \}>>** A promise

### getLibrary

Defined in: [Particle.ts:1400](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1400)

Get firmware library details

**Parameters**

-   `options` **`GetLibraryOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<\{ `data`: `LibraryInfo`; \}>>** A promise

### getLibraryVersions

Defined in: [Particle.ts:1421](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1421)

Firmware library details for each version

**Parameters**

-   `options` **`GetLibraryVersionsOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<\{ `data`: `LibraryInfo`[]; \}>>** A promise

### contributeLibrary

Defined in: [Particle.ts:1441](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1441)

Contribute a new library version from a compressed archive

**Parameters**

-   `options` **`ContributeLibraryOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<\{ `data`: `LibraryInfo`; \}>>** A promise

### publishLibrary

Defined in: [Particle.ts:1465](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1465)

Publish the latest version of a library to the public

**Parameters**

-   `options` **`PublishLibraryOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<\{ `data`: `LibraryInfo`; \}>>** A promise

### deleteLibrary

Defined in: [Particle.ts:1486](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1486)

Delete one version of a library or an entire private library

**Parameters**

-   `options` **`DeleteLibraryOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### downloadFile

Defined in: [Particle.ts:1504](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1504)

Download an external file that may not be on the API

**Parameters**

-   `options` **`DownloadFileOptions`** Options for this API call

Returns **`Promise`<`Buffer` \| `ArrayBuffer`>** A promise that resolves with the binary data

### listOAuthClients

Defined in: [Particle.ts:1517](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1517)

List OAuth client created by the account

**Parameters**

-   `options` **`ListOAuthClientsOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<\{ `clients`: `OAuthClientInfo`[]; \}>>** A promise

### createOAuthClient

Defined in: [Particle.ts:1535](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1535)

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

Returns **`Promise`<`JSONResponse`<`OAuthClientInfo`>>** A promise that resolves with the response data

### updateOAuthClient

Defined in: [Particle.ts:1553](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1553)

Update an OAuth client

**Parameters**

-   `options` **`UpdateOAuthClientOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OAuthClientInfo`>>** A promise that resolves with the response data

### deleteOAuthClient

Defined in: [Particle.ts:1569](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1569)

Delete an OAuth client

**Parameters**

-   `options` **`DeleteOAuthClientOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### listProducts

Defined in: [Particle.ts:1582](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1582)

List products the account has access to

**Parameters**

-   `options` **`ListProductsOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<\{ `products`: `ProductInfo`[]; \}>>** A promise

### getProduct

Defined in: [Particle.ts:1595](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1595)

Get detailed information about a product

**Parameters**

-   `options` **`GetProductOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<\{ `product`: `ProductInfo`; \}>>** A promise

### listProductFirmware

Defined in: [Particle.ts:1608](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1608)

List product firmware versions

**Parameters**

-   `options` **`ListProductFirmwareOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`ProductFirmwareInfo`[]>>** A promise that resolves with the response data

### uploadProductFirmware

Defined in: [Particle.ts:1626](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1626)

List product firmware versions

**Parameters**

-   `options` **`UploadProductFirmwareOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`ProductFirmwareInfo`>>** A promise that resolves with the response data

### getProductFirmware

Defined in: [Particle.ts:1654](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1654)

Get information about a product firmware version

**Parameters**

-   `options` **`GetProductFirmwareOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`ProductFirmwareInfo`>>** A promise that resolves with the response data

### updateProductFirmware

Defined in: [Particle.ts:1675](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1675)

Update information for a product firmware version

**Parameters**

-   `options` **`UpdateProductFirmwareOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`ProductFirmwareInfo`>>** A promise that resolves with the response data

### downloadProductFirmware

Defined in: [Particle.ts:1690](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1690)

Download a product firmware binary

**Parameters**

-   `options` **`DownloadProductFirmwareOptions`** Options for this API call

Returns **`Promise`<`Buffer` \| `ArrayBuffer`>** A promise that resolves with the binary data

### downloadManufacturingBackup

Defined in: [Particle.ts:1710](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1710)

Download a tachyon manufacturing backup files

**Parameters**

-   `options` **`DownloadManufacturingBackupOptions`** Options for this API call

Returns **`Promise`<`Buffer` \| `ArrayBuffer`>** A promise that resolves with the binary data

### releaseProductFirmware

Defined in: [Particle.ts:1731](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1731)

Release a product firmware version as the default version

**Parameters**

-   `options` **`ReleaseFirmwareOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### listTeamMembers

Defined in: [Particle.ts:1745](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1745)

List product team members

**Parameters**

-   `options` **`ListTeamMembersOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`TeamMember`[]>>** A promise that resolves with the response data

### inviteTeamMember

Defined in: [Particle.ts:1764](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1764)

Invite Particle user to a product team

**Parameters**

-   `options` **`InviteTeamMemberOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### removeTeamMember

Defined in: [Particle.ts:1784](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1784)

Remove Particle user to a product team

**Parameters**

-   `options` **`RemoveTeamMemberOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### lookupSerialNumber

Defined in: [Particle.ts:1802](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1802)

Fetch details about a serial number

**Parameters**

-   `options` **`LookupSerialNumberOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`SerialNumberResponse`>>** A promise that resolves with the response data

### createMeshNetwork

Defined in: [Particle.ts:1822](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1822)

Create a mesh network

**Parameters**

-   `options` **`CreateMeshNetworkOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`NetworkInfo`>>** A promise that resolves with the response data

### removeMeshNetwork

Defined in: [Particle.ts:1841](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1841)

Remove a mesh network.

**Parameters**

-   `options` **`RemoveMeshNetworkOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### listMeshNetworks

Defined in: [Particle.ts:1855](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1855)

List all mesh networks

**Parameters**

-   `options` **`ListMeshNetworksOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`NetworkInfo`[]>>** A promise that resolves with the response data

### getMeshNetwork

Defined in: [Particle.ts:1869](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1869)

Get information about a mesh network.

**Parameters**

-   `options` **`GetMeshNetworkOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`NetworkInfo`>>** A promise that resolves with the response data

### updateMeshNetwork

Defined in: [Particle.ts:1884](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1884)

Modify a mesh network.

**Parameters**

-   `options` **`UpdateMeshNetworkOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`NetworkInfo`>>** A promise that resolves with the response data

### addMeshNetworkDevice

Defined in: [Particle.ts:1904](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1904)

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

Returns **`Promise`<`JSONResponse`<`NetworkInfo`>>** A promise that resolves with the response data

### removeMeshNetworkDevice

Defined in: [Particle.ts:1925](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1925)

Remove a device from a mesh network.

**Parameters**

-   `options` **`RemoveMeshNetworkDeviceOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### listMeshNetworkDevices

Defined in: [Particle.ts:1956](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1956)

List all devices of a mesh network.

**Parameters**

-   `options` **`ListMeshNetworkDevicesOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`DeviceInfo`[]>>** A promise that resolves with the response data

### getProductConfiguration

Defined in: [Particle.ts:1976](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1976)

Get product configuration

**Parameters**

-   `options` **`GetProductConfigurationOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`ProductConfigurationResponse`>>** A promise that resolves with the response data

### getProductConfigurationSchema

Defined in: [Particle.ts:1994](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L1994)

Get product configuration schema

**Parameters**

-   `options` **`GetProductConfigurationSchemaOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`object`>>** A promise that resolves with the response data

### getProductDeviceConfiguration

Defined in: [Particle.ts:2014](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L2014)

Get product device's configuration

**Parameters**

-   `options` **`GetProductDeviceConfigurationOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`ProductConfigurationResponse`>>** A promise that resolves with the response data

### getProductDeviceConfigurationSchema

Defined in: [Particle.ts:2033](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L2033)

Get product device's configuration schema

**Parameters**

-   `options` **`GetProductDeviceConfigurationSchemaOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`object`>>** A promise that resolves with the response data

### setProductConfiguration

Defined in: [Particle.ts:2053](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L2053)

Set product configuration

**Parameters**

-   `options` **`SetProductConfigurationOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`ProductConfigurationResponse`>>** A promise that resolves with the response data

### setProductDeviceConfiguration

Defined in: [Particle.ts:2074](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L2074)

Set product configuration for a specific device within the product

**Parameters**

-   `options` **`SetProductDeviceConfigurationOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`ProductConfigurationResponse`>>** A promise that resolves with the response data

### getProductLocations

Defined in: [Particle.ts:2101](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L2101)

Query location for devices within a product

**Parameters**

-   `options` **`GetProductLocationsOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`LocationListResponse`>>** A promise that resolves with the response data

### getProductDeviceLocations

Defined in: [Particle.ts:2135](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L2135)

Query location for one device within a product

**Parameters**

-   `options` **`GetProductDeviceLocationsOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`DeviceLocationInfo`>>** A promise that resolves with the response data

### executeLogic

Defined in: [Particle.ts:2163](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L2163)

Executes the provided logic function once and returns the result. No logs, runs, etc are saved

NOTE: Any external interactions such as Particle.publish will actually occur when the logic is executed.

**Parameters**

-   `options` **`ExecuteLogicOptions`** The options for creating the logic function.

Returns **`Promise`<`JSONResponse`<`ExecuteLogicResponse`>>** A promise that resolves with the response data

### createLogicFunction

Defined in: [Particle.ts:2191](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L2191)

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

Returns **`Promise`<`JSONResponse`<\{ `logic_function`: `LogicFunction`; \}>>** A promise that resolves to the created logic function data.

### getLogicFunction

Defined in: [Particle.ts:2213](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L2213)

Get a logic function in the specified organization or sandbox by logic function ID.

**Parameters**

-   `options` **`GetLogicFunctionOptions`** The options for the logic function.

Returns **`Promise`<`JSONResponse`<\{ `logic_function`: `LogicFunction`; \}>>** A promise that resolves to the specified logic function data.

### updateLogicFunction

Defined in: [Particle.ts:2237](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L2237)

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

Returns **`Promise`<`JSONResponse`<\{ `logic_function`: `LogicFunction`; \}>>** A promise that resolves to the updated logic function data.

### deleteLogicFunction

Defined in: [Particle.ts:2259](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L2259)

Deletes a logic function in the specified organization or sandbox by logic function ID.

**Parameters**

-   `options` **`DeleteLogicFunctionOptions`** The options for deleting the logic function.

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### listLogicFunctions

Defined in: [Particle.ts:2280](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L2280)

Lists all logic functions in the specified organization or sandbox.

**Parameters**

-   `options` **`ListLogicFunctionsOptions`** The options for listing logic functions.

Returns **`Promise`<`JSONResponse`<\{ `logic_functions`: `LogicFunction`[]; \}>>** A promise that resolves to an array of logic functions data.

### listLogicRuns

Defined in: [Particle.ts:2304](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L2304)

Lists all logic runs for the specified logic function in the specified organization or sandbox.

**Parameters**

-   `options` **`ListLogicRunsOptions`** The options for the request.

Returns **`Promise`<`JSONResponse`<\{ `logic_runs`: `LogicRun`[]; \}>>** A promise that resolves to an array of logic run data.

### getLogicRun

Defined in: [Particle.ts:2326](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L2326)

Retrieves a logic run by its ID for the specified logic function in the specified organization or sandbox.

**Parameters**

-   `options` **`GetLogicRunOptions`** The options for the request.

Returns **`Promise`<`JSONResponse`<\{ `logic_run`: `LogicRun`; \}>>** A promise that resolves to an array of logic run data for the specified logic run ID.

### getLogicRunLogs

Defined in: [Particle.ts:2348](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L2348)

Retrieves the logs for a logic run by its ID for the specified logic function in the specified organization or sandbox.

**Parameters**

-   `options` **`GetLogicRunLogsOptions`** The options for the request.

Returns **`Promise`<`JSONResponse`<\{ `logs`: `LogicRunLog`[]; \}>>** A promise that resolves to the logs for the specified logic run ID.

### createLedger

Defined in: [Particle.ts:2369](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L2369)

Creates a new ledger definition in the specified organization or sandbox.

**Parameters**

-   `options` **`CreateLedgerOptions`** The options for creating the ledger definition.

Returns **`Promise`<`JSONResponse`<`LedgerDefinition`>>** A promise that resolves with the response data

### getLedger

Defined in: [Particle.ts:2391](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L2391)

Get a ledger definition in the specified organization or sandbox by ledger name.

**Parameters**

-   `options` **`GetLedgerOptions`** The options for the ledger definition.

Returns **`Promise`<`JSONResponse`<`LedgerDefinition`>>** A promise that resolves with the response data

### updateLedger

Defined in: [Particle.ts:2413](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L2413)

Updates an existing ledger definition in the specified organization or sandbox.

**Parameters**

-   `options` **`UpdateLedgerOptions`** The options for updating the ledger definition.

Returns **`Promise`<`JSONResponse`<`LedgerDefinition`>>** A promise that resolves with the response data

### archiveLedger

Defined in: [Particle.ts:2435](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L2435)

Archives a ledger definition in the specified organization or sandbox by ledger name.

**Parameters**

-   `options` **`ArchiveLedgerOptions`** The options for archiving the ledger definition.

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### Scope

Defined in: [Particle.ts:2436](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L2436)

Type: `"Owner" | "Product" | "Device"`

### listLedgers

Defined in: [Particle.ts:2463](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L2463)

Lists all ledger definitions in the specified organization or sandbox.

**Parameters**

-   `options` **`ListLedgersOptions`** The options for listing ledger definitions.

Returns **`Promise`<`JSONResponse`<\{ `ledger_definitions`: `LedgerDefinition`[]; \}>>** A promise that resolves to an array of ledger definition data.

### getLedgerInstance

Defined in: [Particle.ts:2491](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L2491)

Get ledger instance data.

**Parameters**

-   `options` **`GetLedgerInstanceOptions`** The options for the ledger instance.

Returns **`Promise`<`JSONResponse`<`LedgerInstance`>>** A promise that resolves with the response data

### SetMode

Defined in: [Particle.ts:2492](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L2492)

Type: `"Replace" | "Merge"`

### setLedgerInstance

Defined in: [Particle.ts:2519](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L2519)

Set ledger instance data.

**Parameters**

-   `options` **`SetLedgerInstanceOptions`** The options for updating the ledger instance.

Returns **`Promise`<`JSONResponse`<`LedgerInstance`>>** A promise that resolves with the response data

### deleteLedgerInstance

Defined in: [Particle.ts:2545](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L2545)

Delete a ledger instance in the specified organization or sandbox by ledger name.

**Parameters**

-   `options` **`DeleteLedgerInstanceOptions`** The options for archiving the ledger instance.

Returns **`Promise`<`JSONResponse`<`OKResponse`>>** A promise that resolves with the response data

### listLedgerInstances

Defined in: [Particle.ts:2568](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L2568)

Lists ledger instances in the specified organization or sandbox.

**Parameters**

-   `options` **`ListLedgerInstancesOptions`** The options for listing ledger instances.

Returns **`Promise`<`JSONResponse`<`LedgerInstanceListResponse`>>** A promise that resolves with the response data

### listLedgerInstanceVersions

Defined in: [Particle.ts:2596](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L2596)

List ledger instance versions

**Parameters**

-   `options` **`ListLedgerInstanceVersionsOptions`** The options for the ledger instance.

Returns **`Promise`<`JSONResponse`<`LedgerVersionListResponse`>>** A promise that resolves with the response data

### getLedgerInstanceVersion

Defined in: [Particle.ts:2623](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L2623)

Get specific ledger instance version

**Parameters**

-   `options` **`GetLedgerInstanceVersionOptions`** The options for the ledger instance.

Returns **`Promise`<`JSONResponse`<`LedgerInstance`>>** A promise that resolves with the response data

### listDeviceOsVersions

Defined in: [Particle.ts:2646](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L2646)

List Device OS versions

**Parameters**

-   `options` **`ListDeviceOsVersionsOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`DeviceOsVersion`[]>>** A promise that resolves with the response data

### getDeviceOsVersion

Defined in: [Particle.ts:2675](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L2675)

Get a specific Device OS version

**Parameters**

-   `options` **`GetDeviceOsVersionOptions`** Options for this API call

Returns **`Promise`<`JSONResponse`<`DeviceOsVersion`>>** A promise that resolves with the response data

### setDefaultAuth

Defined in: [Particle.ts:2691](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L2691)

Set default auth token that will be used in each method if `auth` is not provided

**Parameters**

-   `auth` **`string`** The access token

Returns **`void`**

###### Throws

When not auth string is provided

### get

> **get**<`T`>(`params`: `GetHeadOptions`): `Promise`<`JSONResponse`<`T`>>

Defined in: [Particle.ts:2728](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L2728)

Make a GET request

###### Type Parameters

###### T

`T` = `object`

**Parameters**

-   `params` **`GetHeadOptions`**

Returns **`Promise`<`JSONResponse`<`T`>>** A promise that resolves with the response data

### head

> **head**<`T`>(`params`: `GetHeadOptions`): `Promise`<`JSONResponse`<`T`>>

Defined in: [Particle.ts:2744](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L2744)

Make a HEAD request

###### Type Parameters

###### T

`T` = `object`

**Parameters**

-   `params` **`GetHeadOptions`**

Returns **`Promise`<`JSONResponse`<`T`>>** A promise that resolves with the response data

### post

> **post**<`T`>(`params`: `MutateOptions`): `Promise`<`JSONResponse`<`T`>>

Defined in: [Particle.ts:2760](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L2760)

Make a POST request

###### Type Parameters

###### T

`T` = `object`

**Parameters**

-   `params` **`MutateOptions`**

Returns **`Promise`<`JSONResponse`<`T`>>** A promise that resolves with the response data

### put

> **put**<`T`>(`params`: `MutateOptions`): `Promise`<`JSONResponse`<`T`>>

Defined in: [Particle.ts:2777](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L2777)

Make a PUT request

###### Type Parameters

###### T

`T` = `object`

**Parameters**

-   `params` **`MutateOptions`**

Returns **`Promise`<`JSONResponse`<`T`>>** A promise that resolves with the response data

### delete

> **delete**<`T`>(`params`: `MutateOptions`): `Promise`<`JSONResponse`<`T`>>

Defined in: [Particle.ts:2793](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L2793)

Make a DELETE request

###### Type Parameters

###### T

`T` = `object`

**Parameters**

-   `params` **`MutateOptions`**

Returns **`Promise`<`JSONResponse`<`T`>>** A promise that resolves with the response data

### request

Defined in: [Particle.ts:2814](https://github.com/particle-iot/particle-api-js/blob/567dd4b3f3cd54f5be3f8b8bb4058d4e4f8fb04f/src/Particle.ts#L2814)

**Parameters**

-   `args` **`AgentRequestOptions`** An obj with all the possible request configurations

Returns **`Promise`<`RequestResponse`>** A promise that resolves with the response data
