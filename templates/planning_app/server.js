const path = require('path');
const express = require('express');
const app = require('./app');
const server = express();
server.use(express.json());
server.use(express.static(path.join(__dirname, 'public')));
server.use(app);
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Planning app listening on ${PORT}`));
