
#!/bin/bash
set -x
openssl aes-256-cbc -K $encrypted_1f34a7791e59_key -iv $encrypted_1f34a7791e59_iv -in deploy.pem.enc -out deploy.pem -d
rm deploy.pem.enc
sudo chmod 600 deploy.pem
sudo mv deploy.pem ~/.travis/id_rsa
