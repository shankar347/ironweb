import { motion } from "framer-motion";
import { Sparkles, Shirt } from "lucide-react";

export default function OfferCard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative overflow-hidden mt-4 p-4 
            rounded-lg mb-5 border border-blue-200 shadow-md 
                       bg-gradient-to-r from-blue-50 
                       via-purple-50 to-pink-50
                        cursor-pointer"
        >
            {/* Glow Animation */}
            <motion.div
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-r from-blue-200/30 to-purple-200/30 blur-2xl"
            />

            <div className="relative z-10 flex items-center space-x-4">

                {/* Attractive Icon Box */}
                <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="p-3 rounded-xl bg-white shadow-md border border-gray-200"
                >
                    <Shirt size={32} className="text-blue-500" />
                </motion.div>

                {/* Text Content */}
                <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-700 flex items-center gap-1">
                        <Sparkles size={18} className="text-purple-500" />
                        Special Offer!
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        Select more than <strong className="text-blue-600 font-bold mr-5">15 clothes</strong>  
                       <span className="ml-2">with </span>  <strong className="text-green-600">Normal Speed</strong> to get  
                        <span className="font-extrabold text-purple-600"> FREE Delivery 🚚✨</span>
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
