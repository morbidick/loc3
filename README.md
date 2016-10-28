# Locc3 Application

## Startup
meteor needs to be installed, no other dependencies
````
vagrant up #optional
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

