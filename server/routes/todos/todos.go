package todosRoutes

import (
	todosCtr "todo-list-api/controllers/todos"

	"github.com/gorilla/mux"
)

func HandleTodosRequest(router *mux.Router) *mux.Router {
	//prefix := "/todos"
	//router := mux.NewRouter().StrictSlash(false)
	s := router.PathPrefix("/todos").Subrouter()
	s.HandleFunc("/", todosCtr.GetTodos).Methods("GET")
	s.HandleFunc("/{id}", todosCtr.GetTodo).Methods("GET")
	s.HandleFunc("/", todosCtr.CreateTodo).Methods("POST")
	s.HandleFunc("/{id}", todosCtr.UpdateTodo).Methods("PUT")
	s.HandleFunc("/{id}", todosCtr.DeleteTodo).Methods("DELETE")
	s.HandleFunc("/{id}/complete", todosCtr.CompleteTodo).Methods("PUT")
	return router
}
