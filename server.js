const app = require('./api/index');
const path = require('path');
const express = require('express');

const port = 3000;

// Serve static files locally (Vercel handles this automatically in prod)
app.use(express.static(path.join(__dirname, '.')));

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
