REM  SCRIPT START
start node ./WebServerGateway.js >> ./logs/WebServerGateway.log 2>>&1
start node ./loginServer.js >> ./logs/loginServer.log 2>>&1
start node ./UserAdminServer.js >> ./logs/UserAdminServer.log 2>>&1
REM  SCRIPT END