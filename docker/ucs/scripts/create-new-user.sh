#!/bin/bash

echo "First Name:"
read firstname
echo "Last Name:"
read lastname

firstname_l="$(echo $firstname | tr '[:upper:]' '[:lower:]')"
lastname_l="$(echo $lastname | tr '[:upper:]' '[:lower:]')"
email="$firstname_l.$lastname_l@adfinis-sygroup.ch"
username="$firstname_l$(echo $lastname_l | head -c 1)"
password="123qweasd"

udm users/user create \
  --position="cn=users,$(ucr get ldap/base)" \
  --set username="$username" \
  --set firstname="$firstname" \
  --set lastname="$lastname" \
  --set password="$password"\
  --set description="$firstname $lastname" \
  --set e-mail="$email" \
  --set shell="/bin/bash" \
  --set primaryGroup="cn=adsy-user,cn=groups,$(ucr get ldap/base)"

echo ""
echo "Name:     $firstname $lastname"
echo "Username: $username"
echo "Passwort: $password"
echo "Email:    $email"
echo ""

exit
