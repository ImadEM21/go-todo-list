package database

import (
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Todo struct {
	ID          primitive.ObjectID `bson:"_id" json:"_id"`
	CreatedAt   time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt   time.Time          `bson:"updatedAt" json:"updatedAt"`
	Title       string             `bson:"title" json:"title"`
	Description string             `bson:"description" json:"description"`
	EndDate     time.Time          `bson:"endDate" json:"endDate"`
	Completed   bool               `bson:"completed" json:"completed"`
	UserId      primitive.ObjectID `bson:"userId" json:"userId"`
}

func GetTodos(userId primitive.ObjectID) ([]*Todo, error) {
	client, ctx := InitDb()
	defer CloseDb(&client, ctx)
	var todos []*Todo

	coll := client.Database("todos").Collection("todos")
	cur, err := coll.Find(ctx, bson.D{{Key: "userId", Value: userId}})
	if err != nil {
		return todos, err
	}
	for cur.Next(ctx) {
		var todo Todo
		err := cur.Decode(&todo)
		if err != nil {
			return todos, err
		}
		todos = append(todos, &todo)
	}
	curErr := cur.Err()
	if curErr != nil {
		return todos, curErr
	}

	cur.Close(ctx)

	if len(todos) == 0 {
		return todos, mongo.ErrNoDocuments
	}

	return todos, nil
}

func GetTodo(todoId primitive.ObjectID) (*Todo, error) {
	client, ctx := InitDb()
	defer CloseDb(&client, ctx)
	var todo *Todo
	coll := client.Database("todos").Collection("todos")
	errColl := coll.FindOne(ctx, bson.D{{Key: "_id", Value: todoId}}).Decode(&todo)
	if errColl != nil {
		if errColl == mongo.ErrNoDocuments {
			return todo, mongo.ErrNoDocuments
		}
		return nil, errColl
	}
	return todo, nil
}

func CreateTodo(todo *Todo) (interface{}, error) {
	client, ctx := InitDb()
	defer CloseDb(&client, ctx)
	coll := client.Database("todos").Collection("todos")
	result, err := coll.InsertOne(ctx, todo)
	if err != nil {
		return nil, err
	}
	return result.InsertedID, err
}

func UpdateTodo(todo *Todo, todoId primitive.ObjectID) (int64, error) {
	client, ctx := InitDb()
	defer CloseDb(&client, ctx)
	coll := client.Database("todos").Collection("todos")
	result, err := coll.UpdateByID(ctx, todoId, bson.D{{Key: "$set", Value: todo}})
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return 0, mongo.ErrNoDocuments
		}
		return 0, err
	}
	return result.ModifiedCount, nil
}

func DeleteTodo(todoId primitive.ObjectID) (int64, error) {
	client, ctx := InitDb()
	defer CloseDb(&client, ctx)
	coll := client.Database("todos").Collection("todos")
	result, err := coll.DeleteOne(ctx, bson.D{{Key: "_id", Value: todoId}})
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return 0, mongo.ErrNoDocuments
		}
		return 0, err
	}
	return result.DeletedCount, nil
}

func CompleteTodo(todoId primitive.ObjectID) (int64, error) {
	client, ctx := InitDb()
	defer CloseDb(&client, ctx)
	coll := client.Database("todos").Collection("todos")
	update := bson.D{{Key: "$set", Value: bson.D{{Key: "completed", Value: true}, {Key: "updatedAt", Value: time.Now()}}}}
	result, err := coll.UpdateByID(ctx, todoId, update)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return 0, mongo.ErrNoDocuments
		}
		return 0, err
	}
	return result.ModifiedCount, nil
}
