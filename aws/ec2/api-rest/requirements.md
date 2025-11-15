## Requirements

#### Resources

1. Tags
POST /tags Crear una nueva fila en tags


2. UserTag 
GET /users/:id/tags Obtener las tags de un usuario
GET /users/:id/tags/:id Obtener una tag de un usuario
POST /users/:id/tags Crear una nueva fila en tags
DELETE /users/:id/tags/:id


3. Users
POST /signup
POST /login
DELETE /users/:id

4. Updates
GET /users/:id/tags/:id/updates


#### Websocket (frontend<->mqtt_server) (no se incluye en api-rest)

1. Busqueda


