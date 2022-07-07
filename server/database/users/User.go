package dbUser

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID        primitive.ObjectID   `bson:"_id"`
	CreatedAt time.Time            `bson:"createdAt"`
	UpdatedAt time.Time            `bson:"updatedAt"`
	Email     string               `bson:"email"`
	Password  string               `bson:"password"`
	FirstName string               `bson:"firstName"`
	LastName  string               `bson:"lastName"`
	Todos     []primitive.ObjectID `bson:"todos"`
}
