package todosCtr

import (
	"context"
	"encoding/json"
	"net/http"

	dbTodos "todo-list-api/database/todos"

	"go.mongodb.org/mongo-driver/mongo"
)

func GetTodos(res http.ResponseWriter, req *http.Request, client mongo.Client, ctx context.Context) {
	todos, err := dbTodos.GetTodos(client, ctx)
	if err != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(err.Error()))
	}
	res.WriteHeader(http.StatusAccepted)
	json.NewEncoder(res).Encode(todos)
}
