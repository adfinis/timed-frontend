#!/bin/bash

udm groups/group create \
  --set name="adsy-user" \
  --set description="adsy user" \
  --position="cn=groups,$(ucr get ldap/base)"
