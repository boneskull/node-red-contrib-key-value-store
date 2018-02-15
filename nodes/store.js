'use strict';

const isRelative = require('is-relative');
const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const path = require('path');

module.exports = RED => {
  function KeyValueStoreNode(n) {
    RED.nodes.createNode(this, n);

    this.filepath = n.filepath;
    const filepath = this._filepath =
      path.normalize(isRelative(this.filepath) ? path.join(RED.settings.userDir,
        this.filepath
      ) : this.filepath);
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
    get(key) {
      key = this._keypath(key);
      return this._ready.then(() => this._db.get(key).value()).then(res => {
        this.debug(`Got ${res
          ? 'truthy'
          : 'falsy'} value from keypath "${key}" in ${this.filepath}`);
        return res;
      });
    },
    set(key, value) {
      key = this._keypath(key);
      return this._ready.then(() => this._db.set(key, value).write())
        .then(() => {
          this.debug(`Wrote value to keypath "${key}" in ${this.filepath}`);
        });
    },
    delete(key) {
      key = this._keypath(key);
      return this._ready.then(() => this._db.unset(key).write())
        .then(() => {
          this.debug(`Deleted value at keypath "${key}" in ${this.filepath}`);
        });
    },
    clear() {
      return this._ready.then(() => {
        if (this.namespace) {
          return this._db.unset(this.namespace).write().then(() => {
            this.debug(`Cleared db at namespace "${namespace}" in ${this.filepath}`);
          });
        }
        return this._db.setState({}).write().then(() => {
          this.debug(`Cleared db in ${this.filepath}`);
        });
      });
    }
  };

  RED.nodes.registerType('key-value-store', KeyValueStoreNode);
};
