package controllers

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"todo-list-api/database"
	middlewares "todo-list-api/middlewares"

	"github.com/bitly/go-simplejson"
	"github.com/mailjet/mailjet-apiv3-go"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Email struct {
	Email string `bson:"email" json:"email"`
}

func getToken(user *database.User) (*database.Token, error) {
	token, errToken := database.GetTokenByUserId(user.ID)
	if errToken != nil && errToken != mongo.ErrNoDocuments {
		return nil, errToken
	}
	if token == nil {
		hexString, errString := getRandomHexString()
		if errString != nil {
			return nil, errString
		}
		newToken := &database.Token{
			ID:        primitive.NewObjectID(),
			UserId:    user.ID,
			Token:     hexString,
			CreatedAt: time.Now(),
		}
		token, err := database.CreateToken(newToken)
		if err != nil {
			return nil, err
		}
		return token, nil
	}
	return token, nil
}

func getRandomHexString() (string, error) {
	b := make([]byte, 32)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	encodedString := hex.EncodeToString(b)
	return encodedString, nil
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

	if !ValidEmail(email.Email) {
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

	token, errToken := getToken(user)
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
				Email: "imad.elmahrad98@gmail.com",
				Name:  "Todos",
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

}
