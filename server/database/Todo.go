package database

import (
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Todo struct {
	ID            primitive.ObjectID `bson:"_id" json:"_id"`
	CreatedAt     time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt     time.Time          `bson:"updatedAt" json:"updatedAt"`
	Title         string             `bson:"title" json:"title"`
	Description   string             `bson:"description" json:"description"`
	EndDate       time.Time          `bson:"endDate" json:"endDate"`
	Completed     bool               `bson:"completed" json:"completed"`
	CompletedDate time.Time          `bson:"completedDate" json:"completedDate"`
	UserId        primitive.ObjectID `bson:"userId" json:"userId"`
}

type GraphData struct {
	Date  time.Time `json:"date"`
	Total int64     `json:"total"`
}

func GetTodos(userId primitive.ObjectID, limit int64, page int64) ([]*Todo, int64, int64, int64, []*GraphData, error) {
	client, ctx := InitDb()
	defer CloseDb(&client, ctx)
	var todos []*Todo
	var data []*GraphData

	coll := client.Database("todos").Collection("todos")
	filter := bson.D{{Key: "userId", Value: userId}}
	count, errCount := coll.CountDocuments(ctx, filter)
	if errCount != nil {
		return todos, 0, 0, 0, make([]*GraphData, 0), errCount
	}

	filterUncompleted := bson.D{{Key: "userId", Value: userId}, {Key: "completed", Value: false}}
	uncompleted, errCompleted := coll.CountDocuments(ctx, filterUncompleted)
	if errCompleted != nil {
		return todos, 0, 0, 0, make([]*GraphData, 0), errCompleted
	}

	filterLate := bson.D{{Key: "userId", Value: userId}, {Key: "completed", Value: false}, {Key: "endDate", Value: bson.M{"$lt": time.Now()}}}
	late, errLate := coll.CountDocuments(ctx, filterLate)
	if errLate != nil {
		return todos, 0, 0, 0, make([]*GraphData, 0), errLate
	}

	for i := -7; i < 0; i++ {
		filter := bson.D{{Key: "userId", Value: userId}, {Key: "completed", Value: true}, {Key: "completedDate", Value: bson.D{{Key: "$gte", Value: primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, i))}, {Key: "$lt", Value: primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, i+1))}}}}
		count, err := coll.CountDocuments(ctx, filter)
		if err != nil {

		}
		elt := GraphData{
			Date:  time.Now().AddDate(0, 0, i),
			Total: count,
		}
		data = append(data, &elt)

	}

	opts := options.Find()
	skips := limit * (page - 1)
	opts.SetLimit(limit)
	opts.SetSkip(skips)
	opts.SetSort(bson.D{{Key: "endDate", Value: 1}})
	cur, errQuery := coll.Find(ctx, filter, opts)
	if errQuery != nil {
		return todos, 0, 0, 0, make([]*GraphData, 0), errQuery
	}
	for cur.Next(ctx) {
		var todo Todo
		err := cur.Decode(&todo)
		if err != nil {
			return todos, 0, 0, 0, make([]*GraphData, 0), err
		}
		todos = append(todos, &todo)
	}
	curErr := cur.Err()
	if curErr != nil {
		return todos, 0, 0, 0, make([]*GraphData, 0), curErr
	}

	cur.Close(ctx)

	if len(todos) == 0 {
		return make([]*Todo, 0), 0, 0, 0, make([]*GraphData, 0), nil
	}

	return todos, count, uncompleted, late, data, nil
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

func CompleteTodo(todoId primitive.ObjectID, complete bool) (int64, error) {
	client, ctx := InitDb()
	defer CloseDb(&client, ctx)
	coll := client.Database("todos").Collection("todos")
	var set primitive.D
	if complete {
		set = bson.D{{Key: "completed", Value: complete}, {Key: "updatedAt", Value: time.Now()}, {Key: "completedDate", Value: time.Now()}}
	} else {
		set = bson.D{{Key: "completed", Value: complete}, {Key: "updatedAt", Value: time.Now()}}
	}
	update := bson.D{{Key: "$set", Value: set}}
	result, err := coll.UpdateByID(ctx, todoId, update)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return 0, mongo.ErrNoDocuments
		}
		return 0, err
	}
	return result.ModifiedCount, nil
}

func DeleteUserTodos(userId primitive.ObjectID) (int64, error) {
	client, ctx := InitDb()
	defer CloseDb(&client, ctx)
	coll := client.Database("todos").Collection("todos")
	result, err := coll.DeleteMany(ctx, bson.D{{Key: "userId", Value: userId}})
	if err != nil {
		return 0, err
	}
	return result.DeletedCount, nil
}
