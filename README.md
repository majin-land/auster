## Auster by MAJIN - money management solution

Please check out Auster at: [https://auster.majin.land](https://auster.majin.land)

## Project Goals
Majin develop project Auster ini untuk menyebarkan ide pengelolaan uang pribadi
dengan menyediakan system gratis yg gampang dipakai oleh masyarakat

Dan disamping itu, kita ingin menggunakan source code project ini
sebagai contoh pengajaran web application development

## Project Setup

Setup process
1. run `yarn install`
1. copy .env.sample file and create .env file di folder yang sama
1. setup database `auster` di localhost postgres
1. setup database structure, run `yarn workspace server run migrate`
1. prefil database with some data, run `yarn workspace server run seed`
1. run `yarn run dev`

this will run both React web app and NodeJS server at the same time
if you follow the port in the .env
http://localhost:4010 will be NodeJS server
http://localhost:4020 will be React web app

for NodeJS server you can test with these links to check if it work
1. http://localhost:4010/public/time will return server time
1. http://localhost:4010/public/hello/majin will return 'Hello, Majin!'
