package main

import (
	"context"
	"flag"
	"log"
	"net/http"
	"os"
	"time"

	database "todo-list-api/database"
	routes "todo-list-api/routes"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"github.com/urfave/negroni"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	envErr := godotenv.Load()
	if envErr != nil {
		log.Println("No .env file found")
	}

	client, ctx := database.InitDb()
	defer database.CloseDb(&client, ctx)
	coll := client.Database("todos").Collection("users")
	_, err := coll.Indexes().CreateOne(
		context.Background(),
		mongo.IndexModel{
			Keys:    bson.D{{Key: "email", Value: 1}},
			Options: options.Index().SetUnique(true),
		},
	)
	if err != nil {
		log.Fatalln(err.Error())
	}

	router := mux.NewRouter().StrictSlash(false)

	var dir string

	flag.StringVar(&dir, "dir", ".", "the directory to serve files from. Defaults to the current dir")
	flag.Parse()

	router.PathPrefix("/static").Handler(http.StripPrefix("/", http.FileServer(http.Dir(dir))))

	n := negroni.Classic()
	n.UseHandler(router)

	routes.HandleTodosRequest(router)
	routes.HandleUsersRequest(router)
	routes.HandleTokensRequest(router)

	opts := cors.Options{
		AllowedOrigins: []string{os.Getenv("ORIGIN_ALLOWED")},
		AllowedHeaders: []string{"X-Requested-With", "Content-Type", "Authorization"},
		AllowedMethods: []string{"GET", "HEAD", "POST", "PUT", "OPTIONS", "DELETE"},
		Debug:          false,
	}
	handler := cors.New(opts).Handler(n)

	srv := &http.Server{
		Handler:      handler,
		Addr:         "127.0.0.1:3000",
		WriteTimeout: time.Second * 15,
		ReadTimeout:  time.Second * 15,
		IdleTimeout:  time.Second * 60,
	}

	log.Fatal(srv.ListenAndServe())
}
