package utils

import (
	"crypto/rand"
	"encoding/hex"
	"time"
	database "todo-list-api/database"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func GetToken(user *database.User) (*database.Token, error) {
	token, errToken := database.GetTokenByUserId(user.ID)
	if errToken != nil && errToken != mongo.ErrNoDocuments {
		return nil, errToken
	}
	if token == nil {
		hexString, errString := GetRandomHexString()
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

func GetRandomHexString() (string, error) {
	b := make([]byte, 32)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	encodedString := hex.EncodeToString(b)
	return encodedString, nil
}
