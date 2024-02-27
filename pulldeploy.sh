git pull origin
npm run build
rsync -vrtP --delete ~/programs/web/www/products-manager/ ~/programs/web/www/products-manager-previous
rsync -vrtP --delete build/ ~/programs/web/www/products-manager
