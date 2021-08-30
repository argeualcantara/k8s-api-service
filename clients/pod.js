const pods = {
    "listPodsFromNamespace": (k8s, req, res) => {
        const kc = new k8s.KubeConfig();
        kc.loadFromDefault();

        const methodResponse = res;

        const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

        k8sApi.listNamespacedPod(req.params.namespace).then((res) => {
            console.log(JSON.stringify(res.body));
            methodResponse.send(res.body);
        },
        (err) => {
            console.log(JSON.stringify(err));
            methodResponse.send(err);
        });
    },
    "observePodRestart": (k8s, namespace) => {
        const kc = new k8s.KubeConfig();
        kc.loadFromDefault();
        const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
    
        k8sApi.listNamespacedPod(namespace).then((res) => {
            for(var i = 0; i < res.body.items.length; i++){
                var pod = res.body.items[i];
                console.log("------------------ Pod: "+pod.metadata.name+"---------------------------");
                console.log("Containers:");
                for(var j = 0; j < pod.status.containerStatuses.length; j++) {
                    var containerStatus = pod.status.containerStatuses[j];
                    console.log("- name: "+containerStatus.name)
                    console.log("  image: "+containerStatus.image)
                    console.log("  restartCount: "+containerStatus.restartCount)
                    if(containerStatus.restartCount > 0 && containerStatus.state.running) {
                        var startedAt = new Date(containerStatus.state.running.startedAt);
                        if(Date.now() - startedAt.getTime() < 300000) {
                            console.log("Pods restarted in less than 5 minutes, sending alert...")
                        }
                    }
                }
    
            }
        });
    }
}

module.exports = pods;