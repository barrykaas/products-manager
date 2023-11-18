npm run build
rsync -vrtP --delete build/ kaas:/home/kaas/programs/web/www/products-manager
