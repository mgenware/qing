FROM golang:1.17
FROM dpokidov/imagemagick:7.1.0-8

WORKDIR /server
COPY . .
CMD ["go", "run", "main.go", "dev"]