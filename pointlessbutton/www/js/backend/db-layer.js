// DB-Layer
function initDB(tx) {
    if (DEBUG){
        tx.executeSql('DROP TABLE IF EXISTS POINTLESS');
    }
    tx.executeSql('CREATE TABLE IF NOT EXISTS POINTLESS (id integer primary key autoincrement, x, y, start, location, end, time, duration)');
}