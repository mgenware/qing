FROM golang:1.17

WORKDIR /server
CMD [ "sh", "-c", "go run main.go dev"]