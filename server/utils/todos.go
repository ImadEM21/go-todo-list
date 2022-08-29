package utils

import (
	"net/http"
	"strconv"

	database "todo-list-api/database"

	"github.com/bitly/go-simplejson"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetJsonWithTodos(userId primitive.ObjectID, limit int64, page int64) (*simplejson.Json, error) {
	todos, total, uncompleted, late, lastCompleted, err := database.GetTodos(userId, limit, page)
	if err != nil {
		return nil, err
	}
	json := simplejson.New()
	json.Set("todos", todos)
	json.Set("total", total)
	json.Set("uncompleted", uncompleted)
	json.Set("late", late)
	json.Set("lastCompleted", lastCompleted)
	return json, nil
}

func GetTodosParams(req *http.Request, values []string) (primitive.ObjectID, primitive.ObjectID, int64, int64, error) {
	params := mux.Vars(req)
	userId, errUserId := primitive.ObjectIDFromHex(req.URL.Query().Get("userId"))
	if errUserId != nil && StringInSlice("userId", values) {
		return primitive.NilObjectID, primitive.NilObjectID, 0, 0, errUserId
	}
	todoId, errTodoId := primitive.ObjectIDFromHex(params["id"])
	if errTodoId != nil && StringInSlice("todoId", values) {
		return primitive.NilObjectID, primitive.NilObjectID, 0, 0, errTodoId
	}
	limit, errLimit := strconv.ParseInt(req.URL.Query().Get("limit"), 0, 64)
	if errLimit != nil && StringInSlice("limit", values) {
		return primitive.NilObjectID, primitive.NilObjectID, 0, 0, errLimit
	}
	page, errPage := strconv.ParseInt(req.URL.Query().Get("page"), 0, 64)
	if errPage != nil && StringInSlice("page", values) {
		return primitive.NilObjectID, primitive.NilObjectID, 0, 0, errPage
	}
	return userId, todoId, limit, page, nil
}
