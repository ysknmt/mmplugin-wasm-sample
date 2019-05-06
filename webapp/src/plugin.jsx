import React, {lazy} from 'react';

import {id as pluginId} from './manifest';


export default class DemoPlugin {
    initialize(registry, store) {
        const wasm = import('../crate/pkg');
        // const wasm = import('wasm');
        wasm.then(js => {
            console.log(js);
            js.greet("test");
        });
    }

    uninitialize() {
        //eslint-disable-next-line no-console
        console.log(pluginId + '::uninitialize()');
    }
}
