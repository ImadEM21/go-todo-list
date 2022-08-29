package routes

import (
	"flag"
	"net/http"

	"github.com/gorilla/mux"
)

func HandleStaticFiles(router *mux.Router) {
	var dir string

	flag.StringVar(&dir, "dir", ".", "the directory to serve files from. Defaults to the current dir")
	flag.Parse()

	router.PathPrefix("/static").Handler(http.StripPrefix("/", http.FileServer(http.Dir(dir))))
}
