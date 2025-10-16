import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "./axios";
import API_CONSTANTS from "./apiConstants";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { setUser } from "./../reudux/slices/authSlice";

export const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const code = searchParams.get("code");
      const provider = searchParams.get("provider");
      const error = searchParams.get("error");

      if (error) {
        const errorMessages = {
          oauth_denied: "OAuth access was denied",
          no_code: "No authorization code received",
          auth_failed: "Authentication failed. Please try again.",
        };
        const message =
          errorMessages[error as keyof typeof errorMessages] ||
          "Authentication failed";
        toast.error(message);
        navigate("/auth", { replace: true });
        setIsProcessing(false);
        return;
      }

      if (!code || !provider) {
        toast.error("Invalid OAuth callback - missing code or provider");
        navigate("/auth", { replace: true });
        setIsProcessing(false);
        return;
      }

      try {
        const endpoint =
          provider === "google"
            ? API_CONSTANTS.GOOGLE_TOKEN
            : API_CONSTANTS.LINKEDIN_TOKEN;
        const response = await axiosInstance.post(endpoint, { code });
        if (response.status === 200) {
          const data = response.data;
          dispatch(setUser(data.user));
          navigate("/events", { replace: true });
        }
      } catch (error: any) {
        console.error("OAuth callback error:", error);
        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Authentication failed. Please try again.";
        toast.error(errorMessage);
        navigate("/auth", { replace: true });
      } finally {
        setIsProcessing(false);
      }
    };

    handleOAuthCallback();
  }, [dispatch, navigate, searchParams]);

  return (
    <div className="flex h-screen items-center justify-center">
      {isProcessing ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-700">
            Processing authentication...
          </p>
        </div>
      ) : (
        <p className="text-sm text-gray-600">Redirecting...</p>
      )}
    </div>
  );
};
