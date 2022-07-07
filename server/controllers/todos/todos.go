package todosCtr

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	dbTodos "todo-list-api/database/todos"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetTodos(res http.ResponseWriter, req *http.Request) {
	todos, err := dbTodos.GetTodos()
	if err != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(err.Error()))
	}
	res.WriteHeader(http.StatusOK)
	res.Header().Set("Content-Type", "application/json")
	json.NewEncoder(res).Encode(todos)
}

func GetTodo(res http.ResponseWriter, req *http.Request) {
	params := mux.Vars(req)
	todoId, err := primitive.ObjectIDFromHex(params["id"])
	if err != nil {
		res.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(res).Encode("No id provided")
	}
	todo, err := dbTodos.GetTodo(todoId)
	if err != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(err.Error()))
	}
	res.WriteHeader(http.StatusOK)
	res.Header().Set("Content-Type", "application/json")
	json.NewEncoder(res).Encode(todo)
}

func CreateTodo(res http.ResponseWriter, req *http.Request) {
	endDate, errDate := time.Parse(time.RFC3339, req.FormValue("endDate"))
	if errDate != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(errDate.Error()))
	}
	completed, errCom := strconv.ParseBool(req.FormValue("completed"))
	if errCom != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(errCom.Error()))
	}
	todo := &dbTodos.Todo{
		ID:          primitive.NewObjectID(),
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
		Title:       req.FormValue("title"),
		Description: req.FormValue("description"),
		EndDate:     endDate,
		Completed:   completed,
	}
	insertedId, err := dbTodos.CreateTodo(todo)
	if err != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(err.Error()))
	}
	res.WriteHeader(http.StatusCreated)
	res.Header().Set("Content-Type", "application/json")
	json.NewEncoder(res).Encode(insertedId)
}
