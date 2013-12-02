// DB-Layer

/* Each table definition is a one-line string
* it's split to allow better readability, but must mantain this syntax:
* <row_name> TYPE [options], <row_name> TYPE [options], ...
*/
DB_TABLES = {
    'PUSH': {
        'def': 'id INTEGER primary key autoincrement, ' +
                'x INTEGER, ' +
                'y INTEGER, ' +
                'start REAL, ' +
                'end REAL, ' +
                'location TEXT, ' +
                'time TEXT, ' +
                'duration TEXT)',
        'fields': ['id', 'x', 'y', 'start', 'end', 'location', 'time', 'duration']
    },

    'ACHIEVEMENT': {
        'def': 'id INTEGER primary key autoincrement',
        'fields': ['id']
    },

    'USERPROFILE': {
        'def': 'id INTEGER primary key autoincrement',
        'fields': ['id']
    }
};

var DB_OBJ = '';

var db_layer = {
    
    initialize: function(){
        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
        db_layer.receivedEvent('deviceready');
        DB_OBJ = openDB('pointless');
        DB_OBJ.transaction(initDB, errorCB);
    },
    
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    }
};

function openDB(name) {
    return window.openDatabase(
        DATABASES[name].name,
        DATABASES[name].version,
        DATABASES[name].display_name,
        DATABASES[name].size
    );
}

/*
* Initializes all the tables in the database
* DEBUG must always be false when creating a release build
*/
function initDB(tx) {
    for (var table_name in DB_TABLES){
        // DEBUG is set in config.js
        if (DEBUG){ tx.executeSql('DROP TABLE IF EXISTS ' + table_name); }
        tx.executeSql('CREATE TABLE IF NOT EXISTS ' + table_name + ' (' + DB_TABLES[table_name].def + ')');
    }
}

/*
* Reads and saves a JSON object, constructing the query dynamically
* Requires a table name. Ignores ID field when saving (auto generated)
*/
function saveToDB(data, table_name, db) {
    
    db.transaction(function (tx) {
        console.log('saving ' + JSON.stringify(data));

        var table_values = '';
        var data_values = '';
        for (var i=0; i < DB_TABLES[table_name].fields.length; i++) {
            var field_name = DB_TABLES[table_name].fields[i];
            if (field_name !== 'id') {
                table_values += field_name;
                data_values += "'" + data[field_name] + "'";

                if (i < DB_TABLES[table_name].fields.length){
                    table_values += ', ';
                    data_values += ', ';
                }
            }
        }
        var sqlInsert = "INSERT INTO " +
                        table_name + " (" + table_values + ") " +
                        "VALUES (" + data_values + ")";

        console.log(sqlInsert);
        tx.executeSql(sqlInsert);
    }, errorCB, successCB);

}