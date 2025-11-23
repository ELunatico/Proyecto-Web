package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"organizador-tareas/backend/internal/database"
	"organizador-tareas/backend/internal/models"

	"github.com/go-chi/chi/v5"
)

func GetTareas(w http.ResponseWriter, r *http.Request) {
	userIdStr := r.URL.Query().Get("userId")

	if userIdStr == "" {
		http.Error(w, "Falta el parámetro userId", http.StatusBadRequest)
		return
	}

	var tareas []models.Tarea
	result := database.DB.Where("id_usuario = ?", userIdStr).Find(&tareas)

	if result.Error != nil {
		http.Error(w, "Error base de datos", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tareas)
}

func CreateTarea(w http.ResponseWriter, r *http.Request) {
	var tarea models.Tarea

	if err := json.NewDecoder(r.Body).Decode(&tarea); err != nil {
		http.Error(w, "JSON inválido", http.StatusBadRequest)
		return
	}

	if tarea.IDUsuario == 0 {
		http.Error(w, "Falta el idUsuario en el cuerpo", http.StatusBadRequest)
		return
	}

	if result := database.DB.Create(&tarea); result.Error != nil {
		http.Error(w, "Error al guardar", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(tarea)
}

func DeleteTarea(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, _ := strconv.ParseUint(idStr, 10, 64)

	database.DB.Delete(&models.Tarea{}, id)
	w.WriteHeader(http.StatusNoContent)
}

func UpdateTarea(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, _ := strconv.ParseUint(idStr, 10, 64)

	var tarea models.Tarea
	if database.DB.First(&tarea, id).Error != nil {
		http.Error(w, "No encontrada", http.StatusNotFound)
		return
	}

	var updatedData map[string]interface{}
	json.NewDecoder(r.Body).Decode(&updatedData)

	database.DB.Model(&tarea).Updates(updatedData)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tarea)
}
