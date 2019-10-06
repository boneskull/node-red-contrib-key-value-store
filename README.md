# node-red-contrib-json-store

[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

> Simple, persistent, JSON-based key-value store for Node-RED

This provides a simple NR node to get and set values from an on-disk JSON store.
This is a fork of  https://github.com/boneskull/node-red-contrib-key-value-store
With some improvements :
- realy store différentes keys per namespace
- realy merge new datas with actual datas in json file
- possibility to change output key (not only msg.payload)


## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Maintainers](#maintainers)
- [Contribute](#contribute)
- [License](#license)

## Install

**Requires Node.js v6.0.0 or newer**

Either install from the Node-RED palette manager, or:

```
$ npm i node-red-contrib-json-store
```

## Usage

Nodes are found within the **storage** category in NR's palette.  

See node documentation ("info" panel) for specific usage.

## Maintainers

[FredThx](https://github.com/FredThx)

## License

MIT
