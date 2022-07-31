package controllers

import (
	"encoding/json"
	"net/http"

	database "todo-list-api/database"

	"github.com/kamva/mgm/v3"
	"github.com/kamva/mgm/v3/operator"
	"go.mongodb.org/mongo-driver/bson"
)

func GetBooks(res http.ResponseWriter, req *http.Request) {
	result := []database.Book{}

	err := mgm.Coll(&database.Book{}).SimpleFind(&result, bson.M{"pages": bson.M{operator.Gt: 24}})
	if err != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(err.Error()))
		return
	}
	res.WriteHeader(http.StatusOK)
	res.Header().Set("Content-Type", "application/json")
	json.NewEncoder(res).Encode(result)
	return
}
