const base = require('@jonahsnider/xo-config');

const config = {...base};

// TODO: These rules seem to be broken on TS 5
config.rules['import/no-named-as-default-member'] = 'off';
config.rules['import/no-named-as-default'] = 'off';

module.exports = base;
