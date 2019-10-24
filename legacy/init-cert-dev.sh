
DIRECTORY_CERT="dockersettings/certs"
DIRECTORY_DHPARAM="dockersettings/dhparam"
KEYS=("127.0.0.1.xip.io" "api.127.0.0.1.xip.io")
rm -rf ${DIRECTORY_CERT}
mkdir -p ${DIRECTORY_CERT}
rm -rf ${DIRECTORY_DHPARAM}
mkdir -p ${DIRECTORY_DHPARAM}
openssl dhparam -out "${DIRECTORY_DHPARAM}/dhparam.pem" 128
for KEY in ${KEYS[*]}
do
  echo "creating key for ${KEY}"
  openssl dhparam -out "${DIRECTORY_DHPARAM}/${KEY}.dhparam.pem" 128
  openssl req -x509 -out "${DIRECTORY_CERT}/${KEY}.crt" -keyout "${DIRECTORY_CERT}/${KEY}.key" \
    -days 365 -newkey rsa:2048 -nodes -sha256 \
    -subj '/CN=localhost' -extensions EXT -config <( \
     printf "[dn]\nCN=${KEY}\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
  chmod 644 ${DIRECTORY_CERT}/${KEY}.crt
  chmod 600 ${DIRECTORY_CERT}/${KEY}.key
done
