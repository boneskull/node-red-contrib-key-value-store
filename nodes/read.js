'use strict';

module.exports = RED => {
  function KeyValueReadNode(n) {
    RED.nodes.createNode(this, n);

    this.store = RED.nodes.getNode(n.store);
    this.key = n.key;
    this.output_key = n.output_key || "payload"

    this.on('input', msg => {
      const key = this.key || msg.topic;
      return this.store.get(key)
        .then(data => {
          msg[this.output_key] = data;
          this.send(msg);
        })
        .catch(err => {
          this.error(err);
        });
    });
  };

  RED.nodes.registerType('key-value-read', KeyValueReadNode);
};
