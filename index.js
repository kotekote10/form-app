const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

const formData = [];

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

app.get("/api/data", (request, response) => {
  console.log(formData);
  response.json(formData);
});

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build/index.html"), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

app.post("/api/data", (request, response) => {
  const data = request.body;
  const loan = (Number(data.amount) * 125) / 100;
  const monthlyPay = loan / data.months;
  const additionalIncome = data.additional
    .map((x) => Number(x.income))
    .reduce((partialSum, a) => partialSum + a, 0);
  const wholeIncome = additionalIncome + Number(data.salary);
  const abilityToPay = (wholeIncome * 40) / 100;
  const toSend = {
    monthlyPay: monthlyPay,
    loan: loan,
    percentage: 25,
    excess: (loan * 20) / 100,
    paydate: data.paydate,
  };
  if (!data) {
    return response.status(400).json({
      error: "content missing",
    });
  } else {
    if (monthlyPay > abilityToPay) {
      formData.unshift("rejected");
    } else {
      formData.unshift(toSend);
    }
    console.log(data);
    response.json(formData);
  }
});
console.log(formData);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
