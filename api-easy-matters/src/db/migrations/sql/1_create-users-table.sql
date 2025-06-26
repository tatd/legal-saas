CREATE TABLE users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email VARCHAR(255),
  firm_name VARCHAR(255)
);

INSERT INTO users (
  email,
  firm_name
)
VALUES (
  'dtat24@gmail.com',
  'Dennis Law'
);