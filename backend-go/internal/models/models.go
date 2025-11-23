package models

import (
	"time"
)

type Usuario struct {
	ID           uint      `gorm:"column:id_usuario;primaryKey" json:"id"`
	Nombre       string    `gorm:"column:nombre" json:"nombre"`
	Email        string    `gorm:"column:email;unique" json:"email"`
	PasswordHash string    `gorm:"column:password_hash" json:"-"`
	Materias     []Materia `gorm:"foreignKey:IDUsuario"`
}

type Materia struct {
	ID        uint    `gorm:"column:id_materia;primaryKey" json:"id"`
	Nombre    string  `gorm:"column:nombre" json:"nombre"`
	IDUsuario uint    `gorm:"column:id_usuario" json:"idUsuario"`
	Tareas    []Tarea `gorm:"foreignKey:IDMateria"`
}

type Prioridad struct {
	ID     uint   `gorm:"column:id_prioridad;primaryKey" json:"id"`
	Nombre string `gorm:"column:nombre" json:"nombre"`
	Nivel  int    `gorm:"column:nivel" json:"nivel"`
}
type Estado struct {
	ID     uint   `gorm:"column:id_estado;primaryKey" json:"id"`
	Nombre string `gorm:"column:nombre" json:"nombre"`
}

type Tarea struct {
	ID                uint       `gorm:"column:id_tarea;primaryKey" json:"id"`
	Nombre            string     `gorm:"column:nombre" json:"nombre"`
	Descripcion       *string    `gorm:"column:descripcion" json:"descripcion,omitempty"`
	FechaEntrega      *time.Time `gorm:"column:fecha_entrega" json:"fechaEntrega,omitempty"`
	TiempoEstimadoMin *int       `gorm:"column:tiempo_estimado_min" json:"tiempoEstimadoMin,omitempty"`

	FechaCreacion time.Time `gorm:"column:fecha_creacion;autoCreateTime" json:"fechaCreacion,omitempty"`

	IDMateria   *uint `gorm:"column:id_materia" json:"idMateria,omitempty"`
	IDPrioridad *uint `gorm:"column:id_prioridad" json:"idPrioridad,omitempty"`
	IDEstado    *uint `gorm:"column:id_estado" json:"idEstado,omitempty"`

	IDUsuario uint `gorm:"column:id_usuario" json:"idUsuario"`
}

func (Usuario) TableName() string   { return "Usuarios" }
func (Materia) TableName() string   { return "Materias" }
func (Tarea) TableName() string     { return "Tareas" }
func (Prioridad) TableName() string { return "Prioridades" }
func (Estado) TableName() string    { return "Estados" }
