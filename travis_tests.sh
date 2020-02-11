#!/bin/bash
# Run different test suites on Travis depending on environment variables
set -ev
if [ "${TEST_SUITE}" = "browser" ]; then
  # Load display for browser tests
  export DISPLAY=:99.0
  npm run build
  npm run test:browser
else
  npm run test
fi
