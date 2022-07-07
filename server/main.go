package main

import (
	"context"
	"log"
	"os"

	todosRoutes "todo-list-api/routes/todos"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var ctx = context.TODO()

func main() {
	envErr := godotenv.Load()
	if envErr != nil {
		log.Println("No .env file found")
	}

	uri := os.Getenv("MONGODB_URI")
	if uri == "" {
		log.Fatal("You must set your 'MONGODB_URI' environmental variable. See\n\t https://www.mongodb.com/docs/drivers/go/current/usage-examples/#environment-variable")
	}

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		panic(err)
	}

	defer func() {
		err := client.Disconnect(ctx)
		if err != nil {
			panic(err)
		}
	}()
	todosRoutes.HandleTodosRequest(*client, ctx)
}
