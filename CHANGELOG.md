# changelog

## 5.2.6 - 25 Mar 2016

* Don't double publish event stream events if the event is named `event`.

## 5.2.5 - 21 Mar 2016

* Handle `JSON.parse` exceptions when parsing event stream

## 5.2.4 - 21 Mar 2016

* `flashDevice` `latest` also needs to be a string, not a boolean. [#12](https://github.com/spark/particle-api-js/issues/12)

## 5.2.3 - 11 Mar 2016

* Remove setting of `User-Agent` header because that is not allowed in browsers. [#10](https://github.com/spark/particle-api-js/issues/10)

## 5.2.2 - 3 Mar 2016

* Fix named event streams by encoding event name.
* Move access token to query string to eliminate preflight CORS request.
* Use fork of `stream-http` that prevents usage of `fetch` because it does not abort.
* Use correct streaming mode of `stream-http`.

## 5.2.1 - 3 Mar 2016

* Improve cleanup on `abort`.

## 5.2.0 - 3 Mar 2016

* Add support for organization and product slugs to `getEventStream`.

## 5.1.1 - 26 Feb 2016

* `JSON.parse` HTTP response body for `getEventStream` error case.

## 5.1.0 - 26 Feb 2016

* Fix event stream. [#8](https://github.com/spark/particle-api-js/issues/8)
* Add `downloadFirmwareBinary`
* Add ability to intercept requests for debugging
* Use library version for User-Agent
* Allow request transfer for `claimDevice`
* `signalDevice` needs to use strings, not numbers.
* `compileCode` `latest` should be a string, not a boolean.

## 5.0.2 - 24 Feb 2016

* Remove trailing slash from `baseUrl`. [#7](https://github.com/spark/particle-api-js/issues/7)

## 5.0.1 - 18 Feb 2016

* Remove need for `require('particle-api-js').default` in CommonJS usage. It is now just `require('particle-api-js')`.

## 5.0.0 - 18 Feb 2016

* Removed need for `babel-runtime`.
* Add `flashDevice`, `compileCode`, and `listAccessTokens`.
* Add missing options to `createWebhook`.
* Remove `downloadFirmwareBinary`.

## 4.2.1 - 8 Feb 2016

* Update contributors.

## 4.2.0 - 8 Feb 2016

* Add `downloadFirmwareBinary`.

## 4.1.0 - 14 Jan 2016

* Add `validatePromoCode`.
* `activateSIM` now requires `promo_code` and `action`.

## 4.0.2 - 16 Nov 2015

* Fix old `code` reference.

## 4.0.1 - 16 Nov 2015

* Change `code` to `statusCode` in rejection.

## 4.0.0 - 16 Nov 2015

* Add `statusCode` to Promise fulfillment.

## 3.0.3 - 6 Nov 2015

* Add `listBuildTargets`.

## 3.0.2 - 5 Nov 2015

* Add `countryCode` to `activateSIM`.

## 3.0.1 - 26 Oct 2015

* Fix `activateSIM`.

## 3.0.0 - 26 Oct 2015

* Replace `request` with `superagent`.
* Add `iccid` to `getClaimCode`.
* Only use form encoding on `login` and `signup`.

## 2.0.1 - 23 Oct 2015

* Removed browser entry in package.json. This makes it possible to bundle the module with other apps that use browserify without causing relative pathing issues.

## 2.0.0 - 20 Oct 2015

* Improved error handling and reporting. Network errors and HTTP errors now both return `code` property that can be more easily used to programmatically detect error types.

## 1.0.1 - 24 Sep 2015

## 1.0.0 - 24 Sep 2015