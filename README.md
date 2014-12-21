# Locc3 Application

## Install
````
npm install -g meteorite
mrt install
meteor --settings private/settings.json
````

## Backup and Recover
````
mongodump -h localhost --port 3001 -d meteor
mongorestore -h localhost --port 3001 -d meteor dump/meteor
````

## FAQ
### Set user as admin
````
$ meteor shell
Roles.addUsersToRoles(Meteor.users.findOne({username: "myusername"}),"admin")
````

