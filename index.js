const express = require('express')
const k8s = require('@kubernetes/client-node');

const nsClient = require("./clients/namespace");
const podClient = require("./clients/pod");

const app = express();
const port = 3000;

app.get('/namespace', (req, res) => {
    nsClient.listNamespace(k8s, req, res);
})

app.post('/namespace/:namespace', (req, res) => {
    nsClient.createNameSpace(k8s, req, res);
})

app.get('/namespace/:namespace/pods', (req, res) => {
    podClient.listPodsFromNamespace(k8s, req, res);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})
