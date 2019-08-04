module.exports = function (RED) {
    "use strict";

    const OVH = require("ovh");

    function ovh_api_node(config) {
        RED.nodes.createNode(this, config);

        let cred = RED.nodes.getNode(config.auth)
        let node = this;

        this.ovh = OVH({
            endpoint: cred.credentials.endpoint,
            appKey: cred.credentials.api_key,
            appSecret: cred.credentials.api_secret,
            consumerKey: cred.credentials.csm_key
        });

        this.ovh.request('GET', '/me', function (err, serviceName) {
            if (err) {
                node.error(serviceName);
                node.status({ fill: "red", shape: "ring", text: err + " " + serviceName})
            } else {
                node.serviceName = serviceName;
                node.status({ fill: "green", shape: "dot", text: serviceName.organisation })
            }
        })

        this.on('input', function (msg) {

            var topic = msg.topic;
            if (topic === undefined || topic === null || topic === "") {
                topic = config.topic || "";
            }
            
            var method = msg.method;
            if (method === undefined || method === null || method === "") {
                method = config.method;
            }

            var url = msg.url;
            if (url === undefined || url === null || url === "") {
                url = config.url;
            }

            var params = msg.params;
            if (params === undefined || params === null || params === "") {
                params = config.params;
            }

            this.ovh.request(method, url, params, function (errsend, result) {
                msg.payload = result;
                if (errsend) {
                    node.error(errsend + " " + result)
                    msg.sent = false;
                    node.send(msg);
                } else {
                    msg.sent = true;
                    node.send(msg);
                }
            });

        });
    }

    RED.nodes.registerType("ovh api", ovh_api_node);

}
