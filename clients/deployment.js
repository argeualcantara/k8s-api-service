const logger = require("../helper/logger");
const logget = require ("../helper/logger")

const deploy = {
    "deployApp": function (k8s, req, res) {
        
        try {
            createDeployment(k8s, req, res);
            createService(k8s, req, res);
            createIngress(k8s, req, res);
            res.send({status: 200, message: "App deployed successfully"});
        } catch (err) {
            res.send(err);
        }

    }
}

module.exports = deploy;

async function createDeployment (k8s, req, res) {
    const data = req.body;
    const namespaceName = req.params.namespace;
    const replica = data.replica || 1;
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();
    const k8sApi = kc.makeApiClient(k8s.AppsV1Api);

    var deploy = {
        kind: "Deployment",
        apiVersion: "apps/v1",
        metadata: {
            name: data.name
        },
        spec: {
            replicas: replica,
            selector: {
                matchLabels: { app: data.name }
            },
            template: {
                metadata: {
                    labels: { app: data.name }
                },
                spec: {
                    containers:[
                        {
                            name: data.name,
                            image: data.image,
                            ports: [
                                {
                                    containerPort: data.port
                                }
                            ]
                        }
                    ]
                }
            }
        }
    };
    // for(var i=0; i<data.ports.length; i++) {
    //     var portObject = {
    //         containerPort: data.ports[i]
    //     }
    //     deploy.spec.template.spec.containers[0].ports.push(portObject);
    // }
    
    try {
        const response = await k8sApi.createNamespacedDeployment(namespaceName, deploy)
        console.log('Created deployment');
        console.log(JSON.stringify(response.body));
    } catch(err) {
        logger.err(err);
        if(err.response && err.response.body.reason == "AlreadyExists"){
            logger.log("Updating deployment");
            try{
                var resp = await k8sApi.replaceNamespacedDeployment(data.name, namespaceName, deploy);
                console.log(JSON.stringify(resp.body));
            } catch (err2) {
                logger.err(err2);
                throw err2;
            }
        } else{
            throw err;
        }
    }
}

async function createService(k8s, req, res) {
    const data = req.body;
    const namespaceName = req.params.namespace;
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();
    const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

    var service = {
        kind: "Service",
        apiVersion: "v1",
        metadata: {
            name: data.name
        },
        spec: {
            selector: {
                app: data.name
            },
            ports: [
                {
                    protocol: "TCP",
                    port: data.port,
                    targetPort: data.port
                }
            ]
        }
    };
    
    try {
        const response = await k8sApi.createNamespacedService(namespaceName, service);
        console.log('Created service');
        console.log(JSON.stringify(response.body));
    } catch(err) {
        logger.err(err);
        if(err.response && err.response.body.reason == "AlreadyExists"){
            logger.log("Updating service");
            try{
                var resp = await k8sApi.deleteNamespacedService(data.name, namespaceName);
                console.log(JSON.stringify(resp.body));
                resp = await k8sApi.createNamespacedService(namespaceName, service);
                console.log(JSON.stringify(resp.body));
            } catch (err2) {
                logger.err(err2);
                throw err2;
            }
        } else{
            throw err;
        }
    }
}

async function createIngress(k8s, req, res) {
    const data = req.body;
    const namespaceName = req.params.namespace;
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();
    const k8sApi = kc.makeApiClient(k8s.NetworkingV1Api);

    var ingress = {
        kind: "Ingress",
        apiVersion: "networking.k8s.io/v1",
        metadata: {
            name: data.name,
            annotations: {
                "kubernetes.io/ingress.class": "public",
                "nginx.ingress.kubernetes.io/configuration-snippet":`proxy_set_header Accept-Encoding "";
sub_filter '<base href="/">' '<base href="${data.appPath}/">';
sub_filter_once on;`,
                "nginx.ingress.kubernetes.io/rewrite-target": "/$2"
            }
        },
        spec: {
            rules: [
                {
                    http: {
                        paths: [
                            {
                                path: data.appPath + "(/|$)(.*)",
                                pathType: "Prefix",
                                backend: {
                                    service: {
                                        name: data.name,
                                        port: {
                                            number: data.port
                                        }
                                    }
                                }
                            }
                        ]
                    }
                }
            ]
        }
    };
    
    try {
        const response = await k8sApi.createNamespacedIngress(namespaceName, ingress)
        console.log('Created ingress');
        console.log(JSON.stringify(response.body));
    } catch(err) {
        logger.err(err);
        if(err.response && err.response.body.reason == "AlreadyExists"){
            logger.log("Updating ingress");
            try{
                var resp = await k8sApi.replaceNamespacedIngress(data.name, namespaceName, ingress);
                console.log(JSON.stringify(resp.body));
            } catch (err2) {
                logger.err(err2);
                throw err2;
            }
        } else{
            throw err;
        }
    }
}