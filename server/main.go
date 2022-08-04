package main

import (
	"flag"
	"log"
	"net/http"
	"time"

	routes "todo-list-api/routes"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"github.com/urfave/negroni"
)

func main() {
	envErr := godotenv.Load()
	if envErr != nil {
		log.Println("No .env file found")
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

	/*corsOpts := cors.Options{
		AllowedHeaders: []string{"X-Requested-With", "Content-Type"},
		AllowedOrigins: []string{os.Getenv("ORIGIN_ALLOWED")},
		AllowedMethods: []string{"GET", "HEAD", "POST", "PUT", "OPTIONS", "DELETE"},
	}

	handler := cors.New(corsOpts).Handler(n)*/

	handler := cors.AllowAll().Handler(n)

	srv := &http.Server{
		Handler:      handler,
		Addr:         "127.0.0.1:3000",
		WriteTimeout: time.Second * 15,
		ReadTimeout:  time.Second * 15,
		IdleTimeout:  time.Second * 60,
	}

	log.Fatal(srv.ListenAndServe())
}
