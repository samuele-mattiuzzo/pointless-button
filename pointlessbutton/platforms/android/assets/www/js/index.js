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


function pointlessData(evt, evt_type) {

    // Types of events:
    // - touchstart: start time, x, y coordinates, location
    // - touchend: end time, duration, time of the day
    // Dumps a JSON object

    if (evt_type == "touchstart") {

        var jsonPointlessData = {
            "pointless": []
        };
        var start = new Date().getTime() / 1000;

        jsonPointlessData["pointless"].push({
            "x": evt.touches[0].pageX,
            "y": evt.touches[0].pageY,
            "start": start,
            "location": ''
        });
        return jsonPointlessData;
    }

    if (evt_type == "touchend") {

        var jsonPointlessData = {
            "pointless": []
        };
        var end = new Date().getTime() / 1000;
        var time = new Date();
        var duration = 'duration';

        //end - this.touchStartData["pointless"]["start"];
        jsonPointlessData["pointless"].push({
            "end": end,
            "time": time,
            "duration": duration,
        });
        return jsonPointlessData;
    }

};

// TODO put these functions in global.js
// DROP TABLE It's just for testing
function initDB(tx) {
    tx.executeSql('DROP TABLE IF EXISTS POINTLESS'); 
    tx.executeSql('CREATE TABLE IF NOT EXISTS POINTLESS (id unique, x, y, start, location, end, time, duration)');
}

// Save data JSON on db
function save(data, db) {
    data = JSON.stringify(data);

    db.transaction(function (tx) {
        console.log('saving ' + data);
        var sqlInsert = "INSERT INTO POINTLESS (' + data.x + ',' + data.y + ',' + data.start + ',' + data.location + ',' + data.end + ',' data.time + ',' + data.duration + ')'"
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
}

var app = {

    // TouchStartData
    touchStartData: '',
    // TouchEndData
    touchEndData: '',

    db: '',



    // Application Constructor
    initialize: function() {
        this.bindEvents();

        // createDB();
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
        db = window.openDatabase("Database", "1.0", "Cordova Demo", 65535);
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
            //debug.innerHTML = 'Status: touch';
            var dataStart = pointlessData(e, 'touchstart');
            debug.innerHTML = JSON.stringify(dataStart, undefined, 2);
            e.preventDefault();
            save(JSON.stringify(dataStart, undefined, 2).pointless, db);
            db.transaction(queryDB, errorCB);
        }, false);

        pb.addEventListener('touchend', function(e) {
            // Detects a touch end event
            //debug.innerHTML = 'Status: released';

            // TODO: make sure this is syncronized
            // Possibly create an EventRegister object that will be dumped to db

            var dataEnd = pointlessData(e, 'touchend');
            debug2.innerHTML = JSON.stringify(pointlessData(e, 'touchend'), undefined, 2);
            e.preventDefault();
            save(JSON.stringify(pointlessData(e, 'touchend').pointless, undefined, 2), db);
            db.transaction(queryDB, errorCB);
            // TODO: store in db
        }, false);
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    }

};