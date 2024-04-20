const mysql = require('mysql2')

// Получение данных из файла окружения
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

// Создание подключения к базе данных
const accountDB = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  connectionLimit: 6
});


accountDB.connect(err =>{
    if(err){
        console.error("Ошибка подключения к бд", err)
    } else {
        console.log("Connect OK")
    }
})

module.exports = accountDB