const pods = {
    "listPodsFromNamespace": function (k8s, req, res) {
        const kc = new k8s.KubeConfig();
        kc.loadFromDefault();

        const methodResponse = res;

        const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

        k8sApi.listNamespacedPod(req.params.namespace).then((res) => {
            console.log(res.body);
            methodResponse.send(res.body);
        },
        (err) => {
            console.log(err);
            methodResponse.send(err);
        });
    }
}

module.exports = pods;