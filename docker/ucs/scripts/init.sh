#!/bin/bash

udm groups/group create \
  --set name="example-group" \
  --set description="example group" \
  --position="cn=groups,$(ucr get ldap/base)"
