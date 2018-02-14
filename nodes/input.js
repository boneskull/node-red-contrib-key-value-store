'use strict';

module.exports = RED => {
  function KeyValueInputNode(n) {
    RED.nodes.createNode(this, n);

    this.store = RED.nodes.getNode(n.store);
    this.key = n.key;
    this.keyType = n.keyType;
    this.keyvalue = n.keyvalue;
    this.keyvalueType = n.keyvalueType;
    this.action = n.action;

    this.on('input', msg => {
      let inputKey;
      let inputValue;

      switch (this.action) {
        case 'set':
          switch (this.keyType) {
            case 'msg':
              inputKey = msg[this.key];
              break;
          }
          switch (this.keyvalueType) {
            case 'msg':
              inputValue = msg[this.keyvalue];
              break;
          }

          return this.store.set(inputKey, inputValue)
            .then(() => {
              msg.payload = inputValue;
              this.send(msg);
            })
            .catch(err => {
              this.error(err);
            });
          break;
        case 'delete':
          switch (this.keyType) {
            case 'msg':
              inputKey = msg[this.key];
              break;
          }

          return this.store.delete(inputKey)
            .then(() => {
              this.send(msg);
            }).catch(err => {
              this.error(err);
            });
          break;
        case 'clear':
          return this.store.clear()
            .then(() => {
              this.send(msg);
            }).catch(err => {
              this.error(err);
            });
      }
    });
  };

  RED.nodes.registerType('key-value-input', KeyValueInputNode);
};
