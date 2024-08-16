# timesheet

build
sudo docker-compose up --build -d


auto signer 
mkdir -p ./nginx/certs
openssl req -x509 -nodes -newkey rsa:2048 -keyout ./nginx/certs/selfsigned.key -out ./nginx/certs/selfsigned.crt -days 365 -subj "/CN=yourdomain.com"
