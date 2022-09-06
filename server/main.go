package main

import (
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
)

func main() {
	envErr := godotenv.Load()
	if envErr != nil {
		log.Fatal("No .env file found")
	}

	err := database.SetEmailIndex()
	if err != nil {
		log.Fatalln(err.Error())
	}

	router := mux.NewRouter().StrictSlash(false)

	n := negroni.Classic()
	n.UseHandler(router)

	routes.HandleTodosRequest(router)
	routes.HandleUsersRequest(router)
	routes.HandleTokensRequest(router)
	routes.HandleStaticFiles(router)

	opts := cors.Options{
		AllowedOrigins: []string{os.Getenv("ORIGIN_ALLOWED")},
		AllowedHeaders: []string{"X-Requested-With", "Content-Type", "Authorization"},
		AllowedMethods: []string{"GET", "HEAD", "POST", "PUT", "OPTIONS", "DELETE"},
		Debug:          false,
	}
	handler := cors.New(opts).Handler(n)

	srv := &http.Server{
		Handler:      handler,
		Addr:         "0.0.0.0:3000",
		WriteTimeout: time.Second * 15,
		ReadTimeout:  time.Second * 15,
		IdleTimeout:  time.Second * 60,
	}

	log.Fatal(srv.ListenAndServe())
}
