const path = require('path');
const express = require('express');
const volleyball = require('volleyball');
const app = express();

module.exports = app;

const rootPath = path.join(__dirname, '..');
const publicPath = path.join(rootPath, 'public');
const nodeModulesPath = path.join(rootPath, 'node_modules');

app.set('port', (process.env.PORT || 1337));

// ~~~~~ serve static assets ~~~~~ \\
app.use(express.static(rootPath));
app.use(express.static(publicPath));
app.use(express.static(nodeModulesPath));

// ~~~~~ logging middleware ~~~~~ \\
app.use(volleyball);

app.get('*', (req, res, next) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});


app.listen(app.get('port'), () => {
  console.log(`server listening on port ${app.get('port')}`);
});
