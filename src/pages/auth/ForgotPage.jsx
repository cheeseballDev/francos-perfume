import { useState } from "react";

const ForgotPage = () => {
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [otp, setOtp] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleResetPassword = (e) => {
    e.preventDefault();
    alert("Password reset simulation! Sending you back to login...");
    setPassword('');
    setOtp('');
    setConfirmPassword('');
  };



}

export default ForgotPage;