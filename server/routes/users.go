package routes

import (
	controllers "todo-list-api/controllers"
	middlewares "todo-list-api/middlewares"

	"github.com/gorilla/mux"
)

func HandleUsersRequest(router *mux.Router) *mux.Router {
	s := router.PathPrefix("/api/users").Subrouter()
	s.Use(middlewares.Auth)
	s.HandleFunc("/", controllers.GetUsers).Methods("GET")
	s.HandleFunc("/{id}", controllers.GetUser).Methods("GET")
	s.HandleFunc("/signup", controllers.Signup).Methods("POST")
	s.HandleFunc("/login", controllers.Login).Methods("POST")
	s.HandleFunc("/{id}", controllers.UpdateUser).Methods("PUT")
	s.HandleFunc("/{id}", controllers.DeleteUser).Methods("DELETE")
	return s
}
