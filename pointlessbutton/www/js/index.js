/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Event-to-json
// Main logic (temporary, will be more complex)
var DEBUG = true;

var touchData = {
    "pointless": [],
};
var app_db = {
    'display_name': 'Database',
    'version': '1.0',
    'table': 'Cordova Demo',
    'size': 65535
};

function pointlessData(evt, evt_type) {

    // Types of events:
    // - touchstart: start time, x, y coordinates, location
    // - touchend: end time, duration, time of the day
    // Dumps a JSON object

    if (evt_type == "touchstart") {

        var start = new Date().getTime() / 1000;

        touchData["pointless"].push({
            "x": evt.touches[0].pageX,
            "y": evt.touches[0].pageY,
            "start": start,
            "location": ''
        });
    }

    if (evt_type == "touchend") {

        var end = new Date().getTime() / 1000;
        var time = new Date();
        var duration = 'duration';

        touchData["pointless"].push({
            "end": end,
            "time": time,
            "duration": duration,
        });
    }

}

// TODO put these functions in global.js
// DROP TABLE Is just for testing
function initDB(tx) {
    if (DEBUG){
        tx.executeSql('DROP TABLE IF EXISTS POINTLESS');
    }
    tx.executeSql('CREATE TABLE IF NOT EXISTS POINTLESS (id unique, x, y, start, location, end, time, duration)');
}

// Save data JSON on db 
// TODO: check if it's start or end event or make 2 different tables and external key for reference
function save(data, db) {
    data = JSON.stringify(data);

    db.transaction(function (tx) {
        console.log('saving ' + data);
        var sqlInsert = 'INSERT INTO POINTLESS (' + data.x + ',' + data.y + ',' + data.start + ',' + data.location + ',' + data.end + ',' + data.time + ',' + data.duration + ');';
        console.log(sqlInsert);
        tx.executeSql(sqlInsert);
    }, errorCB, successCB);

}

// Error callback
function errorCB(err) {
    console.log("Error processing SQL: " + err.code);
}

// Show table POINTLESS
function queryDB(tx) {
    // We use sucessCB to show query results
    tx.executeSql('SELECT * FROM POINTLESS', [], successCB, errorCB);
}

// Show results from the query
function successCB(tx, results) {
    var len = results.rows.length;
    console.log("DEMO table: " + len + " rows found.");
    for (var i = 0; i < len; i++) {
        console.log("Row = " + i + " ID = " + results.rows.item(i).id + " Data =  " + results.rows.item(i).data);
    }
    
    //debug2.innerHTML = JSON.stringify(results, undefined, 2);
}

var app = {

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');

        // Create db
        db = window.openDatabase(
            app_db.display_name,
            app_db.version,
            app_db.table,
            app_db.size
        );
        
        // Create tables
        //db.transaction(populateDB, errorCB, successCB);
        // We don't need successCB as callback, it's a create TABE sql statement
        db.transaction(initDB,errorCB);
        db.transaction(queryDB, errorCB);
        
        pb = document.getElementById('pb');
        debug = document.getElementById('debug-message');
        debug2 = document.getElementById('debug-message-2');
       

        pb.addEventListener('touchstart', function(e) {
            // Detects a touch start event
            pointlessData(e, 'touchstart');
            e.preventDefault();

            db.transaction(queryDB, errorCB);
        }, false);

        pb.addEventListener('touchend', function(e) {
            // Detects a touch end event
            pointlessData(e, 'touchend');
            e.preventDefault();

            save(touchData.pointless, db);
            db.transaction(queryDB, errorCB);

        }, false);
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    }

};