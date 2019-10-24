DIRECTORY_DHPARAM="dockersettings/dhparam"
mkdir ${DIRECTORY_DHPARAM} -p
openssl dhparam -out "${DIRECTORY_DHPARAM}/dhparam.pem" 2048
