package controllers

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strconv"
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
	limit, errLimit := strconv.ParseInt(req.URL.Query().Get("limit"), 0, 64)
	if errLimit != nil {
		res.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(res).Encode("La limite fournie n'est pas valide " + errLimit.Error())
		return
	}
	page, errPage := strconv.ParseInt(req.URL.Query().Get("page"), 0, 64)
	if errPage != nil {
		res.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(res).Encode("La page fournie n'est pas valide " + errPage.Error())
		return
	}
	todos, total, uncompleted, late, lastCompleted, err := database.GetTodos(userId, limit, page)
	if err != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(err.Error()))
		return
	}

	json := simplejson.New()
	json.Set("todos", todos)
	json.Set("total", total)
	json.Set("uncompleted", uncompleted)
	json.Set("late", late)
	json.Set("lastCompleted", lastCompleted)

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

	limit, errLimit := strconv.ParseInt(req.URL.Query().Get("limit"), 0, 64)
	if errLimit != nil {
		res.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(res).Encode("La limite fournie n'est pas valide " + errLimit.Error())
		return
	}
	page, errPage := strconv.ParseInt(req.URL.Query().Get("page"), 0, 64)
	if errPage != nil {
		res.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(res).Encode("La page fournie n'est pas valide " + errPage.Error())
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

	newTodos, total, uncompleted, late, lastCompleted, errTodos := database.GetTodos(todo.UserId, limit, page)
	if errTodos != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(errTodos.Error()))
		return
	}

	json := simplejson.New()
	json.Set("_id", insertedId)
	json.Set("todos", newTodos)
	json.Set("total", total)
	json.Set("uncompleted", uncompleted)
	json.Set("late", late)
	json.Set("lastCompleted", lastCompleted)

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

	limit, errLimit := strconv.ParseInt(req.URL.Query().Get("limit"), 0, 64)
	if errLimit != nil {
		res.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(res).Encode("La limite fournie n'est pas valide " + errLimit.Error())
		return
	}
	page, errPage := strconv.ParseInt(req.URL.Query().Get("page"), 0, 64)
	if errPage != nil {
		res.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(res).Encode("La page fournie n'est pas valide " + errPage.Error())
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
	if todo.Completed {
		*&todo.CompletedDate = time.Now()
	}
	nModified, errMongo := database.UpdateTodo(todo, todoId)
	if errMongo != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(errMongo.Error()))
		return
	}

	newTodos, total, uncompleted, late, lastCompleted, errTodos := database.GetTodos(todo.UserId, limit, page)
	if errTodos != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(errTodos.Error()))
		return
	}

	json := simplejson.New()
	json.Set("nModified", nModified)
	json.Set("todos", newTodos)
	json.Set("total", total)
	json.Set("uncompleted", uncompleted)
	json.Set("late", late)
	json.Set("lastCompleted", lastCompleted)

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
	limit, errLimit := strconv.ParseInt(req.URL.Query().Get("limit"), 0, 64)
	if errLimit != nil {
		res.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(res).Encode("La limite fournie n'est pas valide " + errLimit.Error())
		return
	}
	page, errPage := strconv.ParseInt(req.URL.Query().Get("page"), 0, 64)
	if errPage != nil {
		res.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(res).Encode("La page fournie n'est pas valide " + errPage.Error())
		return
	}

	params := mux.Vars(req)
	todoId, errTodoId := primitive.ObjectIDFromHex(params["id"])
	if errTodoId != nil {
		res.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(res).Encode("No id provided " + errTodoId.Error())
		return
	}
	userId, errUserId := primitive.ObjectIDFromHex(params["userId"])
	if errUserId != nil {
		res.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(res).Encode("No id provided " + errUserId.Error())
		return
	}
	nDeleted, errMongo := database.DeleteTodo(todoId)
	if errMongo != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(errMongo.Error()))
		return
	}

	newTodos, total, uncompleted, late, lastCompleted, errTodos := database.GetTodos(userId, limit, page)
	if errTodos != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(errTodos.Error()))
		return
	}

	json := simplejson.New()
	json.Set("nDeleted", nDeleted)
	json.Set("todos", newTodos)
	json.Set("total", total)
	json.Set("uncompleted", uncompleted)
	json.Set("late", late)
	json.Set("lastCompleted", lastCompleted)

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
