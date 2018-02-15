'use strict';

module.exports = RED => {
  function KeyValueWriteNode(n) {
    RED.nodes.createNode(this, n);

    this.store = RED.nodes.getNode(n.store);
    this.key = n.key;
    this.keyvalue = n.keyvalue;
    this.action = n.action;

    this.on('input', msg => {
      let key = this.key || msg.topic;
      let value = this.keyvalue || msg.payload;
      let action = msg.action || this.action;

      if (value && typeof msg.payload === 'string') {
        try {
          value = JSON.parse(value);
        } catch (ignored) {
        }
      }

      return this[action](key, value)
        .then(() => {
          this.send(msg);
        })
        .catch(err => {
          this.error(err);
        });
    });
  };

  KeyValueWriteNode.prototype = {
    set(key, value) {
      return this.store.set(key, value);
    },
    delete(key) {
      return this.store.delete(key);
    },
    clear() {
      return this.store.clear();
    }
  };

  RED.nodes.registerType('key-value-write', KeyValueWriteNode);
};
