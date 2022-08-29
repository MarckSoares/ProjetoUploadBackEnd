const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
app.use(bodyParser.json());
const banco = require('./db')
const multer = require('multer');
const csv = require('fast-csv');
const upload = multer({ dest: 'tmp/csv/' });
const fs = require('fs');

app.use(cors({
  origin: '*'
}));



app.get("/stock", (req, res) => {

  var consulta = banco.selectTabelaEstoque;
  consulta().then(resultlist => {
    console.log(resultlist);
    for (const item of resultlist) {
      item['status'] = "teste";

      if (item["volume"] > 140) {
        item['status'] = "ótimo";
      }

      else if (item["volume"] < 100) {
        item['status'] = "Crítico";
      }

      else if (item["volume"] > 100 && item["volume"] < 140) {
        item['status'] = "Bom";
      }


    }
    res.status(200).send(resultlist);
  })
    .catch(e => {
      console.log("erro =" + e);
      res.status(500).send("erro");

    });

});


app.post("/upload", upload.single('file'), (req, res) => {

  console.log("chegoou");

  const fileRows = [];
  try {


    csv.fromPath(req.file.path)
      .on("data", function (data) {
        fileRows.push(data); // push each row
      }).on("end", function () {

        for (const linha of fileRows) {
          if (linha[0] == "Date") {
            continue;
          }
          const datajson =
          {
            "close": linha[4],
            "date": linha[0],
            "high": linha[2],
            "low": linha[3],
            "open": linha[1],
            "volume": linha[5],
          };

          console.log(datajson);
          const inserir = banco.insertTabelaEstoque;
          inserir(datajson);

        }


      });
  } catch (error) {
    res.status(500).send("erro");

  }
  res.status(200).send("sucesso");
});





app.listen(3001, () => {
  console.log(`Servidor rodando na porta 3001`)
});

