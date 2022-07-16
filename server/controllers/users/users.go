package usersCtr

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"time"

	dbUser "todo-list-api/database/users"
	middlewares "todo-list-api/middlewares"

	"github.com/bitly/go-simplejson"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetUsers(res http.ResponseWriter, req *http.Request) {
	users, err := dbUser.GetUsers()
	if err != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(err.Error()))
		return
	}
	res.WriteHeader(http.StatusOK)
	res.Header().Set("Content-Type", "application/json")
	json.NewEncoder(res).Encode(users)
	return
}

func GetUser(res http.ResponseWriter, req *http.Request) {
	params := mux.Vars(req)
	userId, err := primitive.ObjectIDFromHex(params["id"])
	if err != nil {
		res.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(res).Encode("No id provided " + err.Error())
		return
	}

	user, err := dbUser.GetUser(userId)
	if err != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(err.Error()))
		return
	}

	res.WriteHeader(http.StatusOK)
	res.Header().Set("Content-Type", "application/json")
	json.NewEncoder(res).Encode(user)
	return
}

func CreateUser(res http.ResponseWriter, req *http.Request) {
	var user *dbUser.User
	err := middlewares.DecodeJSONBody(res, req, &user)
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
	user = &dbUser.User{
		ID:        primitive.NewObjectID(),
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
		FirstName: req.FormValue("firstName"),
		LastName:  req.FormValue("lastName"),
	}
	insertedId, err := dbUser.CreateUser(user)
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

func UpdateUser(res http.ResponseWriter, req *http.Request) {
	var user dbUser.User
	err := middlewares.DecodeJSONBody(res, req, &user)
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
	userId, errId := primitive.ObjectIDFromHex(params["id"])
	if errId != nil {
		res.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(res).Encode("No id provided " + errId.Error())
		return
	}
	*&user.ID = userId
	*&user.UpdatedAt = time.Now()
	nModified, errMongo := dbUser.UpdateUser(&user, userId)
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

func DeleteUser(res http.ResponseWriter, req *http.Request) {
	params := mux.Vars(req)
	userId, err := primitive.ObjectIDFromHex(params["id"])
	if err != nil {
		res.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(res).Encode("No id provided " + err.Error())
		return
	}
	nDeleted, errMongo := dbUser.DeleteUser(userId)
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
