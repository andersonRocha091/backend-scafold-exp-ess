
# echo 'Creating application user and db'

# mongo heroes --host localhost -u admin -p senhaadmin --authenticationDatabase admin --eval "db.createUser({user:'anderson', pwd:'anderson', roles:[{role:'readWrite',db:'heroes'}]})"
mongo ${MONGO_INITDB_DATABASE} \
        --host ${MONGO_HOST} \
        --port ${MONGO_PORT} \
        -u ${MONGO_INITDB_ROOT_USERNAME} \
        -p ${MONGO_INITDB_ROOT_PASSWORD} \
        --authenticationDatabase admin \
        --eval "db.createUser({user: '${DATABASE_USERNAME}', pwd: '${DATABASE_PASSWORD}', roles:[{role:'dbOwner', db: '${MONGO_INITDB_DATABASE}'}]});"