# Aurora Learning Management System - Client

## Links
* Staging: http://auroraweb.herokuapp.com
* Documentation: http://auroralms.herokuapp.com/doc/api
* Backend: http://auroralms.herokuapp.com/admin

## Technology
Aurora uses some modern technologies that jive to create a beautiful application.

You may want to be familiar with these technologies if you want to start hacking some code:

* [Git](http://git-scm.org)
* [AngularJS](https://angularjs.org/) 1.3.15
* [NodeJS](https://nodejs.org/)

## Setup
### Prerequisities
#### Operating System
Aurora has been developed and tested under all major operating systems:

  * Linux
  * FreeBSD
  * Mac OS X
  * Windows 8

#### Direct dependencies
  * [AngularJS](https://angularjs.org/) 1.3.15
  * [npm](https://npmjs.org/) 2.1.9
  * [bower](https://bower.io/) 1.3.1

Make sure you have these installed before proceeding to download.

#### Ports
Aurora uses the following ports on development:
8000: Application Server

While you don't need root privileges to run Aurora, you still need to sure you don't have any services running on these ports.

### Clone
If you don't have access to the code base, you need to contact Aurora development team.

### Configuration
Since Aurora is a [NodeJS](http://nodejs.org) application, you need to run the following after downloading the code:

  1. `$ cd aurora-client`
  2. `$ npm install`
  3. `$ npm start`

#### Foreman
Install foreman gem using the command: `gem install foreman`.
You need to set PORT environment variable to 8000 before running foreman.

Start all development servers:

`$ foreman start`

Now, you may visit the following URLs:

* Application Server: http://localhost:8000/

### Deployment
Deployments are made using simple Git push. You may refer to Heroku documentation for more details about the process.