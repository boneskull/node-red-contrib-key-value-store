'use strict';

module.exports = RED => {
  function KeyValueReadNode(n) {
    RED.nodes.createNode(this, n);

    this.store = RED.nodes.getNode(n.store);
    this.key = n.key;

    this.on('input', msg => {
      const key = this.key || msg.topic;
      this.debug(`Received key "${key}"`);

      return this.store.get(key)
        .then(data => {
          this.debug(`Received data from store: ${data}`);
          msg.payload = data;
          this.send(msg);
        })
        .catch(err => {
          this.error(err);
        });
    });
  };

  RED.nodes.registerType('key-value-read', KeyValueReadNode);
};
