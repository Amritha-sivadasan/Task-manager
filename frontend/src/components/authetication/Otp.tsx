import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { CheckCircle, RefreshCw } from "lucide-react";
import { registerUser, resendOtp, verifyOtp } from "../../service/api/authApi";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/hook";
import { setUser } from "../../slice/userSlice";
import toast from "react-hot-toast";

interface OTPInputProps {
  value: string;
  index: number;
  onChange: (value: string, index: number) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>, index: number) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({
  value,
  index,
  onChange,
  onKeyDown,
}) => (
  <input
    className="w-16 h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
    type="text"
    maxLength={1}
    value={value}
    onChange={(e: ChangeEvent<HTMLInputElement>) =>
      onChange(e.target.value, index)
    }
    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => onKeyDown(e, index)}
    name={`otp-${index}`}
  />
);

const OTPPage: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [timer, setTimer] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const email = sessionStorage.getItem("email");

    if (!email) {
        navigate("/login");
    }
  }, []);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setCanResend(true);
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const handleChange = (value: string, index: number): void => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 3) {
      const nextInput = document.querySelector<HTMLInputElement>(
        `input[name=otp-${index + 1}]`
      );
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    index: number
  ): void => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      const prevInput = document.querySelector<HTMLInputElement>(
        `input[name=otp-${index - 1}]`
      );
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleResendOTP = (): void => {
    const email = sessionStorage.getItem("email");
    if (email) {
      resendOtp(email);
      setTimer(30);
      setCanResend(false);
    }
  };

  const handleverifyOtp = async () => {
    try {
      const email = sessionStorage.getItem("email");
      const response = await verifyOtp(email!, otp.join(""));

      if (response.success) {
        const name = sessionStorage.getItem("name");
        const password = sessionStorage.getItem("password");
        const registerResponse = await registerUser(name!, email!, password!);
        if (registerResponse.success) {
          dispatch(setUser(registerResponse.data));
          localStorage.setItem(
            "userData",
            JSON.stringify(registerResponse.data._doc)
          );
          localStorage.setItem("userAuth", "true");
          localStorage.setItem("accessToken", registerResponse.accessToken);
          sessionStorage.clear();

          navigate("/");
        } else {
          navigate("/singup");
        }
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-8 bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Verify Your Account
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          We've sent a 4-digit OTP to your registered mobile number
        </p>
        <div className="flex justify-center gap-4 mb-8">
          {otp.map((digit, index) => (
            <OTPInput
              key={index}
              value={digit}
              index={index}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          ))}
        </div>
        <button
          className="w-full py-3 px-4 bg-gradient-to-r bg-green-600 text-white rounded-lg text-lg font-semibold hover:from-green-600 hover:to-green-700 transition duration-300 flex items-center justify-center"
          onClick={handleverifyOtp}
        >
          <CheckCircle className="mr-2" size={20} />
          Verify OTP
        </button>
        <div className="mt-6 text-center">
          {canResend ? (
            <button
              className="text-green-600 hover:text-green-800 transition duration-300 flex items-center justify-center mx-auto"
              onClick={handleResendOTP}
            >
              <RefreshCw className="mr-2 animate-spin" size={18} />
              Resend OTP
            </button>
          ) : (
            <p className="text-gray-600">
              Resend OTP in{" "}
              <span className="font-semibold text-green-600">{timer}</span>{" "}
              seconds
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OTPPage;
