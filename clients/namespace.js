const namespace = {
    "listNamespace": function (k8s, req, res) {
        const methodResponse = res;
        const kc = new k8s.KubeConfig();
        kc.loadFromDefault();
    
        const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
    
        k8sApi.listNamespace().then(
            (response) => {
                console.log('List namespace');
                console.log(JSON.stringify(response.body));
                methodResponse.send(response.body);
            },
            (err) => {
                console.log('Error!: ' + err);
                methodResponse.send(err);
            },
        );
    },
    "createNameSpace": function (k8s, req, res) {
        const kc = new k8s.KubeConfig();
        kc.loadFromDefault();
        const methodResponse = res;
    
        const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
    
        var namespace = {
            metadata: {
                name: req.params.namespace,
            },
        };
    
        k8sApi.createNamespace(namespace).then(
            (response) => {
                console.log('Created namespace');
                console.log(response.body);
                methodResponse.send(response.body);
            },
            (err) => {
                console.log('Error!: ' + err);
                methodResponse.send(err);
            },
        );
    }
}

module.exports = namespace;