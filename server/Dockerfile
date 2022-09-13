FROM golang:1.18.3

# Install git
RUN apt-get update
RUN apt-get install -qq git

# set the working directory
WORKDIR /opt/server

# Copy the source from the current directory to the working Directory inside the container 
# Source also contains go.mod and go.sum which are dependency files
COPY . .

# Get Dependency
RUN go mod download
RUN go build -o /todo-list-api

CMD ["/todo-list-api"]