var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database('../wol.sqlite');

function WolModel() {
    var isDupliction = isDupliction;

    // public method
    this.addAccount = addAccount;
    this.checkLogin = checkLogin;
    this.getMacAddress = getMacAddress;
    this.addMacAddress = addMacAddress;
    this.deleteMacAddress = deleteMacAddress;

    db.run('CREATE TABLE IF NOT EXISTS account (id INTEGER PRIMARY KEY AUTOINCREMENT, account TEXT, PASSWORD TEXT)');
    db.run('CREATE TABLE IF NOT EXISTS mac (id INTEGER PRIMARY KEY AUTOINCREMENT, account_id INTEGER, mac_address TEXT, name TEXT)');

    function addAccount(account, password, callback) {
        db.parallelize(function() {
            db.run('INSERT INTO account (account, password) VALUES (?, ?)', [account, password], function(err) {
                if (!err) {
                    callback();
                }
            });
        });
    }

    function isDupliction(account, callback) {
        db.parallelize(function() {
            var query = db.prepare('SELECT * FROM account WHERE account = ?', [account]);
            query.get(function(err, row) {
                console.log(err);
                callback(row);
            });
        });
    }

    function checkLogin(account, password, callback) {
        db.parallelize(function() {
            var query = db.prepare('SELECT * FROM account WHERE account = ? AND password = ?', [account, password]);
            query.get(function(err, row) {
                console.log(err);
                callback(row);
            });
        });
    }

    function getMacAddress(account_id, callback) {
        db.parallelize(function() {
            var query = db.prepare('SELECT * FROM mac WHERE account_id = ?', [account_id]);
            query.all(function(err, rows) {
                console.log(err);
                callback(rows);
            });
        });
    }

    function addMacAddress(account_id, mac_address, name, callback) {
        db.parallelize(function() {
            db.run('INSERT INTO mac (account_id, mac_address, name) VALUES (?, ?, ?)', [account_id, mac_address, name], function(err) {
                console.log(err);
                if (!err) {
                    callback();
                }
            });
        });
    }

    function deleteMacAddress(account_id, mac_address, callback) {
        db.parallelize(function() {
            db.run('DELETE FROM mac WHERE account_id = ? AND mac_address = ?', [account_id, mac_address], function(err) {
                console.log(err);
                if (!err) {
                    callback();
                }
            });
        });
    }
};

module.exports = new WolModel();
