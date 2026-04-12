import { useNavigate } from 'react-router-dom';

const RecipeDetail = () => {
    const navigate = useNavigate();

    return (
        <div className="p-6 bg-white min-h-screen">
            <button onClick={() => navigate('/home')} className="mb-4 text-green-600 font-medium">
                ← Kembali
            </button>
            <div className="h-48 bg-gray-300 rounded-3xl mb-6"></div>
            <h1 className="text-2xl font-bold mb-2">Nama Resep AI</h1>
            <div className="flex gap-2 mb-6">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">HALAL</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">15 Menit</span>
            </div>
            <h2 className="font-bold mb-2 text-lg">Bahan-bahan:</h2>
            <ul className="list-disc list-inside text-gray-600 mb-6">
                <li>Bahan dari deteksi foto...</li>
            </ul>
            <h2 className="font-bold mb-2 text-lg">Langkah Memasak:</h2>
            <p className="text-gray-600 italic">Instruksi memasak akan muncul di sini.</p>
        </div>
    );
};

export default RecipeDetail;