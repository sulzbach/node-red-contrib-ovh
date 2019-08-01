module.exports = function (RED) {
    "use strict";

    const OVH = require("ovh");

    function ovh_node(n) {
        RED.nodes.createNode(this, n);

        let cred = RED.nodes.getNode(n.auth)
        let node = this;
        this.name = n.name;
        this.from = n.from;
        this.number = n.number;
        this.topic = n.topic;
        this.noStopClause = !n.StopClause;

        this.ovh = OVH({
            appKey: cred.credentials.api_key,
            appSecret: cred.credentials.api_secret,
            consumerKey: cred.credentials.csm_key
        });

        this.ovh.request('GET', '/me', function (err, serviceName) {
            if (err) {
                node.error(serviceName);
                node.status({ fill: "red", shape: "ring", text: err + " " + serviceName })
            } else {
                node.serviceName = serviceName;
                node.status({ fill: "green", shape: "dot", text: serviceName })
            }
        })

        this.on('input', function (msg) {
            this.ovh.request(msg.method, msg.url, {
                // message: msg.payload,
                // sender: (msg.hasOwnProperty("from") && typeof (msg.from) === "string") ? msg.from : this.from,
                // receivers: [(msg.hasOwnProperty("number") && typeof (msg.number) === "string" && msg.number.match(/^\+?[1-9]\d{1,14}$/) !== null) ? msg.number : this.number],
                // noStopClause: this.noStopClause
            }, function (errsend, result) {
                if (errsend) {
                    node.error(errsend + " " + result)
                    node.send({ topic: this.topic, sent: false });
                } else {
                    node.send({ topic: this.topic, sent: true });
                }
            });
        });
    }

    RED.nodes.registerType("ovh_api", ovh_api_node);

}
