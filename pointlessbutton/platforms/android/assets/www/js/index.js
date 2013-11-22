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


function init() {
    //db.transaction(populateDB, errorCB, successCB);  
}



var app = {
     
    // TouchStartData
    touchStartData: '',
    // TouchEndData
    touchEndData: '',

    db: '',
    
     populateDB: function(tx) {
        tx.executeSql('DROP TABLE IF EXISTS DEMO');
        tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, data)');
        tx.executeSql('INSERT INTO DEMO (id, data) VALUES (1, "First row")');
        tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "Second row")');
    },

     errorCB: function(err) {
        console.log("Error processing SQL: " + err.code);
    },

     queryDB: function(tx) {
        tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB);
    },

    // Query the success callback
    //

     successCB: function(tx, results) {
        // this will be empty since no rows were inserted.
        console.log("Insert ID = " + results.insertId);
        // this will be 0 since it is a select statement
        console.log("Rows Affected = " + results.rowAffected);
        // the number of rows returned by the select statement
        console.log("Insert ID = " + results.rows.length);
    },

    
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
        console.log(document);
        console.log(window);
        
        db =  window.openDatabase("Database", "1.0", "Cordova Demo", 65535);
        pb = document.getElementById('pb');
        debug = document.getElementById('debug-message');
        debug2 = document.getElementById('debug-message-2');

        pb.addEventListener('touchstart', function(e) {
            // Detects a touch start event
            //debug.innerHTML = 'Status: touch';
            debug.innerHTML = JSON.stringify(pointlessData(e, 'touchstart'), undefined, 2);
            e.preventDefault();
           
        }, false);

        pb.addEventListener('touchend', function(e) {
            // Detects a touch end event
            //debug.innerHTML = 'Status: released';

            // TODO: make sure this is syncronized
            // Possibly create an EventRegister object that will be dumped to db
            debug2.innerHTML = JSON.stringify(pointlessData(e, 'touchend'), undefined, 2);
            e.preventDefault();

            // TODO: store in db
        }, false);
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    }

};