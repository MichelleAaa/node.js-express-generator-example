Boilerplate created with express-generator.

Blog and users routes based off of nucampsiteserver.-- Express Sessions with Basic Auth.

In Postman:
(Ensure the Mongodb server is running in a bash terminal and that you npm start-ed, then...)

POST to: http://localhost:3000/users/signup
Body - Raw - JSON - {"username": "user", "password": "password"}

http://localhost:3000/users/login
Auth tab - Basic Auth - Enter username/password.
Then POST request

http://localhost:3000/blog

GET - Sending will display all blog posts. (If there's no blog posts yet, it will be empty [])
POST - Body - Raw - JSON - {"title": "Blog Post 1", "description": "Testing 1 2 3"}

http://localhost:3000/users/logout
GET request to log out

http://localhost:3000/blog/62f025a2873310332c54a93e(aka the blog post ID number)/comments
POST - Body - Raw - JSON - {"rating": "5", "text": "Testing 1 2 3", "author": "testing"}