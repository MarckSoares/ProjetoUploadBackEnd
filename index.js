const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
app.use(bodyParser.json());
const banco = require('./db')



app.use(cors({
  origin: '*'
}));



app.get("/stock", (req, res) => {

  var consulta = banco.selectTabelaEstoque;
  consulta().then(resultlist => {
    console.log(resultlist);
    for (const item of resultlist) {
      item['status'] = "teste";

      if (item["volume"]>140){
        item['status'] = "ótimo";
      }

      else if (item["volume"]<100){
        item['status'] = "Crítico";
      }

      else if (item["volume"]>100 && item["volume"]<140){
        item['status'] = "Bom";
      }


    }
    res.status(200).send(resultlist);
  })
  .catch(e =>{
    console.log("erro");
    res.status(500).send("erro");

  });

})



app.listen(3001, () => {
  console.log(`Servidor rodando na porta 3001`)
});

