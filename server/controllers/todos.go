package controllers

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"time"

	database "todo-list-api/database"
	middlewares "todo-list-api/middlewares"

	"github.com/bitly/go-simplejson"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Complete struct {
	Completed bool `json:"completed"`
}

func GetTodos(res http.ResponseWriter, req *http.Request) {
	userId, err := primitive.ObjectIDFromHex(req.URL.Query().Get("userId"))
	if err != nil {
		res.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(res).Encode("No user id provided " + err.Error())
		return
	}
	todos, err := database.GetTodos(userId)
	if err != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(err.Error()))
		return
	}
	res.WriteHeader(http.StatusOK)
	res.Header().Set("Content-Type", "application/json")
	json.NewEncoder(res).Encode(todos)
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

func isDateValue(stringDate string) bool {
	_, err := time.Parse(time.RFC3339, stringDate)
	return err == nil
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

	if len(todo.Title) < 1 {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte("Le titre est obligatoire"))
		return
	}

	if len(todo.Description) < 1 {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte("La description est obligatoire"))
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

	json := simplejson.New()
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

	params := mux.Vars(req)
	todoId, errId := primitive.ObjectIDFromHex(params["id"])
	if errId != nil {
		res.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(res).Encode("No id provided " + errId.Error())
		return
	}
	*&todo.ID = todoId
	*&todo.UpdatedAt = time.Now()
	nModified, errMongo := database.UpdateTodo(todo, todoId)
	if errMongo != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(errMongo.Error()))
		return
	}
	json := simplejson.New()
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
	params := mux.Vars(req)
	todoId, err := primitive.ObjectIDFromHex(params["id"])
	if err != nil {
		res.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(res).Encode("No id provided " + err.Error())
		return
	}
	nDeleted, errMongo := database.DeleteTodo(todoId)
	if errMongo != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(errMongo.Error()))
		return
	}

	json := simplejson.New()
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
	params := mux.Vars(req)
	todoId, err := primitive.ObjectIDFromHex(params["id"])
	if err != nil {
		res.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(res).Encode("No id provided " + err.Error())
		return
	}
	nModified, errMongo := database.CompleteTodo(todoId, completed.Completed)
	if errMongo != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(errMongo.Error()))
		return
	}

	json := simplejson.New()
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
