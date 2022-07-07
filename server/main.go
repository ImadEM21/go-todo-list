package main

import (
	"log"
	"net/http"
	todosRoutes "todo-list-api/routes/todos"
)

func main() {
	router := todosRoutes.HandleTodosRequest()
	log.Fatal(http.ListenAndServe(":3000", router))
}
