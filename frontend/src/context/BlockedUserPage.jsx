import { ArrowLeft } from "lucide-react";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

const BlockedUserPage = () => {
  const navigate = useNavigate();
  const handleReturnHome = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Custom Loader */}
          <Loader />

          <h1 className="text-2xl font-bold text-gray-900">
            ooh no!😬 looks like your account is on a vacation
          </h1>

          <p className="text-gray-600 leading-relaxed">
            Your account has an issue preventing you from logging in. Please
            contact our support team to resolve this issue.
          </p>

          <button
            onClick={handleReturnHome}
            className="bg-rose-500 hover:bg-rose-600 text-white py-3 px-6 rounded-lg transition-colors flex items-center justify-center font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockedUserPage;
