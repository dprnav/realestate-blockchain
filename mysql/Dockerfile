From mariadb
# ROOT PASSWORD
ENV MYSQL_ROOT_PASSWORD=redhat



ENV MYSQL_DATA_DIR=/var/lib/mysql \
    MYSQL_RUN_DIR=/run/mysqld \
    MYSQL_LOG_DIR=/var/log/mysql

ADD . /tmp/

RUN mysqld && \
         mysql -u root -p$MYSQL_ROOT_PASSWORD  -e "GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'redhat';FLUSH PRIVILEGES;" && \
        mysql -u root -p${MYSQL_ROOT_PASSWORD}  < /tmp/bitcoin.sql && mysql -u root -p${MYSQL_ROOT_PASSWORD}  < /tmp/property.sql

#PORT
EXPOSE 3306
