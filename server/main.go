package main

import (
	"flag"
	"log"
	"net/http"
	"time"

	todosRoutes "todo-list-api/routes/todos"
	usersRoutes "todo-list-api/routes/users"

	"github.com/gorilla/mux"
)

func main() {
	router := mux.NewRouter().StrictSlash(false)

	var dir string

	flag.StringVar(&dir, "dir", ".", "the directory to serve files from. Defaults to the current dir")
	flag.Parse()

	router.PathPrefix("/static").Handler(http.StripPrefix("/", http.FileServer(http.Dir(dir))))

	srv := &http.Server{
		Handler:      router,
		Addr:         "127.0.0.1:3000",
		WriteTimeout: time.Second * 15,
		ReadTimeout:  time.Second * 15,
		IdleTimeout:  time.Second * 60,
	}

	todosRoutes.HandleTodosRequest(router)
	usersRoutes.HandleUsersRequest(router)

	log.Fatal(srv.ListenAndServe())
}
