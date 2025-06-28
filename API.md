# API Documentation

## Authentication

### Register a New User

- **URL**: `/api/auth/signup`
- **Method**: `POST`
- **Authentication**: None
- **Request Body**:
  ```json
  {
    "email": "nathan@sample.com",
    "password": "password1",
    "firmName": "Nathan Law"
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "id": 1,
    "email": "nathan@sample.com",
    "firmName": "Nathan Law"
  }
  ```

### Login

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Authentication**: None
- **Request Body**:
  ```json
  {
    "email": "dennis@sample.com",
    "password": "password1"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "access_token": "jwt.token.here",
    "user": {
      "id": 1,
      "email": "dennis@sample.com",
      "firmName": "Dennis Law"
    }
  }
  ```

### Get Current User

- **URL**: `/api/auth/me`
- **Method**: `GET`
- **Authentication**: Required (JWT in Authorization header)
- **Headers**:
  - `Authorization: Bearer <jwt_token>`
- **Success Response**: `200 OK`
  ```json
  {
    "user": {
      "id": 1,
      "email": "dennis@sample.com",
      "firmName": "Dennis Law"
    }
  }
  ```

## Customers

### Get All Customers

- **URL**: `/api/customers`
- **Method**: `GET`
- **Authentication**: Required (JWT in Authorization header)
- **Success Response**: `200 OK`
  ```json
  [
    {
      "id": 1,
      "name": "Abby",
      "phoneNumber": "1111111111",
      "isActive": true
    }
  ]
  ```

### Get Single Customer

- **URL**: `/api/customers/:id`
- **Method**: `GET`
- **URL Parameters**:
  - `id` (required): Customer ID
- **Authentication**: Required (JWT in Authorization header)
- **Success Response**: `200 OK`
  ```json
  {
    "id": 1,
    "name": "Abby",
    "phoneNumber": "1111111111",
    "isActive": true
  }
  ```

### Create Customer

- **URL**: `/api/customers`
- **Method**: `POST`
- **Authentication**: Required (JWT in Authorization header)
- **Request Body**:
  ```json
  {
    "name": "Bumi",
    "phoneNumber": "2222222222"
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "id": 2,
    "name": "Bumi",
    "phoneNumber": "2222222222",
    "isActive": true
  }
  ```

### Update Customer

- **URL**: `/api/customers/:id`
- **Method**: `PUT`
- **URL Parameters**:
  - `id` (required): Customer ID
- **Authentication**: Required (JWT in Authorization header)
- **Request Body**:
  ```json
  {
    "name": "Abby Updated",
    "phoneNumber": "8888888888",
    "isActive": false
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "id": 1,
    "name": "Abby Updated",
    "phoneNumber": "8888888888",
    "isActive": false
  }
  ```

### Delete Customer

- **URL**: `/api/customers/:id`
- **Method**: `DELETE`
- **URL Parameters**:
  - `id` (required): Customer ID
- **Authentication**: Required (JWT in Authorization header)
- **Success Response**: `200 OK`
  ```json
  {
    "id": 1,
    "name": "Abby",
    "phoneNumber": "1111111111",
    "isActive": false
  }
  ```

## Matters

### Get All Matters for a Customer

- **URL**: `/api/customers/:customerId/matters`
- **Method**: `GET`
- **Authentication**: Required (JWT in Authorization header)
- **URL Parameters**:
  - `customerId` (required): The ID of the customer to get matters for
- **Success Response**: `200 OK`
  ```json
  [
    {
      "id": 1,
      "name": "Abby vs squirrel",
      "description": "Abby chased a squirrel",
      "customerId": 1,
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  ]
  ```

### Get Single Matter

- **URL**: `/api/customers/:customerId/matters/:matterId`
- **Method**: `GET`
- **URL Parameters**:
  - `customerId` (required): The ID of the customer that owns the matter
  - `matterId` (required): The ID of the matter to retrieve
- **Authentication**: Required (JWT in Authorization header)
- **Success Response**: `200 OK`
  ```json
  {
    "id": 1,
    "name": "Abby vs squirrel",
    "description": "Abby chased a squirrel",
    "customerId": 1,
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
  ```

### Create Matter

- **URL**: `/api/customers/:customerId/matters`
- **Method**: `POST`
- **Authentication**: Required (JWT in Authorization header)
- **URL Parameters**:
  - `customerId` (required): The ID of the customer to create the matter for
- **Request Body**:
  ```json
  {
    "name": "Abby vs yappy dog",
    "description": "Yappy dog barked at Abby"
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "id": 2,
    "name": "Abby vs yappy dog",
    "description": "Yappy dog barked at Abby",
    "customerId": 1,
    "createdAt": "2023-01-02T00:00:00.000Z"
  }
  ```

### Update Matter

- **URL**: `/api/matters/:id`
- **Method**: `PUT`
- **URL Parameters**:
  - `id` (required): Matter ID
- **Authentication**: Required (JWT in Authorization header)
- **Request Body**:
  ```json
  {
    "name": "Updated Matter Name",
    "description": "Updated description"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "id": 1,
    "name": "Updated Matter Name",
    "description": "Updated description",
    "customerId": 1,
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
  ```

## Authentication

All endpoints except `/api/auth/signup` and `/api/auth/login` require authentication. Include the JWT token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```
