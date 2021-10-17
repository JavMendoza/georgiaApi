# georgiaApi
This is the georgia API REST that will be used for georgia matafuegos app.

## Steps for running the app
- npm install
- npm run server

## Doc related with MongoDB Database
You will find a folder named "db_docs/db_backup" which is a MongoDB dump with some initial values for each collection.
To restore the backup, mongorestore command is needed but before trying to run that command MongoDB Database tools are needed.
You can download it from here: https://docs.mongodb.com/database-tools/installation/installation-windows/ 
After that you will be able to restore the backup with the following command:
- "mongorestore --verbose \db_backup\georgia" 
(Run it from the system command line, not the mongo shell).

## API Interaction Postman Examples
You will find a folder named "db_docs/postman_collections" which you can import in postman in order to see how you can interact with the different endpoints
without looking at the code and also check what values and types should be used for each endpoint.
So in that folder you will find different JSON files and the only thing needed is to import them in Postman Collections Tab. 
