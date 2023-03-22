# Twidder - Socialize with your friends!

### Linköping University

## Get Start
type `node server.js` or `nodemon server.js` to start the server.

if the error "node:internal/modules/cjs/loader:1302
return process.dlopen(module, path.toNamespacedPath(filename));" occured, try typing `npm rebuild bcrypt --build-from-source` to solve the problem.

the server is running on port 3000.

On our website, you can write a blog，record reminders, send messages to your friends, or receive messages from friends.

# Twidder - Socialize with your friends!

### Linköping University

## Get Start
type `node server.js` or `nodemon server.js` to start the server.

if the error "node:internal/modules/cjs/loader:1302
return process.dlopen(module, path.toNamespacedPath(filename));" occured, try typing `npm rebuild bcrypt --build-from-source` to solve the problem.

the server is running on port 3000.

On our website, you can write a blog，record reminders, send messages to your friends, or receive messages from friends.

## Routes

### signup
request type: POST

domain: /signup

params: { first_name, fam_name, gender, city, country, email, psw } -> req.body

return: json file

### login
request type: POST

domain: /login

params: { email, psw } -> req.body

return: json file, token(include it in the Authorization request header and send it in subsequent routes needed it.)

### post message
request type: POST

domain: /post

params: { text, receiver, poster } -> req.body

              {Authorization: token, email: corresponding user email } -> header

return: json file

### signout
request type: POST

domain: /signout

params: {Authorization: token, email: corresponding user email } -> header

return: json file

### change password
request type: PUT

domain: /changepsw

params: { oldpsw, newpsw } -> req.body

              {Authorization: token, email: corresponding user email } -> header

return: json file

### get user data by token
request type: GET

domain: /getdatabytoken

params: {Authorization: token, email: corresponding user email } -> header

return: json file ,user data

### get user data by email
request type: GET

domain: /getdatabyemail

params: { email } -> req.query

              {Authorization: token, email: corresponding user email } -> header

return: json file ,searched user data

### get user message by token
request type: GET

domain: /getmessagebytoken

params: {Authorization: token, email: corresponding user email } -> header

return: json file ,user received messages

### get user message by email
request type: GET

domain: /getmessagebyemail

params: { email } -> req.query

              {Authorization: token, email: corresponding user email } -> header

return: json file ,searched user received messages


## Database

We use MongoDB Atlas which deployed on the cloud platform,so we don't need to store it in the file,server and everyone can do CRUD in the database.


## Contributing

Shipeng Liu:shili506
Pietro Tellarini:piete843

