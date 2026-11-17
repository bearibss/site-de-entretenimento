const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.status(200).json({ msg: "API do Resenhas de Álbuns no ar :)" });
});

app.use("/usuarios", require("./routes/usuarios"));
app.use("/albuns", require("./routes/albuns"));
app.use("/reviews", require("./routes/reviews"));

app.use((req, res) => res.status(404).json({ msg: "Rota não encontrada" }));

app.listen(3000, () => {
    console.log("Servidor executando em http://localhost:3000");
});
