package middlewares

import (
	"net/http"
	"os"
	"strings"

	"github.com/dgrijalva/jwt-go"
)

type Claims struct {
	Email string `json:"email"`
	jwt.StandardClaims
}

var jwtKey = []byte(os.Getenv("TOKEN"))

func Auth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(res http.ResponseWriter, req *http.Request) {
		if req.RequestURI == "/users/signup" || req.RequestURI == "/users/login" {
			next.ServeHTTP(res, req)
		} else {
			value, ok := req.Header["Authorization"]
			if !ok || (len(value) < 1) || (value[0] == "") {
				res.WriteHeader(http.StatusUnauthorized)
				res.Write([]byte("Vous devez vous authentifier"))
				return
			}
			splitRes := strings.Split(value[0], " ")
			if len(splitRes) < 2 {
				res.WriteHeader(http.StatusBadRequest)
				res.Write([]byte("Vous devez vous authentifier"))
				return
			}
			tokenStr := strings.Split(value[0], " ")[1]
			if tokenStr == "" {
				res.WriteHeader(http.StatusUnauthorized)
				res.Write([]byte("Vous devez vous authentifier"))
				return
			}
			claims := &Claims{}

			token, errToken := jwt.ParseWithClaims(tokenStr, claims, func(t *jwt.Token) (interface{}, error) {
				return jwtKey, nil
			})
			if errToken != nil {
				if errToken == jwt.ErrSignatureInvalid {
					res.WriteHeader(http.StatusUnauthorized)
					res.Write([]byte("Vous devez vous authentifier"))
					return
				}
				res.WriteHeader(http.StatusBadRequest)
				res.Write([]byte(errToken.Error()))
				return
			}

			if !token.Valid {
				res.WriteHeader(http.StatusUnauthorized)
				res.Write([]byte("Vous devez vous authentifier"))
				return
			}
			next.ServeHTTP(res, req)
		}
	})
}
