# Используем лёгкий nginx для раздачи статики
FROM nginx:alpine

# Копируем файлы игры
COPY . /usr/share/nginx/html/

# Открываем порт 80 (только внутри Docker-сети)
EXPOSE 80

# Nginx по умолчанию слушает 80 и запускается в foreground
CMD ["nginx", "-g", "daemon off;"]
