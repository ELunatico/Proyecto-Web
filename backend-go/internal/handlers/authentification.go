package handlers

import (
	"encoding/json"
	"net/http"

	"organizador-tareas/backend/internal/database"
	"organizador-tareas/backend/internal/models"

	"golang.org/x/crypto/bcrypt"
)

// Estructura actualizada para el Login
type AuthInput struct {
	ID       uint   `json:"id"`
	Password string `json:"password"`
	Nombre   string `json:"nombre"`
	Email    string `json:"email"`
}

func Register(w http.ResponseWriter, r *http.Request) {
	var input AuthInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Datos inválidos", http.StatusBadRequest)
		return
	}

	hashed, _ := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)

	user := models.Usuario{
		Nombre:       input.Nombre,
		Email:        input.Email,
		PasswordHash: string(hashed),
	}

	if result := database.DB.Create(&user); result.Error != nil {
		http.Error(w, "Error al crear usuario", http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

func Login(w http.ResponseWriter, r *http.Request) {
	var input AuthInput
	json.NewDecoder(r.Body).Decode(&input)

	var user models.Usuario

	if err := database.DB.First(&user, input.ID).Error; err != nil {
		http.Error(w, "ID de usuario no encontrado", http.StatusUnauthorized)
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(input.Password)); err != nil {
		http.Error(w, "Contraseña incorrecta", http.StatusUnauthorized)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}
