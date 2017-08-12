#!/bin/bash
set -e
set -x

rm -rf www/

# app.avotoast.net
cp src/config-avotoast.ts src/config.ts
ionic cordova build browser --prod --aot --minifycss --minifyjs --optimizejs
aws s3 cp www/ s3://app.avotoast.net/ --recursive

# mirror.servercobra.in
cp src/config-mirror.ts src/config.ts
ionic cordova build browser --prod --aot --minifycss --minifyjs --optimizejs
aws s3 cp www/ s3://mirror.servercobra.com/ --recursive

# For resuming local dev
cp src/config-dev.ts src/config.ts
