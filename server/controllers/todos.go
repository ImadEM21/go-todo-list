package controllers

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"time"

	database "todo-list-api/database"
	middlewares "todo-list-api/middlewares"
	utils "todo-list-api/utils"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Complete struct {
	Completed bool `json:"completed"`
}

func GetTodos(res http.ResponseWriter, req *http.Request) {
	userId, _, limit, page, errParams := utils.GetTodosParams(req, []string{"userId", "limit", "page"})
	if errParams != nil {
		res.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(res).Encode(errParams.Error())
		return
	}

	json, err := utils.GetJsonWithTodos(userId, limit, page)
	if err != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(err.Error()))
		return
	}

	payload, errJson := json.MarshalJSON()
	if errJson != nil {
		log.Println(errJson)
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(errJson.Error()))
		return
	}

	res.WriteHeader(http.StatusOK)
	res.Header().Set("Content-Type", "application/json")
	res.Write(payload)
	return
}

func GetTodo(res http.ResponseWriter, req *http.Request) {
	params := mux.Vars(req)
	todoId, err := primitive.ObjectIDFromHex(params["id"])
	if err != nil {
		res.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(res).Encode("No id provided " + err.Error())
		return
	}

	todo, err := database.GetTodo(todoId)
	if err != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(err.Error()))
		return
	}

	res.WriteHeader(http.StatusOK)
	res.Header().Set("Content-Type", "application/json")
	json.NewEncoder(res).Encode(todo)
	return
}

func CreateTodo(res http.ResponseWriter, req *http.Request) {
	var todo *database.Todo
	err := middlewares.DecodeJSONBody(res, req, &todo)
	if err != nil {
		var mr *middlewares.MalformedRequest
		if errors.As(err, &mr) {
			http.Error(res, mr.Msg, mr.Status)
		} else {
			log.Print(err.Error())
			http.Error(res, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		}
		return
	}

	_, _, limit, page, errParams := utils.GetTodosParams(req, []string{"limit", "page"})
	if errParams != nil {
		res.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(res).Encode(errParams.Error())
		return
	}

	if len(todo.Title) < 1 {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte("Le titre est obligatoire"))
		return
	}

	if todo.UserId.IsZero() {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte("L'ID de l'utilisateur est obligatoire"))
		return
	}

	if todo.EndDate.Year() == 1 {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte("Le date n'est pas valide"))
		return
	}

	todo = &database.Todo{
		ID:          primitive.NewObjectID(),
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
		Title:       todo.Title,
		Description: todo.Description,
		EndDate:     todo.EndDate,
		Completed:   todo.Completed,
		UserId:      todo.UserId,
	}

	insertedId, err := database.CreateTodo(todo)
	if err != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(err.Error()))
		return
	}

	json, err := utils.GetJsonWithTodos(todo.UserId, limit, page)
	if err != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(err.Error()))
		return
	}
	json.Set("_id", insertedId)

	payload, errJson := json.MarshalJSON()
	if errJson != nil {
		log.Println(errJson)
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(errJson.Error()))
		return
	}

	res.WriteHeader(http.StatusCreated)
	res.Header().Set("Content-Type", "application/json")
	res.Write(payload)
	return
}

func UpdateTodo(res http.ResponseWriter, req *http.Request) {
	var todo *database.Todo
	err := middlewares.DecodeJSONBody(res, req, &todo)
	if err != nil {
		var mr *middlewares.MalformedRequest
		if errors.As(err, &mr) {
			http.Error(res, mr.Msg, mr.Status)
		} else {
			log.Print(err.Error())
			http.Error(res, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		}
		return
	}

	_, todoId, limit, page, errParams := utils.GetTodosParams(req, []string{"todoId", "limit", "page"})
	if errParams != nil {
		res.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(res).Encode(errParams.Error())
		return
	}
	*&todo.ID = todoId
	*&todo.UpdatedAt = time.Now()
	if todo.Completed {
		*&todo.CompletedDate = time.Now()
	}
	nModified, errMongo := database.UpdateTodo(todo, todoId)
	if errMongo != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(errMongo.Error()))
		return
	}

	json, err := utils.GetJsonWithTodos(todo.UserId, limit, page)
	if err != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(err.Error()))
		return
	}
	json.Set("nModified", nModified)

	payload, errJson := json.MarshalJSON()
	if errJson != nil {
		log.Println(errJson)
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(errJson.Error()))
		return
	}

	res.WriteHeader(http.StatusOK)
	res.Header().Set("Content-Type", "application/json")
	res.Write(payload)
	return
}

func DeleteTodo(res http.ResponseWriter, req *http.Request) {
	userId, todoId, limit, page, errParams := utils.GetTodosParams(req, []string{"userId", "todoId", "limit", "page"})
	if errParams != nil {
		res.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(res).Encode(errParams.Error())
		return
	}

	nDeleted, errMongo := database.DeleteTodo(todoId)
	if errMongo != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(errMongo.Error()))
		return
	}

	json, err := utils.GetJsonWithTodos(userId, limit, page)
	if err != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(err.Error()))
		return
	}
	json.Set("nDeleted", nDeleted)

	payload, errJson := json.MarshalJSON()
	if errJson != nil {
		log.Println(errJson)
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(errJson.Error()))
		return
	}

	res.WriteHeader(http.StatusOK)
	res.Header().Set("Content-Type", "application/json")
	res.Write(payload)
	return
}

func CompleteTodo(res http.ResponseWriter, req *http.Request) {
	var completed Complete
	err := middlewares.DecodeJSONBody(res, req, &completed)
	if err != nil {
		var mr *middlewares.MalformedRequest
		if errors.As(err, &mr) {
			http.Error(res, mr.Msg, mr.Status)
		} else {
			log.Print(err.Error())
			http.Error(res, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		}
		return
	}

	userId, todoId, limit, page, errParams := utils.GetTodosParams(req, []string{"userId", "todoId", "limit", "page"})
	if errParams != nil {
		res.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(res).Encode(errParams.Error())
		return
	}

	nModified, errMongo := database.CompleteTodo(todoId, completed.Completed)
	if errMongo != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(errMongo.Error()))
		return
	}

	json, err := utils.GetJsonWithTodos(userId, limit, page)
	if err != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(err.Error()))
		return
	}
	json.Set("nModified", nModified)

	payload, errJson := json.MarshalJSON()
	if errJson != nil {
		log.Println(errJson)
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(errJson.Error()))
		return
	}

	res.WriteHeader(http.StatusOK)
	res.Header().Set("Content-Type", "application/json")
	res.Write(payload)
	return
}
