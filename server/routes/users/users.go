package usersRoutes

import (
	usersCtr "todo-list-api/controllers/users"

	"github.com/gorilla/mux"
)

func HandleUsersRequest(router *mux.Router) *mux.Router {
	s := router.PathPrefix("/users").Subrouter()
	s.HandleFunc("/", usersCtr.GetUsers).Methods("GET")
	s.HandleFunc("/{id}", usersCtr.GetUser).Methods("GET")
	s.HandleFunc("/", usersCtr.CreateUser).Methods("POST")
	s.HandleFunc("/{id}", usersCtr.UpdateUser).Methods("PUT")
	s.HandleFunc("/{id}", usersCtr.DeleteUser).Methods("DELETE")
	return router
}
