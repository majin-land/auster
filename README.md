## Auster - money management solution

Setup process
1. run `yarn install`
2. copy .env.sample file and create .env file in each of the packages/site and packages/server
3. run `yarn run dev`

this will run both React web app and NodeJS server at the same time
if you follow the port in the .env.sample
http://localhost:4010 will be NodeJS server
http://localhost:4020 will be React web app

for NodeJS server you can test with these links to check if it work
1. http://localhost:4010/public/time will return server time
2. http://localhost:4010/public/hello/imajin will return 'Hello, Imajin!'