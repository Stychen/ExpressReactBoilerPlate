import 'array.prototype.findindex';

import ReactDOM from 'react-dom';
import React from 'react';
import HomePage from './components/HomePage';


main();

function main() {
    const pageContext = (typeof(PAGE_CONTEXT) === 'undefined') ? {} : PAGE_CONTEXT;

    const app = document.createElement('div');
    document.body.appendChild(app);
    ReactDOM.render(<HomePage />, app);
}
