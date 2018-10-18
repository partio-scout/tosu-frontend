#!/bin/bash
set -x
echo "$PRIVATE_KEY" > tosu_node.pem
chmod 600 tosu_node.pem
mv tosu_node.pem ~/.travis/id_rsa