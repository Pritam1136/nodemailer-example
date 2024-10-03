import { useState } from "react";
import axios from "axios";

function App() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [message, setMessage] = useState("");

  const sendOtp = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/send-otp", {
        email,
      });
      setIsOtpSent(true);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(
        error.response ? error.response.data.message : "Error sending OTP"
      );
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/verify-otp", {
        email,
        otp,
      });
      setMessage("OTP verified successfully. Token: " + response.data.token);
    } catch (error) {
      setMessage(error.response ? error.response.data.message : "Invalid OTP");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>OTP Verification</h1>

      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={sendOtp}>Send OTP</button>
      </div>

      {isOtpSent && (
        <div>
          <label htmlFor="otp">OTP</label>
          <input
            type="text"
            id="otp"
            name="otp"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOtp}>Verify OTP</button>
        </div>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
