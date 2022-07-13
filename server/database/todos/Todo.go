package dbTodo

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
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

func initDb() (mongo.Client, context.Context) {
	var ctx = context.TODO()
	envErr := godotenv.Load()
	if envErr != nil {
		log.Println("No .env file found")
	}

	uri := os.Getenv("MONGODB_URI")
	if uri == "" {
		log.Fatal("You must set your 'MONGODB_URI' environmental variable. See\n\t https://www.mongodb.com/docs/drivers/go/current/usage-examples/#environment-variable")
	}

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		panic(err)
	}
	return *client, ctx
}

func GetTodos() ([]*Todo, error) {
	client, ctx := initDb()
	defer func() {
		err := client.Disconnect(ctx)
		if err != nil {
			panic(err)
		}
	}()
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

func GetTodo(todoId primitive.ObjectID) (*Todo, error) {
	client, ctx := initDb()
	defer func() {
		err := client.Disconnect(ctx)
		if err != nil {
			panic(err)
		}
	}()
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
	client, ctx := initDb()
	defer func() {
		err := client.Disconnect(ctx)
		if err != nil {
			panic(err)
		}
	}()
	coll := client.Database("todos").Collection("todos")
	result, err := coll.InsertOne(ctx, todo)
	if err != nil {
		return nil, err
	}
	return result.InsertedID, err
}

func UpdateTodo(todo *Todo, todoId primitive.ObjectID) (int64, error) {
	client, ctx := initDb()
	defer func() {
		err := client.Disconnect(ctx)
		if err != nil {
			panic(err)
		}
	}()
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
	client, ctx := initDb()
	defer func() {
		err := client.Disconnect(ctx)
		if err != nil {
			panic(err)
		}
	}()
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
	client, ctx := initDb()
	defer func() {
		err := client.Disconnect(ctx)
		if err != nil {
			panic(err)
		}
	}()
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
