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

var touchData = {
    "pointless": {},
};
var app_db = {
    'name': 'Database',
    'version': '1.0',
    'display_name': 'Cordova Demo',
    'size': 65535
};

function pointlessData(evt, evt_type) {

    // Types of events:
    // - touchstart: start time, x, y coordinates, location
    // - touchend: end time, duration, time of the day
    // Dumps a JSON object

    if (evt_type == "touchstart") {

        var start = new Date().getTime() / 1000;

        touchData["pointless"]["x"] = evt.touches[0].pageX;
        touchData["pointless"]["y"] = evt.touches[0].pageY;
        touchData["pointless"]["start"] = start;
        touchData["pointless"]["location"] = 'location';

    }

    if (evt_type == "touchend") {

        var end = new Date().getTime() / 1000;
        var time = new Date();
        var duration = touchData.start - end;

        touchData["pointless"]["end"] = end;
        touchData["pointless"]["time"] = time;
        touchData["pointless"]["duration"] = duration;

    }

}

// TODO put these functions in global.js
// DROP TABLE Is just for testing
function initDB(tx) {
    if (DEBUG){
        tx.executeSql('DROP TABLE IF EXISTS POINTLESS');
    }
    tx.executeSql('CREATE TABLE IF NOT EXISTS POINTLESS (' +
        'id INTEGER primary key autoincrement, ' +
        'x INTEGER, ' +
        'y INTEGER, ' +
        'start REAL, ' +
        'end REAL, ' +
        'location TEXT, ' +
        'time TEXT, ' +
        'duration TEXT)');
}

// Save data JSON on db 
// TODO: check if it's start or end event or make 2 different tables and external key for reference
function save(data, db) {
    
    db.transaction(function (tx) {
        console.log('saving ' + JSON.stringify(data));
        var sqlInsert = "INSERT INTO " +
            "POINTLESS (x, y, start, end, location, time, duration) " +
            "VALUES ('" +
                data.x + "', '" +
                data.y + "', '" +
                data.start + "', '" +
                data.end + "', '" +
                data.location + "', '" +
                data.time + "', '" +
                data.duration +
            "')";

        console.log(sqlInsert);
        tx.executeSql(sqlInsert);
    }, errorCB, successCB);

}

// Error callback
function errorCB(err) {
    console.log("[ ERROR ] Processing SQL: " + err.code + "\n" + err.message);
}

// Show results from the query
function successCB(tx, results) {
    console.log(results.rows);
    console.log("DEMO table: " + results.rows.length + " rows found.");
    var items = [];

    for (var i = 0; i < results.rows.length; i++) {
        var item = results.rows.item(i);
        items.push({
            'row': i,
            'id': item.id,
            'x': item.x,
            'y': item.y,
            'location': item.location,
            'start': item.start,
            'end': item.end,
            'duration': item.duration
        });
    }
    console.log(JSON.stringify(items));
}

// Show table POINTLESS
function queryDB(tx) {
    // We use sucessCB to show query results
    tx.executeSql('SELECT * FROM POINTLESS', [], successCB, errorCB);
}

// MAIN
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
        db = window.openDatabase(app_db.name, app_db.version, app_db.display_name, app_db.size);
        
        // Create tables
        // We don't need successCB as callback, it's a create TABE sql statement
        db.transaction(initDB, errorCB);
        db.transaction(queryDB, errorCB);
        
        pb = document.getElementById('pb');
        debug = document.getElementById('debug-message');
        debug2 = document.getElementById('debug-message-2');
       

        pb.addEventListener('touchstart', function(e) {
            // Detects a touch start event
            pointlessData(e, 'touchstart');
            e.preventDefault();

            db = window.openDatabase(app_db.name, app_db.version, app_db.display_name, app_db.size);
            db.transaction(queryDB, errorCB);
        }, false);

        pb.addEventListener('touchend', function(e) {
            // Detects a touch end event
            pointlessData(e, 'touchend');
            e.preventDefault();

            save(touchData.pointless, db);
            db = window.openDatabase(app_db.name, app_db.version, app_db.display_name, app_db.size);
            db.transaction(queryDB, errorCB);

        }, false);
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    }

};