#  "Hallo-backend"

## Description
hallo backend

## Running the app in the first time
### Remember install docker, docker-compose before run command below:
```bash
$ cp .env.example .env 

$ docker-compose up -d
```
## Replica mongo:
 Window:See in https://help.tenten.vn/https-tenten-vn-help-huong-dan-cai-dat-openssl-tren-win10/ to install OpenSSL in Windows 10
 to create keyfile 
```bash
$ openssl rand -base64 756 > /mongodb-keyfile.key
$ chmod 400 /mongodb-keyfile.key
```
 to set up replica
```bash
$ docker exec -it mongodb-prime  bash 
$ mongosh --username "root" --password "example"                                                                      
var config = {
  "_id" :"rs0",
  "version" :1,
  "members" : [
    {
        "_id" : 1,
        "host" :"mongodb-prime:27017",
        "priority" : 3,
    },
    {
        "_id" : 2,
        "host" :"rep1:27017",
        "priority" : 2,
    },
    {
        "_id" : 3,
        "host" :"rep2:27017",
        "priority" : 1,
    },
  ]
};

$ rs.initiate(config,{ force :true });
```
## Migration:
 See in [link](MIGRATION.md)

## Seed:
```bash
$ yarn console:dev seeder
```
## Test:
Run test:
```bash
$ docker-compose up -d
$ yarn typeorm:run
$ make init-test
$ yarn test
```
## Coding conventions
- Using space (not tab)
- Using absolute path: config in vscode: open settings.json -> setting 
    ```
      "javascript.preferences.importModuleSpecifier": "non-relative",
      "typescript.preferences.importModuleSpecifier": "non-relative" 
    ```
- RESTful API:
  - https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/
  - https://betterprogramming.pub/22-best-practices-to-take-your-api-design-skills-to-the-next-level-65569b200b9
- Filename and URL path: using `-` as separator
- Name of file and class must use singular noun. Avoid using plural noun. Plural is used only with array of data.
- Avoid using `any` in `typescript` as much as possible
- Avoid `SELECT *` in `sql` query
- Except `entity.ts`, others should be named as plural (E.g: `orders.service.ts`, NOT `order.service.ts`)
- Code comment: prefer self-explanatory code, should comment at class and function level
- Columns in entity follow by camel case.
- Tables name in database follow plural noun.
- Using connection: report for read, master for write.
- Commit Convention: see in [link](CommitConversion.md)

## Some techniques
- Must read documentations: https://docs.nestjs.com/first-steps. Specially https://docs.nestjs.com/modules
- Hidden secret fields: https://docs.nestjs.com/techniques/serialization
- Database transaction: https://docs.nestjs.com/techniques/database#transactions
- Cron: https://docs.nestjs.com/techniques/task-scheduling. For catching error in cron, can try https://stackoverflow.com/questions/60402716/nestjs-handle-service-exceptions