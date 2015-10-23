changelog
=========
10/23/2015 - 2.0.1 - Removed browser entry in package.json. This makes it possible to bundle the module with other apps that use browserify without causing relative pathing issues.

10/20/2015 - 2.0.0 - Improved error handling and reporting. Network errors and HTTP errors now both return `code` property that can be more easily used to programmatically detect error types.