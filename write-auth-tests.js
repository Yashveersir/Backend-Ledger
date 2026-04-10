const fs = require('fs');

const register = `$kind: http-request
url: http://localhost:3000/api/auth/register
method: POST
body:
  type: json
  content: |-
    {
        "email": "yashveer@gmail.com",
        "password": "yashveer1",
        "name": "Yashveer"
    }
scripts:
  - type: afterResponse
    language: text/javascript
    code: |-
      const res = pm.response.json();

      pm.test("Status code is 201", function () {
          pm.response.to.have.status(201);
      });

      pm.test("Response has user object with _id, email, name", function () {
          pm.expect(res).to.have.property("user");
          pm.expect(res.user).to.have.property("_id");
          pm.expect(res.user).to.have.property("email");
          pm.expect(res.user).to.have.property("name");
      });

      pm.test("Response has a token string", function () {
          pm.expect(res).to.have.property("token");
          pm.expect(res.token).to.be.a("string");
      });

      pm.test("user.email equals yashveer@gmail.com", function () {
          pm.expect(res.user.email).to.eql("yashveer@gmail.com");
      });

      pm.test("user.name equals Yashveer", function () {
          pm.expect(res.user.name).to.eql("Yashveer");
      });

      pm.collectionVariables.set("authToken", res.token);
order: 1000
`;

const login = `$kind: http-request
url: http://localhost:3000/api/auth/login
method: POST
body:
  type: json
  content: |-
    {
        "email": "yashveer@gmail.com",
        "password": "yashveer1"
    }
scripts:
  - type: afterResponse
    language: text/javascript
    code: |-
      const res = pm.response.json();

      if (res.token) {
          pm.collectionVariables.set("systemToken", res.token);
      }

      pm.test("Status code is 200", function () {
          pm.response.to.have.status(200);
      });

      pm.test("Response has user object with _id, email, name", function () {
          pm.expect(res).to.have.property("user");
          pm.expect(res.user).to.have.property("_id");
          pm.expect(res.user).to.have.property("email");
          pm.expect(res.user).to.have.property("name");
      });

      pm.test("Response has a token string", function () {
          pm.expect(res).to.have.property("token");
          pm.expect(res.token).to.be.a("string");
      });

      pm.test("user.email equals yashveer@gmail.com", function () {
          pm.expect(res.user.email).to.eql("yashveer@gmail.com");
      });

      pm.collectionVariables.set("authToken", res.token);
order: 2000
`;

const logout = `$kind: http-request
url: http://localhost:3000/api/auth/logout
method: POST
headers:
  - key: Authorization
    value: 'Bearer {{authToken}}'
scripts:
  - type: afterResponse
    language: text/javascript
    code: |-
      const res = pm.response.json();

      pm.test("Status code is 200", function () {
          pm.response.to.have.status(200);
      });

      pm.test("Response has message field", function () {
          pm.expect(res).to.have.property("message");
      });

      pm.test("message equals User logged out successfully", function () {
          pm.expect(res.message).to.eql("User logged out successfully");
      });
order: 3000
`;

fs.writeFileSync('postman/collections/Authentication/Register.request.yaml', register);
fs.writeFileSync('postman/collections/Authentication/Login.request.yaml', login);
fs.writeFileSync('postman/collections/Authentication/Logout.request.yaml', logout);
console.log('All 3 files written successfully.');
