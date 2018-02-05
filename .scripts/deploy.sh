#!/bin/bash
set -x
eval "$(ssh-agent -s)"
chmod 600 ~/.travis/id_rsa
ssh-add ~/.travis/id_rsa

ssh deploy@$IP -p $PORT <<EOF
    cd /var/www/
    git clone https://github.com/partio-scout/tosu-frontend.git
    cd tosu-frontend
    sudo service tosu-backend stop
    npm install
    npm run-script build
    rm -rf /var/www/html
    cp -a /var/www/tosu-frontend/build/. /var/www/html/
    sudo service tosu-backend start
EOF

