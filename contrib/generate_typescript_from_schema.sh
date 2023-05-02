#!/bin/bash

cd src/client/matrix/schema;
mkdir .schema_cache;
cp * .schema_cache/;
cd .schema_cache;
for i in ./*; do mv -i "$i" "${i%.json}"; done
npx -p json-schema-to-typescript json2ts -i '*' -o ../gen_types;
cd ..;
rm -r .schema_cache;