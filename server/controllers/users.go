package controllers

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"net/mail"
	"os"
	"regexp"
	"time"

	database "todo-list-api/database"
	middlewares "todo-list-api/middlewares"

	"github.com/bitly/go-simplejson"
	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

var jwtKey = []byte(os.Getenv("TOKEN"))

type Credentials struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}
type Claims struct {
	Email string `json:"email"`
	jwt.StandardClaims
}

type UpdateUserInfo struct {
	FirstName string `bson:"firstName" json:"firstName"`
	LastName  string `bson:"lastName" json:"lastName"`
	Email     string `bson:"email" json:"email"`
}

type UpdateUserPassword struct {
	Password string `bson:"password" json:"password"`
}

func GetUsers(res http.ResponseWriter, req *http.Request) {
	users, err := database.GetUsers()
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

	user, err := database.GetUser(userId, 0)
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

func UpdateUser(res http.ResponseWriter, req *http.Request) {
	var payload UpdateUserInfo
	err := middlewares.DecodeJSONBody(res, req, &payload)
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
	user, errUser := database.GetUser(userId, 1)
	if errUser != nil {
		res.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(res).Encode(errUser.Error())
		return
	}
	if user.Email != payload.Email {
		exists, errExists := database.CheckIfUserExistsByEmail(payload.Email)
		if errExists != nil {
			res.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(res).Encode(errExists.Error())
			return
		}
		if exists {
			res.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(res).Encode("L'adresse mail " + payload.Email + " est déjà utilisée")
			return
		}
	}
	var newUser = &database.User{
		ID:        user.ID,
		CreatedAt: user.CreatedAt,
		UpdatedAt: time.Now(),
		Email:     payload.Email,
		Password:  user.Password,
		FirstName: payload.FirstName,
		LastName:  payload.LastName,
	}
	nModified, errMongo := database.UpdateUser(newUser, userId)
	if errMongo != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(errMongo.Error()))
		return
	}
	updatedUser, errUpdate := database.GetUser(userId, 0)
	if errUpdate != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(errUpdate.Error()))
		return
	}
	json := simplejson.New()
	json.Set("user", updatedUser)
	json.Set("nModified", nModified)

	payloadJson, errJson := json.MarshalJSON()
	if errJson != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(errJson.Error()))
		return
	}

	res.WriteHeader(http.StatusOK)
	res.Header().Set("Content-Type", "application/json")
	res.Write(payloadJson)
	return
}

func UpdatePassword(res http.ResponseWriter, req *http.Request) {
	var payload UpdateUserPassword
	err := middlewares.DecodeJSONBody(res, req, &payload)
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

	user, errUser := database.GetUser(userId, 0)
	if errUser != nil {
		res.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(res).Encode(errUser.Error())
		return
	}

	hash, errHash := bcrypt.GenerateFromPassword([]byte(payload.Password), 10)
	if errHash != nil {
		res.WriteHeader(http.StatusInternalServerError)
		res.Write([]byte(errHash.Error()))
		return
	}

	var newUser = &database.User{
		ID:        user.ID,
		CreatedAt: user.CreatedAt,
		UpdatedAt: time.Now(),
		Email:     user.Email,
		Password:  string(hash),
		FirstName: user.FirstName,
		LastName:  user.LastName,
	}
	nModified, errMongo := database.UpdateUser(newUser, userId)
	if errMongo != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(errMongo.Error()))
		return
	}
	updatedUser, errUpdate := database.GetUser(userId, 0)
	if errUpdate != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(errUpdate.Error()))
		return
	}
	json := simplejson.New()
	json.Set("user", updatedUser)
	json.Set("nModified", nModified)

	payloadJson, errJson := json.MarshalJSON()
	if errJson != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(errJson.Error()))
		return
	}

	res.WriteHeader(http.StatusOK)
	res.Header().Set("Content-Type", "application/json")
	res.Write(payloadJson)
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
	nDeleted, errMongo := database.DeleteUser(userId)
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

func Login(res http.ResponseWriter, req *http.Request) {
	var creds Credentials
	err := middlewares.DecodeJSONBody(res, req, &creds)
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

	user, err := database.Login(creds.Email)
	if err != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(err.Error()))
		return
	}

	valid := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(creds.Password))
	if valid != nil {
		res.WriteHeader(http.StatusUnauthorized)
		res.Write([]byte("Le mot de passe est incorrect"))
		return
	}

	expirationTime := time.Now().Add(24 * time.Hour)

	claims := &Claims{
		Email: creds.Email,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, errToken := token.SignedString(jwtKey)
	if errToken != nil {
		res.WriteHeader(http.StatusInternalServerError)
		res.Write([]byte(errToken.Error()))
		return
	}

	data := map[string]interface{}{
		"user":  user,
		"token": tokenString,
	}

	res.WriteHeader(http.StatusOK)
	res.Header().Set("Content-Type", "application/json")
	json.NewEncoder(res).Encode(data)
	return
}

func ValidEmail(email string) bool {
	_, err := mail.ParseAddress(email)
	return err == nil
}

func Signup(res http.ResponseWriter, req *http.Request) {
	var user *database.User
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

	var validNames = regexp.MustCompile(`[^-'A-Za-zÀ-ÿ]`)

	if validNames.MatchString(user.FirstName) {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte("Le prénom contient des caractères qui ne sont pas autorisés"))
		return
	}

	if validNames.MatchString(user.LastName) {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte("Le nom contient des caractères qui ne sont pas autorisés"))
		return
	}

	if !ValidEmail(user.Email) {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte("L'adresse mail n'est pas valide"))
		return
	}

	if len(user.Password) < 6 {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte("Le mot de passe doit contenir au moins 6 caractères"))
		return
	}

	userExists, errUser := database.CheckIfUserExistsByEmail(user.Email)
	if errUser != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(errUser.Error()))
		return
	}
	if userExists {
		res.WriteHeader(http.StatusUnprocessableEntity)
		res.Write([]byte("L'adresse mail est déjà utilisée"))
		return
	}

	hash, errHash := bcrypt.GenerateFromPassword([]byte(user.Password), 10)
	if errHash != nil {
		res.WriteHeader(http.StatusInternalServerError)
		res.Write([]byte(errHash.Error()))
		return
	}

	user = &database.User{
		ID:        primitive.NewObjectID(),
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
		Email:     user.Email,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Password:  string(hash),
	}

	_, errMongo := database.CreateUser(user)
	if errMongo != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(errMongo.Error()))
		return
	}

	expirationTime := time.Now().Add(24 * time.Hour)

	claims := &Claims{
		Email: user.Email,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, errToken := token.SignedString(jwtKey)
	if errToken != nil {
		res.WriteHeader(http.StatusInternalServerError)
		res.Write([]byte(errHash.Error()))
		return
	}

	data := map[string]interface{}{
		"user":  user,
		"token": tokenString,
	}

	res.WriteHeader(http.StatusCreated)
	res.Header().Set("Content-Type", "application/json")
	json.NewEncoder(res).Encode(data)
	return
}
