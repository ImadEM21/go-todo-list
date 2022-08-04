package database

import (
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Token struct {
	ID        primitive.ObjectID `bson:"_id" json:"_id"`
	UserId    primitive.ObjectID `bson:"userId" json:"userId"`
	Token     string             `bson:"token" json:"token"`
	CreatedAt time.Time          `bson:"createdAt" json:"createdAt"`
}

func GetTokenByUserId(userId primitive.ObjectID) (*Token, error) {
	client, ctx := InitDb()
	defer CloseDb(&client, ctx)
	var token *Token
	coll := client.Database("todos").Collection("tokens")
	errColl := coll.FindOne(ctx, bson.D{{Key: "userId", Value: userId}}).Decode(&token)
	if errColl != nil {
		return nil, errColl
	}
	return token, nil
}

func CreateToken(tokenToCreate *Token) (*Token, error) {
	client, ctx := InitDb()
	defer CloseDb(&client, ctx)
	var token *Token
	coll := client.Database("todos").Collection("tokens")
	result, err := coll.InsertOne(ctx, tokenToCreate)
	if err != nil {
		return nil, err
	}
	errColl := coll.FindOne(ctx, bson.D{{Key: "_id", Value: result.InsertedID}}).Decode(&token)
	if errColl != nil {
		return nil, errColl
	}
	return token, nil
}
