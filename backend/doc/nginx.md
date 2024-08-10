pour cree une nouvaux fichier de conf
```
sudo nano /etc/nginx/sites-available/llio.fr

```

server {
    listen 80;
    server_name 217.160.9.208;

    location / {
        root /var/www/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
            rewrite ^/api/?(.*) /$1 break;
            proxy_pass http://127.0.0.1:5000;
            proxy_redirect     off;
            proxy_set_header   Host $host;
    }
}


server {
    listen 80;
    server_name multipeda.llio.fr;



    location /api {
            rewrite ^/api/?(.*) /$1 break;
            proxy_pass http://127.0.0.1:5000;
            proxy_redirect     off;
            proxy_set_header   Host $host;
    }
}

pour restart le serveur nginx

```
sudo nginx -s reload

```

pour copier les react bulder dans le vpn

```
scp -r ./dist/* root@217.160.9.208:/var/www/html
```


tuto 

https://dev.to/christopherkapic/how-to-deploy-a-nodejs-server-with-nginx-on-a-vps-43mb


PGPASSWORD=passs pg_dump -h localhost -p 5432 -U timesheet2 -d timesheet2 -f /home/deldon/backup/backup-$(date +%Y-%m-%d).sql