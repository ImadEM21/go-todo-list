package dbTodo

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Todo struct {
	ID          primitive.ObjectID `bson:"_id"`
	CreatedAt   time.Time          `bson:"createdAt"`
	UpdatedAt   time.Time          `bson:"updatedAt"`
	Title       string             `bson:"title"`
	Description string             `bson:"description"`
	EndDate     time.Time          `bson:"endDate"`
	Completed   bool               `bson:"completed"`
}

func GetTodos(client mongo.Client, ctx context.Context) ([]*Todo, error) {
	var todos []*Todo
	coll := client.Database("todos").Collection("todos")
	cur, err := coll.Find(ctx, bson.D{{}})
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
