const express = require("express");
const cors = require("cors");
const { sendOtp, verifyOtp } = require("./Handler");

const port = 5000;
const app = express();
app.use(express.json());
app.use(cors());

app.post("/api/send-otp", sendOtp);
app.post("/api/verify-otp", verifyOtp);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
