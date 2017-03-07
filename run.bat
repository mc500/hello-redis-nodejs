@ECHO OFF
REM Script for running in local

FOR /F "delims=" %%i IN ('node vcap-local.js') DO set VCAP_SERVICES=%%i
npm start