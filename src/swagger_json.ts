export const swagger_json_cache = JSON.parse(`{"swagger":"2.0","info":{"title":"testing aja","version":"1.0.0","description":"please complete information in .env","termsOfService":"http://swagger.io/terms/","contact":{},"license":{"name":"MIT","url":"https://opensource.org/licenses/MIT"}},"host":"localhost:1337","basePath":"/","schemes":["http","https"],"securityDefinitions":{"Bearer":{"type":"apiKey","name":"Authorization","in":"header","description":"Enter your bearer token in the format **Bearer &lt;token>**"}},"consumes":["application/json"],"produces":["application/json"],"paths":{"/":{"get":{"tags":["Root"],"description":"","parameters":[],"responses":{"200":{"description":"OK"}}}},"/api/auth/v1/register":{"post":{"tags":["Auth"],"description":"","parameters":[{"name":"body","in":"body","schema":{"type":"object","properties":{"username":{"example":"any"},"password":{"example":"any"},"name":{"example":"any"},"profile_image":{"example":"any"}}}}],"responses":{}}},"/api/auth/v1/login":{"post":{"tags":["Auth"],"description":"","parameters":[{"name":"body","in":"body","schema":{"type":"object","properties":{"username":{"example":"any"},"password":{"example":"any"}}}}],"responses":{}}},"/api/auth/v1/logout":{"delete":{"tags":["Auth"],"summary":"(*)","description":"","parameters":[],"responses":{},"security":[{"Bearer":[]}]}},"/api/auth/v1/token-validation":{"get":{"tags":["Auth"],"summary":"(*)","description":"","parameters":[],"responses":{},"security":[{"Bearer":[]}]}},"/api/auth/v1/reset-password":{"post":{"tags":["Auth"],"description":"","parameters":[{"name":"body","in":"body","schema":{"type":"object","properties":{"username":{"example":"any"}}}}],"responses":{}},"put":{"tags":["Auth"],"description":"","parameters":[{"name":"body","in":"body","schema":{"type":"object","properties":{"ref":{"example":"any"},"password":{"example":"any"},"newPassword":{"example":"any"},"rePassword":{"example":"any"}}}}],"responses":{}}},"/api/user/v1/init":{"get":{"tags":["User"],"description":"","parameters":[],"responses":{}}},"/api/user/v1/update":{"put":{"tags":["User"],"description":"","parameters":[{"name":"body","in":"body","schema":{"type":"object","properties":{"name":{"example":"any"},"profile_image":{"example":"any"}}}}],"responses":{}}}},"definitions":{"only_message":{"type":"object","properties":{"message":{"type":"string","example":"string"}}}}}`);