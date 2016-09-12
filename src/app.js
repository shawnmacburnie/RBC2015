'use strict';

require('expose?$!expose?jQuery!jquery');
require("bootstrap-webpack");
require('bootstrap-datepicker/dist/js/bootstrap-datepicker');

import Layout from 'src/view/layout';
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(<Layout />, document.getElementById('content'));
