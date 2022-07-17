package main

import (
	"flag"
	"log"
	"net/http"
	"time"

	todosRoutes "todo-list-api/routes/todos"
	usersRoutes "todo-list-api/routes/users"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
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

	srv := &http.Server{
		Handler:      n,
		Addr:         "127.0.0.1:3000",
		WriteTimeout: time.Second * 15,
		ReadTimeout:  time.Second * 15,
		IdleTimeout:  time.Second * 60,
	}

	todosRoutes.HandleTodosRequest(router)
	usersRoutes.HandleUsersRequest(router)

	log.Fatal(srv.ListenAndServe())
}
