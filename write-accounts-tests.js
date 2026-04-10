const fs = require('fs');

const createAccount = `$kind: http-request
url: http://localhost:3000/api/accounts
method: POST
order: 2000
headers:
  - key: Authorization
    value: 'Bearer {{authToken}}'
body:
  type: json
  content: '{}'
scripts:
  - type: afterResponse
    language: text/javascript
    code: |-
      const res = pm.response.json();

      pm.test("Status code is 201", function () {
          pm.response.to.have.status(201);
      });

      pm.test("Response has account object", function () {
          pm.expect(res).to.have.property("account");
          pm.expect(res.account).to.be.an("object");
      });

      pm.test("account._id exists", function () {
          pm.expect(res.account).to.have.property("_id");
      });

      pm.test("account.user exists", function () {
          pm.expect(res.account).to.have.property("user");
      });

      pm.test("account.status equals ACTIVE", function () {
          pm.expect(res.account.status).to.eql("ACTIVE");
      });

      pm.collectionVariables.set("accountId", res.account._id);
`;

const getAllAccounts = `$kind: http-request
url: http://localhost:3000/api/accounts
method: GET
order: 1000
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

      pm.test("Response has accounts array", function () {
          pm.expect(res).to.have.property("accounts");
      });

      pm.test("accounts is an array", function () {
          pm.expect(res.accounts).to.be.an("array");
      });

      pm.test("accounts array length is greater than 0", function () {
          pm.expect(res.accounts.length).to.be.above(0);
      });
`;

const getBalance = `$kind: http-request
url: 'http://localhost:3000/api/accounts/balance/{{accountId}}'
method: GET
order: 3000
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

      pm.test("Response has accountId field", function () {
          pm.expect(res).to.have.property("accountId");
      });

      pm.test("Response has balance field", function () {
          pm.expect(res).to.have.property("balance");
      });

      pm.test("balance is a number", function () {
          pm.expect(res.balance).to.be.a("number");
      });

      pm.test("balance is greater than or equal to 0", function () {
          pm.expect(res.balance).to.be.at.least(0);
      });
`;

fs.writeFileSync('postman/collections/Accounts/Create Account.request.yaml', createAccount, 'utf8');
fs.writeFileSync('postman/collections/Accounts/Get all accounts.request.yaml', getAllAccounts, 'utf8');
fs.writeFileSync('postman/collections/Accounts/Get Balance.request.yaml', getBalance, 'utf8');

console.log('All 3 files written successfully.');
