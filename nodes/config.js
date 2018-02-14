'use strict';

const isRelative = require('is-relative');
const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const path = require('path');

module.exports = RED => {
  function KeyValueStoreNode(n) {
    RED.nodes.createNode(this, n);

    this.filepath = n.filepath;
    const filepath = this._filepath = path.normalize(isRelative(this.filepath)
      ? path.join(RED.settings.userDir, this.filepath)
      : this.filepath);
    this.debug(`Normalized filepath ${this.filepath} to ${filepath}`);
    const namespace = this.namespace = n.namespace;

    this._keypath = namespace ? key => `${namespace}.key` : key => key;

    this.debug(`Loading key-value store at ${filepath}`);
    this._ready = low(new FileAsync(filepath))
      .then(db => {
        this._db = db;
        return db.defaults({}).write();
      })
      .then(() => {
        this.debug(`Key-value store ready at ${filepath}`);
      })
      .catch(err => {
        node.error(`Failed to load key-value store at ${filepath}:\n\n${err}`);
      });
  };

  KeyValueStoreNode.prototype = {
    get() {
    },
    set(key, value) {
      key = this._keypath(key);
      return this._ready.then(() => this._db.set(key, value).write())
        .then(() => {
          this.debug(`Wrote value to keypath "${key}" in ${this.filepath}`);
        });
    },
    delete() {
    },
    clear() {
    }
  };

  RED.nodes.registerType('key-value-store', KeyValueStoreNode);
};
