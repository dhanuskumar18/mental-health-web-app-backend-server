const express = require('express');
const app = express();
const mongoose = require('mongoose');
const routes = require('./routes/index');
const cors=require("cors")
const path=require("path")
const cron = require("node-cron");
const CheckIn = require('./models/CheckIn');
const dotenv=require("dotenv")
dotenv.config({path:path.join(__dirname,"config.env")})
// Schedule a job to run every hour
app.use(cors())
mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log(" DB connection successfull");
})
.catch((error) => {
  console.log(error);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

cron.schedule("0 * * * *", async () => {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  await CheckIn.deleteMany({ createdAt: { $lt: cutoff } });
  console.log("Deleted check-ins older than 24 hours.");
});
app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
