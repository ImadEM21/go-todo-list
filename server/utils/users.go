package utils

import (
	database "todo-list-api/database"

	"github.com/bitly/go-simplejson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetJsonWithUser(userId primitive.ObjectID) (*simplejson.Json, error) {
	updatedUser, errUpdate := database.GetUser(userId, false)
	if errUpdate != nil {
		return nil, errUpdate
	}
	json := simplejson.New()
	json.Set("user", updatedUser)
	return json, nil
}
