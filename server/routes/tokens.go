package routes

import (
	controllers "todo-list-api/controllers"

	"github.com/gorilla/mux"
)

func HandleTokensRequest(router *mux.Router) *mux.Router {
	s := router.PathPrefix("/api/tokens").Subrouter().StrictSlash(false)
	s.HandleFunc("/", controllers.CreateToken).Methods("POST")
	s.HandleFunc("/{userId}/{token}", controllers.ResetPassword).Methods("POST")
	return s
}
