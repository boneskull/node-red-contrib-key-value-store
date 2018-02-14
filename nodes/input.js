'use strict';

module.exports = RED => {
  function KeyValueInputNode (n) {
    RED.nodes.createNode(this, n);

    this.store = RED.nodes.getNode(n.store);
    this.key = n.key;
    this.keyType = n.keyType;
    this.keyvalue = n.keyvalue;
    this.keyvalueType = n.keyvalueType;

    this.on('input', msg => {
      let inputKey;
      let inputValue;

      // this.debug(require('util').inspect(this, {depth: 2}));
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
    });
  };

  RED.nodes.registerType('key-value-input', KeyValueInputNode);
};
