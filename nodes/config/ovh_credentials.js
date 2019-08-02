module.exports = function (RED) {
    "use strict";

    function ovhCredentialsNode(n) {
        RED.nodes.createNode(this, n);
        this.name = n.name;
    }

    RED.nodes.registerType("ovh-credentials", ovhCredentialsNode, {
        credentials: {
            endpoint: {},
            api_key: { type: "password" },
            api_secret: { type: "password" },
            csm_key: { type: "password" }
        }
    });

}
