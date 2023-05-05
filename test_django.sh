curl -X PUT https://django.producten.kaas/api/lists/63/ -H 'Content-Type: application/json' -d '{"name":"HELLOWORLD2","type":1}' -k

echo '\n\n\n\n'

curl -X GET https://django.producten.kaas/api/lists/ -k
