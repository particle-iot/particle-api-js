#!/bin/bash
# Run different test suites on Travis depending on environment variables
set -ev
if [ "${TEST_SUITE}" = "browser" ]; then
  # Load display for browser tests
  export DISPLAY=:99.0
  sh -e /etc/init.d/xvfb start
  # give xvfb some time to start
  sleep 3 
  npm run build
  npm run test:browser
else
  npm run test
fi
