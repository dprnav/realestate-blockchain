FROM mariadb

ENV MYSQL_ALLOW_EMPTY_PASSWORD=true
COPY ./init.sql /docker-entrypoint-initdb.d/init.sql 
