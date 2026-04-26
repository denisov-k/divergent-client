import { type ChangeEvent, useEffect, useState } from "react";
import { ReactSVG } from "react-svg";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z, ZodError } from "zod";

import LogoIcon from "@/assets/images/logo-icon.svg";
import Logo from "@/assets/images/logo.svg";
import { useAppStore } from "@/stores/useAppStore";
import "./index.css";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function SignIn() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading, loginWithCredentials } = useAppStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    submit?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirect = searchParams.get("redirect");

  useEffect(() => {
    if (loading) return;
    if (user) {
      if (redirect) window.location.replace(redirect);
      else navigate("/");
    }
  }, [user, loading, navigate, redirect]);

  const handleSubmit = async (data: typeof formData) => {
    try {
      setIsSubmitting(true);
      setErrors({});

      const validatedData = signInSchema.parse(data);
      await loginWithCredentials(validatedData.email, validatedData.password);
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            formattedErrors[String(err.path[0])] = err.message;
          }
        });
        setErrors(formattedErrors);
      } else {
        setErrors({ submit: "Failed to sign in. Please check your credentials." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const isBusy = isSubmitting || loading;

  return (
    <div id="sign-in">
      <div className="logo">
        <ReactSVG src={Logo} className="title" />
        <ReactSVG src={LogoIcon} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(formData);
        }}
      >
        <span>Login</span>

        <div>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        <div>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
            className={errors.password ? "border-red-500" : ""}
          />
          {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
        </div>

        {errors.submit && (
          <p className="text-sm text-red-500 text-center">{errors.submit}</p>
        )}

        <button type="submit" disabled={isBusy}>
          {isSubmitting ? "Signing in..." : "Login"}
        </button>

        <div className="form-footer">
          <a href="/signup" className="link">
            Registration
          </a>
          <a href="/reset" className="link">
            Reset password
          </a>
        </div>
      </form>
    </div>
  );
}
