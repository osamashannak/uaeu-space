# syntax=docker/dockerfile:1

# Build stage
FROM golang:1.22 AS builder

# Argument to choose which service to build
ARG SERVICE
WORKDIR /app

# Copy go mod/sum and download deps
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the code
COPY . .

# Build the chosen service
RUN CGO_ENABLED=0 GOOS=linux go build -o /bin/service $SERVICE

# Runtime stage
FROM gcr.io/distroless/base-debian12

# Copy the built binary from builder
COPY --from=builder /bin/service /service

# Set entrypoint
ENTRYPOINT ["/service"]
