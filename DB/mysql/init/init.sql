DROP TABLE IF EXISTS Tareas;
DROP TABLE IF EXISTS Materias;
DROP TABLE IF EXISTS Usuarios;
DROP TABLE IF EXISTS Prioridades;
DROP TABLE IF EXISTS Estados;

CREATE TABLE Usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE Prioridades (
    id_prioridad INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    nivel INT NOT NULL COMMENT 'Para ordenar: 3=Alta, 2=Media, 1=Baja'
);

CREATE TABLE Estados (
    id_estado INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL
);


CREATE TABLE Materias (
    id_materia INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
        ON DELETE CASCADE
);

CREATE TABLE Tareas (
    id_tarea INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha_entrega DATETIME,
    tiempo_estimado_min INT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    id_materia INT,
    id_prioridad INT,
    id_estado INT,
    id_usuario INT,
    
    FOREIGN KEY (id_materia) REFERENCES Materias(id_materia)
        ON DELETE CASCADE,
    FOREIGN KEY (id_prioridad) REFERENCES Prioridades(id_prioridad)
        ON DELETE SET NULL,
    FOREIGN KEY (id_estado) REFERENCES Estados(id_estado)
        ON DELETE SET NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
        ON DELETE CASCADE
);

INSERT INTO Usuarios (nombre, email, password_hash) VALUES
('Estudiante de Prueba', 'estudiante@prueba.com', 'hola');

INSERT INTO Prioridades (nombre, nivel) VALUES
('Baja', 1), ('Media', 2), ('Alta', 3);

INSERT INTO Estados (nombre) VALUES
('Pendiente'), ('En Progreso'), ('Completada');

INSERT INTO Materias (nombre, id_usuario) VALUES
('Desarrollo de Aplicaciones Web', 1),
('Ciberseguridad', 1),
('Investigación de Operaciones', 1),
('Telemática', 1);

INSERT INTO Tareas 
    (nombre, descripcion, fecha_entrega, tiempo_estimado_min, id_materia, id_prioridad, id_estado, id_usuario) 
VALUES
(
    'Migrar proyecto a Next.js', 
    'Pasar todos los componentes de React a la nueva estructura.',
    '2025-11-20 23:59:00', 180, 1, 3, 1, 1
),
(
    'Análisis de vulnerabilidades', 
    'Escanear la red en busca de puertos abiertos.',
    '2025-11-18 18:00:00', 120, 2, 2, 1, 1
),
(
    'Resolver problema de la mochila', 
    'Implementar algoritmo de programación dinámica.',
    '2025-11-15 12:00:00', 60, 3, 1, 3, 1
),
(
    'Configurar Subredes', 
    'Calcular el direccionamiento para 5 subredes.',
    '2025-11-25 10:00:00', 90, 4, 3, 2, 1
);