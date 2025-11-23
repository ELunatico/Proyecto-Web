package database

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
	var err error

	dsn := os.Getenv("DB_DSN")
	if dsn == "" {
		log.Fatal("Error: La variable de entorno DB_DSN no está definida.")
	}

	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Error al conectar con la base de datos:", err)
	}

	fmt.Println("¡Conexión a la base de datos establecida exitosamente!")
}
