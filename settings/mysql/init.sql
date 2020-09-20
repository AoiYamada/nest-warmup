-- TODO: Get info from .env --
CREATE DATABASE IF NOT EXISTS todo;
GRANT ALL PRIVILEGES ON todo.* TO 'todoAdmin'@'%';
