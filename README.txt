AURORA LIBROS - TALLER JSONPLACEHOLDER

Abre index.html con Live Server desde Visual Studio Code.

Se conserva el proyecto original y se agrega la sección Comunidad Aurora.

Requisitos:
- Consulta de usuarios: GET https://jsonplaceholder.typicode.com/users
- Consulta de publicaciones: GET https://jsonplaceholder.typicode.com/posts?userId=ID
- Mensajes de carga y error.
- Selección dinámica de usuario.

Pruebas:
1. Abre F12 > Network.
2. Recarga la página y verifica /users.
3. Selecciona un usuario y verifica /posts?userId=N.
4. Selecciona otro usuario y verifica que cambia N.
5. Para simular fallo, selecciona Offline en Network y pulsa Actualizar usuarios.
6. Restaura No throttling.
7. Completa el registro de pruebas y agrega capturas reales al manual.

El proyecto necesita conexión a internet para consultar JSONPlaceholder.
