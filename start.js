const http = require('http');
const app = require('./index');

const port = parseInt(process.env.PORT, 10) || 8000;
app.set('port', port);

const server = http.createServer(app);
server.listen(port);
console.log("Server online and listening to http://localhost:"+port);