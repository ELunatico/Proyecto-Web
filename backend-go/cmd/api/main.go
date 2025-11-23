package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"

	"organizador-tareas/backend/internal/database"
	"organizador-tareas/backend/internal/handlers"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Info: No .env file found")
	}

	database.InitDB()

	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{"*"}, // Permitir todo
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"*"},
	}))

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("API Funcionando"))
	})

	r.Route("/api/v1", func(r chi.Router) {
		r.Post("/register", handlers.Register)
		r.Post("/login", handlers.Login)

		r.Get("/tareas", handlers.GetTareas)
		r.Post("/tareas", handlers.CreateTarea)
		r.Delete("/tareas/{id}", handlers.DeleteTarea)
		r.Put("/tareas/{id}", handlers.UpdateTarea)
	})

	fmt.Println("Servidor corriendo en port 8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
