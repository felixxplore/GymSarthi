 

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import signupImage from "../assets/signupImage.png";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/pages/Header";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [cooldown, setCooldown] = useState(30);
  const navigate = useNavigate();
  const otpRefs = useRef([]);

  // Handle OTP resend cooldown
  useEffect(() => {
    if (resendDisabled) {
      const timer = setInterval(() => {
        setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendDisabled]);

  useEffect(() => {
    if (cooldown === 0) {
      setResendDisabled(false);
      setCooldown(30); // Reset cooldown
    }
  }, [cooldown]);

  const handleSendOTP = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/forgotPassword/forgot-password`,
        { email }
      );
      setGeneratedOtp(res.data.otp); // Save OTP from backend
      setMessage(res.data.message);
      setStep(2);
      setResendDisabled(true); // Disable resend button
      console.log("Generated OTP from Backend:", res.data.otp); // Debugging
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
    setLoading(false);
  };

  const handleResendOTP = async () => {
    setResendDisabled(true); // Disable resend button
    setCooldown(30); // Reset cooldown
    try {
      const res = await axios.post(
         `${import.meta.env.VITE_BASE_URL}/forgotPassword/forgot-password`,
        { email }
      );
      setGeneratedOtp(res.data.otp); // Save new OTP from backend
      setMessage("A new OTP has been sent to your email.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    let newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const verifyOtp = () => {
    const enteredOtp = otp.join("").trim(); // Convert array to string and trim spaces
    console.log("Entered OTP:", enteredOtp); // Debugging
    console.log("Generated OTP:", generatedOtp); // Debugging

    if (enteredOtp === generatedOtp) {
      setMessage("OTP Verified. Please enter a new password.");
      setStep(3);
    } else {
      setMessage("Invalid OTP. Try again.");
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/forgotPassword/reset-password`,
        { email, otp: otp.join(""), newPassword }
      );
      setMessage("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/signin"), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid OTP");
    }
    setLoading(false);
  };

  // Password Validation Function
  const isValidPassword = (password) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen px-4 -mt-2 bg-gradient-to-br from-gray-900 to-black">
        <div className="w-full max-w-3xl overflow-hidden rounded-lg shadow-2xl md:flex">
          <div className="flex flex-col justify-center p-8 bg-gray-800 md:w-1/2">
            {/* Progress Indicator */}
            <div className="flex justify-center mb-6">
              <div className="flex space-x-2">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`w-3 h-3 rounded-full ${
                      step === s ? "bg-blue-500" : "bg-gray-600"
                    }`}
                  />
                ))}
              </div>
            </div>

            {step === 1 && (
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white">
                  Forgot Password?
                </h2>
                <p className="mt-2 text-gray-400">
                  No worries! Enter your email below, and we'll send you a
                  6-digit OTP to reset your password.
                </p>
                <input
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 mt-2 text-white transition duration-300 ease-in-out bg-gray-800 border border-white rounded-lg "
                />
                <Button
                  className="w-full p-3 mt-4 transition-transform transform bg-blue-600 rounded-lg hover:bg-blue-500 hover:scale-105"
                  onClick={handleSendOTP}
                  disabled={loading}
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white">Verify OTP</h2>
                <p className="mt-2 text-gray-400">
                  We've sent a 6-digit OTP to your email. Please enter it below
                  to verify your identity.
                </p>
                <div className="flex justify-center gap-2 mt-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpRefs.current[index] = el)}
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 p-3 text-center text-white transition-all bg-gray-700 border border-white rounded-lg"
                    />
                  ))}
                </div>
                <Button
                  className="w-full p-3 mt-4 transition-transform transform bg-green-600 rounded-lg hover:bg-green-500 hover:scale-105"
                  onClick={verifyOtp}
                >
                  Verify OTP
                </Button>
                <Button
                  className="w-full p-3 mt-2 transition-transform transform bg-gray-600 rounded-lg hover:bg-gray-500 hover:scale-105"
                  onClick={handleResendOTP}
                  disabled={resendDisabled}
                >
                  {resendDisabled ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
                </Button>
              </div>
            )}

            {/* {step === 3 && (
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white">Reset Password</h2>
                <p className="mt-2 text-gray-400">
                  Create a new password for your account. Make sure it's strong and secure.
                </p>
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 mt-2 text-white transition duration-300 ease-in-out bg-gray-800 border border-white rounded-lg "
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 mt-2 text-white transition duration-300 ease-in-out bg-gray-800 border border-white rounded-lg "
                />
                <Button
                  className="w-full p-3 mt-4 transition-transform transform bg-green-600 rounded-lg hover:bg-green-500 hover:scale-105"
                  onClick={handleResetPassword}
                  disabled={loading}
                >
                  {loading ? "Resetting Password..." : "Reset Password"}
                </Button>
              </div>
            )}
            {message && (
              <p
                className={`mt-4 text-center ${
                  message.includes("successful") ? "text-green-500" : "text-red-500"
                }`}
              >
                {message}
              </p>
            )} */}

            {step === 3 && (
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white">
                  Reset Password
                </h2>
                <p className="mt-2 text-gray-400">
                  Create a new password for your account. Make sure it's strong
                  and secure.
                </p>

                {/* New Password Input */}
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 mt-2 text-white bg-gray-800 border border-white rounded-lg"
                />
                {newPassword && !isValidPassword(newPassword) && (
                  <p className="mt-1 text-sm text-red-500">
                    ⚠️ Password must be at least 8 characters long, contain 1
                    uppercase, 1 number, and 1 special character.
                    </p>
                )}

                {/* Confirm Password Input */}
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 mt-2 text-white bg-gray-800 border border-white rounded-lg"
                />
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    ⚠️ Passwords do not match!
                  </p>
                )}

                {/* Reset Password Button */}
                <Button
                  className="w-full p-3 mt-4 transition-transform transform bg-green-600 rounded-lg hover:bg-green-500 hover:scale-105"
                  onClick={handleResetPassword}
                  disabled={
                    loading ||
                    !isValidPassword(newPassword) ||
                    newPassword !== confirmPassword
                  }
                >
                  {loading ? "Resetting Password..." : "Reset Password"}
                </Button>
              </div>
            )}

            {message && (
              <p
                className={`mt-4 text-center ${
                  message.includes("successful")
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {message}
              </p>
            )}
          </div>
          <div className="hidden md:block md:w-1/2">
            <img
              src={signupImage}
              alt="Forgot Password Illustration"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
    </>
  );
}
