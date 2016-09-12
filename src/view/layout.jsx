'use strict';

import $ from 'jquery';
import io from 'socket.io-client';
import React from 'react';

const Layout = React.createClass({
    componentDidMount: function() {
        $.fn.datepicker.defaults.format = 'yyyy-mm-dd';
        $('#histEndDate').datepicker({});
        $('#histStartDate').datepicker();
        let period = 'd';
        let buttons = $('.btn-group > button.btn');

        function updateButtons() {
            for (let i = 0; i < buttons.length;i++) {
                let button = $(buttons[i]);
                if (button.text()[0] !== period) {
                    button.removeClass('btn-primary');
                    button.addClass('btn-default');
                } else {
                    button.removeClass('btn-default');
                    button.addClass('btn-primary');
                }
            }
        }
        updateButtons();

        buttons.on('click', function() {
            period = this.innerHTML[0];
            updateButtons();
        });


        let socket = io();
        $('#snapSubmitButton').click(function(e){
            e.preventDefault();
            var symbol = $('#snapSymbol').val();
            socket.emit('postSnapYahoo', symbol);
        });
        $('#histSubmitButton').click(function(e){
            e.preventDefault();
            var query = {
                symbol: $('#histSymbol').val(),
                from: $('#histStartDate input').val(),
                to: $('#histEndDate input').val()
            };
            if (period) {
                query.period = period;
            }
            socket.emit('postHistYahoo', query);
        });

        socket.on('newYahoo', function(data) {
            var resultsHeader = $('#resultsHeader');
            if(!resultsHeader.text()) resultsHeader.text('Results')
            $('#dataLocation').append('<pre><code>' + JSON.stringify(data, null, 2) + '</code></pre>');
        });
    },

    render: function() {
        return (
    <div className="container">
        <div className="row">
            <div className="col-md-6">
                <h3>Snapshot</h3>
                <form>
                    <div className="form-group">
                        <label htmlFor="snapSymbol">Symbol</label>
                        <input className="form-control" type="text" id="snapSymbol" placeholder="Symbol" />
                    </div>
                    <button className="btn btn-default" id="snapSubmitButton">Search</button>
                </form>
            </div>
            <div className="col-md-6">
                <h3>Historical Data</h3>
                <form>
                    <div className="form-group">
                        <label htmlFor="histSymbol">Symbol</label>
                        <input className="form-control" type="text" id="histSymbol" placeholder="Symbol" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="histStartDate">Start Date</label>
                        <div className="input-group date" id="histStartDate">
                            <input type="text" className="form-control" />
                            <span className="input-group-addon">
                                    <span className="glyphicon glyphicon-calendar" />
                                </span>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="histEndDate">End Date</label>
                        <div className="input-group date" id="histEndDate">
                            <input type="text" className="form-control" />
                            <span className="input-group-addon">
                                    <span className="glyphicon glyphicon-calendar" />
                                </span>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Time Interval: </label>
                        <div className="btn-group" role="group" aria-label="...">
                            <button type="button" className="btn btn-default">daily</button>
                            <button type="button" className="btn btn-default">weekly</button>
                            <button type="button" className="btn btn-default">monthly</button>
                        </div>

                    </div>
                    <button className="btn btn-default" id="histSubmitButton">Search</button>
                </form>
            </div>
        </div>
        <h2 id="resultsHeader" />
        <div className="row" id="dataLocation" />
    </div>);
    }
});

export default Layout;
