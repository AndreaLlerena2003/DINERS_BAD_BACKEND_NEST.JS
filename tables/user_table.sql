-- Crear la tabla de usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    type_of_document VARCHAR(50) NOT NULL,
    number_of_document VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL
);

-- Crear la tabla de tarjetas
CREATE TABLE cards (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    cardNumber VARCHAR(255) NOT NULL,
    expiration_date VARCHAR(50) NOT NULL,
    cardHolderName VARCHAR(255) NOT NULL,
    cardType VARCHAR(50) NOT NULL,
    securityCode VARCHAR(50) NOT NULL,
    cash INTEGER 
);
