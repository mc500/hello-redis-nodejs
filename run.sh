#!/bin/sh

export VCAP_SERVICES=$(node vcap-local.js)
npm start