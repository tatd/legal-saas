CREATE TABLE users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email VARCHAR(255) NOT NULL,
  firm_name VARCHAR(255) NOT NULL,
  UNIQUE (email, firm_name)
);

INSERT INTO users (
  email,
  firm_name
)
VALUES (
  'dtat24@gmail.com',
  'Dennis Law'
);