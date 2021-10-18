const express = require('express')
const k8s = require('@kubernetes/client-node');

const nsClient = require("./clients/namespace");
const podClient = require("./clients/pod");
const deployClient = require("./clients/deployment");

const app = express();
const port = 3000;
const intervalTimeInMillis = 9000;

app.use(express.json());

app.get('/namespace', (req, res) => {
    nsClient.listNamespace(k8s, req, res);
})

app.post('/namespace/:namespace', (req, res) => {
    nsClient.createNameSpace(k8s, req, res);
})

app.get('/namespace/:namespace/pods', (req, res) => {
    podClient.listPodsFromNamespace(k8s, req, res);
})

app.post('/namespace/:namespace/deploy', (req, res) => {
  deployClient.createDeploy(k8s, req, res);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
  // setInterval(() => {
  //   podClient.observePodRestart(k8s, "kube-system");
  // }, intervalTimeInMillis);
})
