package database

import (
	"errors"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type User struct {
	ID        primitive.ObjectID `bson:"_id" json:"_id"`
	CreatedAt time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt time.Time          `bson:"updatedAt" json:"updatedAt"`
	Email     string             `bson:"email" json:"email"`
	Password  string             `bson:"password" json:"password"`
	FirstName string             `bson:"firstName" json:"firstName"`
	LastName  string             `bson:"lastName" json:"lastName"`
}

func GetUsers() ([]*User, error) {
	client, ctx := InitDb()
	defer CloseDb(&client, ctx)

	var users []*User
	coll := client.Database("todos").Collection("users")
	opts := options.Find().SetProjection(bson.D{{Key: "password", Value: 0}})
	cur, err := coll.Find(ctx, bson.D{{}}, opts)
	if err != nil {
		return users, err
	}
	for cur.Next(ctx) {
		var user User
		err := cur.Decode(&user)
		if err != nil {
			return users, err
		}
		users = append(users, &user)
	}
	curErr := cur.Err()
	if curErr != nil {
		return users, curErr
	}

	cur.Close(ctx)

	if len(users) == 0 {
		return users, mongo.ErrNoDocuments
	}

	return users, nil
}

func GetUser(userId primitive.ObjectID, selectPassword bool) (*User, error) {
	client, ctx := InitDb()
	defer CloseDb(&client, ctx)
	var user *User
	coll := client.Database("todos").Collection("users")
	var opts *options.FindOneOptions
	if selectPassword {
		opts = options.FindOne().SetProjection(bson.D{{Key: "password", Value: 0}})
	} else {
		opts = options.FindOne()
	}
	errColl := coll.FindOne(ctx, bson.D{{Key: "_id", Value: userId}}, opts).Decode(&user)
	if errColl != nil {
		if errColl == mongo.ErrNoDocuments {
			return user, mongo.ErrNoDocuments
		}
		return nil, errColl
	}
	return user, nil
}

func CreateUser(user *User) (interface{}, error) {
	client, ctx := InitDb()
	defer CloseDb(&client, ctx)
	coll := client.Database("todos").Collection("users")
	result, err := coll.InsertOne(ctx, user)
	if err != nil {
		return nil, err
	}
	return result.InsertedID, err
}

func UpdateUser(user *User, userId primitive.ObjectID) (int64, error) {
	client, ctx := InitDb()
	defer CloseDb(&client, ctx)
	coll := client.Database("todos").Collection("users")
	result, err := coll.UpdateByID(ctx, userId, bson.D{{Key: "$set", Value: user}})
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return 0, mongo.ErrNoDocuments
		}
		return 0, err
	}
	return result.ModifiedCount, nil
}

func DeleteUser(userId primitive.ObjectID) (int64, error) {
	client, ctx := InitDb()
	defer CloseDb(&client, ctx)
	coll := client.Database("todos").Collection("users")
	result, err := coll.DeleteOne(ctx, bson.D{{Key: "_id", Value: userId}})
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return 0, mongo.ErrNoDocuments
		}
		return 0, err
	}
	return result.DeletedCount, nil
}

func Login(email string) (*User, error) {
	var user *User
	client, ctx := InitDb()
	defer CloseDb(&client, ctx)
	coll := client.Database("todos").Collection("users")
	err := coll.FindOne(ctx, bson.D{{Key: "email", Value: email}}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return user, errors.New("Aucun utilisateur trouvé")
		}
		return nil, err
	}
	return user, nil
}

func CheckIfUserExistsByEmail(email string) (bool, error) {
	var user *User
	client, ctx := InitDb()
	defer CloseDb(&client, ctx)
	coll := client.Database("todos").Collection("users")
	err := coll.FindOne(ctx, bson.D{{Key: "email", Value: email}}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return false, nil
		}
		return false, err
	}
	return true, nil
}

func GetUserByEmail(email string) (*User, error) {
	client, ctx := InitDb()
	defer CloseDb(&client, ctx)
	var user *User
	coll := client.Database("todos").Collection("users")
	err := coll.FindOne(ctx, bson.D{{Key: "email", Value: email}}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return user, nil
		}
		return user, err
	}
	return user, nil
}
