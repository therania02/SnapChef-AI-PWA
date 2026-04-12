import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-green-50">
            <h1 className="text-4xl font-bold text-green-600 mb-2">SnapChef AI 🍳</h1>
            <p className="text-gray-600 mb-8 max-w-xs">Solusi cerdas olah bahan makanan sisa jadi hidangan istimewa.</p>
            <button
                onClick={() => navigate('/home')}
                className="w-full max-w-xs py-3 bg-green-500 text-white rounded-2xl font-bold shadow-lg hover:bg-green-600 transition"
            >
                Mulai Sekarang
            </button>
        </div>
    );
};

export default Onboarding;