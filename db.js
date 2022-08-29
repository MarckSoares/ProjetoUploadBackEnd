async function connect(){
    if(global.connection && global.connection.state !== 'disconnected')
        return global.connection;
 
    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection("mysql://root:admin@localhost:3306/estock_projeto");
    console.log("Conectou no MySQL!");
    global.connection = connection;
    return connection;
}

async function selectTabelaEstoque(){
    const conn = await connect();
    const [rows] = await conn.query('SELECT * FROM tabela_estoque;');
    return rows;
};


async function insertTabelaEstoque(dado){
    const conn = await connect();
    const sql = 'insert into estock_projeto.tabela_estoque (close,date,high,low,open,volume) values (?,?,?,?,?,?);';
    const values = [dado.close, dado.date, dado.high, dado.low, dado.open, dado.volume];
    return await conn.query(sql, values);
}





module.exports = {selectTabelaEstoque,insertTabelaEstoque}