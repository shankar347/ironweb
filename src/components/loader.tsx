import { Loader } from "lucide-react";

const LoadingScreen = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-white">
            <Loader className="w-10 h-10 animate-spin text-blue-600" />
            <span className="ml-3 text-lg font-semibold text-gray-700">Loading...</span>
        </div>
    );
};

export default LoadingScreen;
