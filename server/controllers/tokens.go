package controllers

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"todo-list-api/database"
	middlewares "todo-list-api/middlewares"
	utils "todo-list-api/utils"

	"github.com/bitly/go-simplejson"
	"github.com/gorilla/mux"
	"github.com/mailjet/mailjet-apiv3-go"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

type Email struct {
	Email string `bson:"email" json:"email"`
}

type Password struct {
	Password string `bson:"password" json:"password"`
}

func CreateToken(res http.ResponseWriter, req *http.Request) {
	var email *Email
	errJson := middlewares.DecodeJSONBody(res, req, &email)
	if errJson != nil {
		var mr *middlewares.MalformedRequest
		if errors.As(errJson, &mr) {
			http.Error(res, mr.Msg, mr.Status)
		} else {
			log.Print(errJson.Error())
			http.Error(res, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		}
		return
	}

	if !utils.ValidEmail(email.Email) {
		res.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(res).Encode("L'adresse mail n'est pas valide")
		return
	}

	user, errMongo := database.GetUserByEmail(email.Email)
	if errMongo != nil {
		res.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(res).Encode(errMongo.Error())
		return
	}

	token, errToken := utils.GetToken(user)
	if errToken != nil {
		res.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(res).Encode(errToken.Error())
		return
	}

	mailjetPublic := os.Getenv("MAILJET_API_KEY_PUBLIC")
	mailjetSectet := os.Getenv("MAILJET_API_KEY_PRIVATE")
	frontUrl := os.Getenv("FRONT_URL")
	templateId, errParse := strconv.ParseInt(os.Getenv("MAILJET_TEMPLATE_ID"), 0, 64)
	if errParse != nil {
		res.WriteHeader(http.StatusInternalServerError)
		res.Write([]byte(errParse.Error()))
		return
	}

	link := frontUrl + "/reinitialiser-mot-de-passe/" + user.ID.Hex() + "/" + token.Token

	mailjetClient := mailjet.NewMailjetClient(mailjetPublic, mailjetSectet)
	messagesInfo := []mailjet.InfoMessagesV31{
		{
			From: &mailjet.RecipientV31{
				Email: "no-reply@imadelmahrad.com",
				Name:  "TODO",
			},
			To: &mailjet.RecipientsV31{
				mailjet.RecipientV31{
					Email: user.Email,
					Name:  user.FirstName + " " + user.LastName,
				},
			},
			Subject:          "Réinitialisez votre mot de passe",
			TemplateID:       templateId,
			TemplateLanguage: true,
			Variables: map[string]interface{}{
				"name": user.FirstName + " " + user.LastName,
				"url":  link,
			},
		},
	}

	messages := mailjet.MessagesV31{Info: messagesInfo}
	resp, errMailjet := mailjetClient.SendMailV31(&messages)
	if errMailjet != nil {
		res.WriteHeader(http.StatusInternalServerError)
		res.Write([]byte(errMailjet.Error()))
		return
	}

	json := simplejson.New()
	json.Set("result", resp)

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

func ResetPassword(res http.ResponseWriter, req *http.Request) {
	var password *Password
	errJson := middlewares.DecodeJSONBody(res, req, &password)
	if errJson != nil {
		var mr *middlewares.MalformedRequest
		if errors.As(errJson, &mr) {
			http.Error(res, mr.Msg, mr.Status)
		} else {
			log.Print(errJson.Error())
			http.Error(res, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		}
		return
	}
	params := mux.Vars(req)
	userId, err := primitive.ObjectIDFromHex(params["userId"])
	if err != nil {
		res.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(res).Encode("No id provided " + err.Error())
		return
	}
	tokenStr := params["token"]

	user, errUser := database.GetUser(userId, false)
	if errUser != nil {
		res.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(res).Encode("Lien invalide ou expiré")
		return
	}

	token, errToken := database.GetToken(user.ID, tokenStr)
	if errToken != nil {
		res.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(res).Encode("Lien invalide ou expiré")
		return
	}

	hash, errHash := bcrypt.GenerateFromPassword([]byte(password.Password), 10)
	if errHash != nil {
		res.WriteHeader(http.StatusInternalServerError)
		res.Write([]byte(errHash.Error()))
		return
	}

	newUser := &database.User{
		ID:        user.ID,
		CreatedAt: user.CreatedAt,
		UpdatedAt: time.Now(),
		Email:     user.Email,
		Password:  string(hash),
		FirstName: user.FirstName,
		LastName:  user.LastName,
	}
	nModified, errUpdate := database.UpdateUser(newUser, userId)
	if errUpdate != nil && nModified > 0 {
		res.WriteHeader(http.StatusInternalServerError)
		res.Write([]byte(errUpdate.Error()))
		return
	}

	nDeleted, errDelToken := database.DeleteToken(token.ID)
	if errDelToken != nil {
		res.WriteHeader(http.StatusInternalServerError)
		res.Write([]byte(errDelToken.Error()))
		return
	}

	json := simplejson.New()
	json.Set("usersUpdated", nModified)
	json.Set("tokensDeleted", nDeleted)

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
