# Budget Buddy 💰

A full-stack expense tracking application that allows users to manage their budget by adding, editing, and deleting expenses.

🌐 Live: [https://expense-tracker-gjuu.onrender.com](https://expense-tracker-gjuu.onrender.com)
---
#### Setup

```bash
npm install && npm start
```

####🌱 Environment Setup
1.Create a .env file in the root directory.
2.Add your MongoDB connection string:
```
MONGO_URI=your_mongo_connection_string
```
####🧩 Features
- User Authentication (Register & Login)
- Add, Edit, and Delete Expenses
- Filter by Category and Date
- Backend Validation with Mongoose
- Protected Routes with JWT
- API Documentation with Swagger


#### Routers

- auth.js – User authentication routes
- expenses.js – Expense-related CRUD routes

#### User Model
Includes validation for:
- Name
- Email (validated using regex)
- Password (hashed with bcryptjs)

Email Validation Regex

```regex
/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
```
#### Register User

- Validate - name, email, password - with Mongoose
- Hash Password (with bcryptjs)
- Save User
- Generate Token
- Send Response with Token

#### Login User

- Validate - email, password - in controller
- If email or password is missing, throw BadRequestError
- Find User
- Compare Passwords
- If no user or password does not match, throw UnauthenticatedError
- If correct, generate Token
- Send Response with Token

#### Mongoose Errors

- Validation Errors
- Duplicate (Email)
- Cast Error

#### Security

- helmet – Secure HTTP headers
- cors – Cross-origin resource sharing
- xss-clean – Prevent XSS attacks
- express-rate-limit – Limit repeated requests

Swagger UI

```yaml
/jobs/{id}:
  parameters:
    - in: path
      name: id
      schema:
        type: string
      required: true
      description: the job id
```
