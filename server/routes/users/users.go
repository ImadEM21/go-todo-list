package usersRoutes

import (
	usersCtr "todo-list-api/controllers/users"
	middlewares "todo-list-api/middlewares"

	"github.com/gorilla/mux"
)

func HandleUsersRequest(router *mux.Router) *mux.Router {
	s := router.PathPrefix("/users").Subrouter()
	s.Use(middlewares.Auth)
	s.HandleFunc("/", usersCtr.GetUsers).Methods("GET")
	s.HandleFunc("/{id}", usersCtr.GetUser).Methods("GET")
	s.HandleFunc("/signup", usersCtr.Signup).Methods("POST")
	s.HandleFunc("/login", usersCtr.Login).Methods("POST")
	s.HandleFunc("/{id}", usersCtr.UpdateUser).Methods("PUT")
	s.HandleFunc("/{id}", usersCtr.DeleteUser).Methods("DELETE")
	return router
}
