import React, { useState, FormEvent, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../service/api/authApi"; // Assume this function exists
import { Mail, Lock, Eye, EyeOff, CheckSquare } from "lucide-react";
import { z } from "zod";
import toast from "react-hot-toast";
import { useAppDispatch } from "../../hooks/hook";
import { setUser } from "../../slice/userSlice";

const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = LoginSchema.safeParse({ email, password });
    if (!result.success) {
      const errorMessages = result.error.errors
        .map((error) => error.message)
        .join("\n");
      return toast.error(errorMessages);
    }

    try {
      const response = await loginUser(email, password);
      console.log('login response',response)
      if (response.success) {
        toast.success("Login successful!");
        dispatch(setUser(response.data));
        localStorage.setItem(
          "userData",
          JSON.stringify(response.data)
        );
        localStorage.setItem("userAuth", "true");
        localStorage.setItem("accessToken", response.accessToken);
        navigate("/");
      } else {
        toast.error(response.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: ChangeEvent<HTMLInputElement>) =>
      setter(e.target.value);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-4xl">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 bg-green-600 p-8 flex items-center justify-center">
            <div className="text-white text-center">
              <CheckSquare className="w-16 h-16 md:w-20 md:h-20 mb-4 mx-auto" />
              <p className="text-xl md:text-2xl font-bold mb-2 md:mb-4">
                Track Mate
              </p>
              <p className="text-sm md:text-base">
                Organize your life, one task at a time
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/2 p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-2 text-gray-800 text-center">
              Welcome Back
            </h2>
            <p className="text-sm text-gray-600 mb-6 text-center">
              Log in to manage your tasks
            </p>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <InputField
                id="email"
                name="email"
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={handleInputChange(setEmail)}
                icon={<Mail className="h-5 w-5 text-gray-400" />}
              />
              <PasswordField
                id="password"
                name="password"
                placeholder="Enter Password"
                value={password}
                onChange={handleInputChange(setPassword)}
                showPassword={showPassword}
                toggleVisibility={() => setShowPassword(!showPassword)}
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-300"
              >
                Log in
              </button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-green-600 hover:text-green-500"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface InputFieldProps {
  id: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  name,
  type,
  placeholder,
  value,
  onChange,
  icon,
}) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      {icon}
    </div>
    <input
      id={id}
      name={name}
      type={type}
      required
      className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

interface PasswordFieldProps {
  id: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  toggleVisibility: () => void;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  id,
  name,
  placeholder,
  value,
  onChange,
  showPassword,
  toggleVisibility,
}) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Lock className="h-5 w-5 text-gray-400" />
    </div>
    <input
      id={id}
      name={name}
      type={showPassword ? "text" : "password"}
      required
      className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
      <button
        type="button"
        onClick={toggleVisibility}
        className="text-gray-400 focus:outline-none"
      >
        {showPassword ? (
          <EyeOff className="h-5 w-5" />
        ) : (
          <Eye className="h-5 w-5" />
        )}
      </button>
    </div>
  </div>
);

export default Login;
