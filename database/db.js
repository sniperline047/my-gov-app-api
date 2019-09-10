var mysql  = require('mysql');
var db_config = {
	host: '127.0.0.1',
	user: '',
	password: '',
	database: '',
};

var connection;

function handleConnection() {
	connection = mysql.createConnection(db_config);
	connection.connect((err) => {
		if(err) {
			console.log("Connection to the database failed!");
			setTimeout(handleConnection,2000);
		} else {
			console.log("Connection established!");
		}
	});
	connection.on('error', (err) => {
		if(err.code === "PROTCOL_CONNECTION_LOST") {
			handleConnection();
		} else {
			throw err;
		}
	});
}

handleConnection();

module.exports = connection; 
