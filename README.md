# rverse2

## Requirements
- PHP 8.0.0 (or greater) or an equivalent environment
- MySQL 5.7 is recommended, you can use any database engine compatible with [illuminate/database](https://github.com/illuminate/database/tree/5.2) in theory though.
- [Composer](https://getcomposer.org/)
- [Redis](https://redis.io/)

## Installing
### Backend
Copy config.example.php, set everything up to your liking (database is most important). I'd also recommend setting `show_errors` to `true` for development. Then run the following commands in the root.
```
$ composer install
$ php topia db:install
$ php topia db:migrate
$ php topia db:setup
```
After that you can either use `$ php topia serve` to use the built in development server or serve the public folder through your webserver of choice.
