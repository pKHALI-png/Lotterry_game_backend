const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let balance = 10000; // fake starting balance

const multipliers = {
  1: 10,
  2: 50,
  3: 100,
  4: 500,
  5: 1000,
  6: 5000,
  7: 10000,
  8: 50000,
  9: 100000,
  10: 500000
};

function generateNumbers() {
  const set = new Set();
  while (set.size < 10) {
    set.add(Math.floor(Math.random() * 100) + 1);
  }
  return [...set];
}

app.post("/play", (req, res) => {
  const { bet, numbers } = req.body;

  if (bet <= 0 || bet > balance) {
    return res.status(400).json({ error: "Invalid bet" });
  }

  if (!numbers || numbers.length !== 10) {
    return res.status(400).json({ error: "Choose exactly 10 numbers" });
  }

  balance -= bet;

  const generated = generateNumbers();
  let matches = numbers.filter(n => generated.includes(n)).length;

  let multiplier = multipliers[matches] || 0;
  let payout = bet * multiplier;

  balance += payout;

  res.json({
    generated,
    matches,
    multiplier,
    payout,
    balance
  });
});

app.get("/balance", (req, res) => {
  res.json({ balance });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
