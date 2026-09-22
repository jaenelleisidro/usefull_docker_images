FROM golang:1.26-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go build -o go-crud ./cmd
RUN go build -o migrate ./migrate/migrate.go

FROM alpine:3.18

WORKDIR /app

COPY --from=builder /app/go-crud .
COPY --from=builder /app/migrate .

EXPOSE ${PORT}

CMD ["sh", "-c", "./migrate && ./go-crud"]