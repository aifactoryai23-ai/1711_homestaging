import React from "react";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-white text-center px-6">
      <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
      <h1 className="text-3xl font-bold text-green-600 mb-2">
        Оплата прошла успешно!
      </h1>
      <p className="text-gray-700 mb-6 max-w-md">
        Спасибо за оплату 💳. Ваши кредиты будут автоматически зачислены в течение нескольких секунд.
      </p>
      <Link
        to="/"
        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition"
      >
        Вернуться на главную
      </Link>
    </div>
  );
}
