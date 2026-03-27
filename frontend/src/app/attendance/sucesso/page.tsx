import Link from 'next/link';

export default function AttendanceSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-3">Presença registrada!</h1>
        <p className="text-gray-700 mb-6">
          Obrigado por confirmar sua presença na reunião. Seu registro foi efetuado com sucesso.
        </p>
        <Link href="/" className="inline-block px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
          Voltar para o início
        </Link>
      </div>
    </div>
  );
}
