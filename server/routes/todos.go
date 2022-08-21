package routes

import (
	controllers "todo-list-api/controllers"

	"github.com/gorilla/mux"
)

func HandleTodosRequest(router *mux.Router) *mux.Router {
	s := router.PathPrefix("/api/todos").Subrouter().StrictSlash(false)
	s.HandleFunc("/", controllers.GetTodos).Methods("GET").Queries("userId", "{userId}", "limit", "{limit:[0-9]+}", "page", "{page:[0-9]+}")
	s.HandleFunc("/{id}", controllers.GetTodo).Methods("GET")
	s.HandleFunc("/", controllers.CreateTodo).Methods("POST").Queries("limit", "{limit:[0-9]+}", "page", "{page:[0-9]+}")
	s.HandleFunc("/{id}", controllers.UpdateTodo).Methods("PUT")
	s.HandleFunc("/{id}", controllers.DeleteTodo).Methods("DELETE")
	s.HandleFunc("/{id}/complete", controllers.CompleteTodo).Methods("PUT")
	return s
}
