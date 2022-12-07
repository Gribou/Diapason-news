#!/bin/sh

# utiliser par le pipeline gitlab
# génère un fichier .env à partir de l'environnement courant
# fichier que npm pourra utiliser pour build pendant la construction de l'image docker

touch web/.env
echo "REACT_APP_DEBUG=0">>web/.env
echo "REACT_APP_STATE_ENCRYPTION_KEY=$REACT_APP_STATE_ENCRYPTION_KEY" >> web/.env

if [ $SUBDIRECTORY == "root" ]; then
    echo "PUBLIC_URL=/" >> web/.env
    echo "REACT_APP_BACKEND_HOST=" >> web/.env
else
    echo "PUBLIC_URL=/${SUBDIRECTORY}" >> web/.env
    echo "REACT_APP_BACKEND_HOST=/${SUBDIRECTORY}" >> web/.env
fi
