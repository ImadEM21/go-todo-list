package usersCtr

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"net/mail"
	"os"
	"regexp"
	"time"

	dbUser "todo-list-api/database/users"
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

	user, err := dbUser.Login(creds.Email)
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

func validEmail(email string) bool {
	_, err := mail.ParseAddress(email)
	return err == nil
}

func Signup(res http.ResponseWriter, req *http.Request) {
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

	var validNames = regexp.MustCompile(`[^-'a-zÀ-ÿ]`)

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

	if !validEmail(user.Email) {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte("L'adresse mail n'est pas valide"))
		return
	}

	if len(user.Password) < 6 {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte("Le mot de passe doit contenir au moins 6 caractères"))
		return
	}

	userExists, errUser := dbUser.CheckIfUserExistsByEmail(user.Email)
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

	emptyTodos := make([]primitive.ObjectID, 0)

	user = &dbUser.User{
		ID:        primitive.NewObjectID(),
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
		Email:     user.Email,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Password:  string(hash),
		Todos:     emptyTodos,
	}

	_, errMongo := dbUser.CreateUser(user)
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
