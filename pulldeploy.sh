git pull origin
npm run build
rsync -vrtP --delete build/ ~/programs/web/www/products-manager
