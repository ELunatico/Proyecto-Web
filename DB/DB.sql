-- --------------------------------------------------------
-- SCRIPT DE CREACIÓN DE BASE DE DATOS: ORGANIZADOR_TAREAS
-- Este script es para MySQL.
-- --------------------------------------------------------

-- 0. BORRADO DE TABLAS (en orden inverso de creación para evitar errores de FK)
-- Esto permite que el script se pueda volver a ejecutar.
DROP TABLE IF EXISTS Tareas;
DROP TABLE IF EXISTS Materias;
DROP TABLE IF EXISTS Usuarios;
DROP TABLE IF EXISTS Prioridades;
DROP TABLE IF EXISTS Estados;


-- 1. CREACIÓN DE TABLAS DE CATÁLOGO (sin dependencias)

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


-- 2. CREACIÓN DE TABLAS PRINCIPALES (con dependencias)

CREATE TABLE Materias (
    id_materia INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    
    -- Relación: Una materia pertenece a un usuario
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
        ON DELETE CASCADE -- Si se borra el usuario, se borran sus materias
);

CREATE TABLE Tareas (
    id_tarea INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha_entrega DATETIME COMMENT 'Combina fecha y hora de entrega',
    tiempo_estimado_min INT COMMENT 'Tiempo estimado en minutos',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Relaciones (Foreign Keys)
    id_materia INT,
    id_prioridad INT,
    id_estado INT,
    
    FOREIGN KEY (id_materia) REFERENCES Materias(id_materia)
        ON DELETE CASCADE, -- Si se borra la materia, se borra la tarea
    FOREIGN KEY (id_prioridad) REFERENCES Prioridades(id_prioridad)
        ON DELETE SET NULL, -- Si se borra una prioridad, la tarea la pierde pero no se borra
    FOREIGN KEY (id_estado) REFERENCES Estados(id_estado)
        ON DELETE SET NULL -- Si se borra un estado, la tarea lo pierde pero no se borra
);


-- --------------------------------------------------------
-- 3. INSERCIÓN DE DATOS DE PRUEBA
-- --------------------------------------------------------

-- Insertar un usuario de prueba (Tendrá ID = 1)
INSERT INTO Usuarios (nombre, email, password_hash) VALUES
('Estudiante de Prueba', 'estudiante@prueba.com', 'hash_de_contraseña_seguro_123');

-- Insertar datos de catálogo globales
INSERT INTO Prioridades (nombre, nivel) VALUES
('Baja', 1),
('Media', 2),
('Alta', 3);
-- IDs: 1 (Baja), 2 (Media), 3 (Alta)

INSERT INTO Estados (nombre) VALUES
('Pendiente'),
('En Progreso'),
('Completada');
-- IDs: 1 (Pendiente), 2 (En Progreso), 3 (Completada)

-- Insertar materias para el usuario de prueba (ID = 1)
INSERT INTO Materias (nombre, id_usuario) VALUES
('Desarrollo de Aplicaciones Web', 1),
('Ciberseguridad', 1),
('Investigación de Operaciones', 1),
('Telemática', 1);
-- IDs: 1 (Web), 2 (Ciber), 3 (IDO), 4 (Tele)

-- Insertar tareas de prueba, vinculando todos los IDs
INSERT INTO Tareas 
    (nombre, descripcion, fecha_entrega, tiempo_estimado_min, id_materia, id_prioridad, id_estado) 
VALUES
(
    'Migrar proyecto a Next.js', 
    'Pasar todos los componentes de React a la nueva estructura de Next.js con App Router.',
    '2025-11-20 23:59:00',
    180,
    1, -- Materia: Desarrollo Web (ID=1)
    3, -- Prioridad: Alta (ID=3)
    1  -- Estado: Pendiente (ID=1)
),
(
    'Análisis de vulnerabilidades', 
    'Escanear la red en busca de puertos abiertos.',
    '2025-11-18 18:00:00',
    120,
    2, -- Materia: Ciberseguridad (ID=2)
    2, -- Prioridad: Media (ID=2)
    1  -- Estado: Pendiente (ID=1)
),
(
    'Resolver problema de la mochila', 
    'Implementar algoritmo de programación dinámica.',
    '2025-11-15 12:00:00',
    60,
    3, -- Materia: IDO (ID=3)
    1, -- Prioridad: Baja (ID=1)
    3  -- Estado: Completada (ID=3)
),
(
    'Configurar Subredes', 
    'Calcular el direccionamiento para 5 subredes.',
    '2025-11-25 10:00:00',
    90,
    4, -- Materia: Telemática (ID=4)
    3, -- Prioridad: Alta (ID=3)
    2  -- Estado: En Progreso (ID=2)
);

-- Fin del script