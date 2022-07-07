package todosRoutes

import (
	"context"
	"log"
	"net/http"

	todosCtr "todo-list-api/controllers/todos"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/mongo"
)

func HandleTodosRequest(client mongo.Client, ctx context.Context) {
	prefix := "/todos"
	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc(prefix+"/", func(w http.ResponseWriter, r *http.Request) {
		todosCtr.GetTodos(w, r, client, ctx)
	}).Methods("GET")
	log.Fatal(http.ListenAndServe(":3000", router))
}
