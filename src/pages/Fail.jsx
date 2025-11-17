import React from "react";
import { XCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function FailPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-red-50 to-white text-center px-6">
      <XCircle className="text-red-500 w-16 h-16 mb-4" />
      <h1 className="text-3xl font-bold text-red-600 mb-2">
        Ошибка при оплате
      </h1>
      <p className="text-gray-700 mb-6 max-w-md">
        К сожалению, платёж не был завершён. Попробуйте снова или свяжитесь с поддержкой.
      </p>
      <Link
        to="/pricing"
        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl transition"
      >
        Вернуться к тарифам
      </Link>
    </div>
  );
}
