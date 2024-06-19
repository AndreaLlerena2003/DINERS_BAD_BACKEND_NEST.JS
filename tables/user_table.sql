CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    type_of_document VARCHAR(50) NOT NULL, 
    number_of_document VARCHAR(255) NOT NULL,
    cardNumber VARCHAR(255) NOT NULL,
    expiration_date VARCHAR(50) NOT NULL, 
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL
);
