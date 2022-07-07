package todosRoutes

import (
	todosCtr "todo-list-api/controllers/todos"

	"github.com/gorilla/mux"
)

func HandleTodosRequest() *mux.Router {
	prefix := "/todos"
	router := mux.NewRouter().StrictSlash(false)
	router.HandleFunc(prefix, todosCtr.GetTodos).Methods("GET")
	router.HandleFunc(prefix+"/{id}", todosCtr.GetTodo).Methods("GET")
	router.HandleFunc(prefix+"/", todosCtr.CreateTodo).Methods("POST")
	return router
}
