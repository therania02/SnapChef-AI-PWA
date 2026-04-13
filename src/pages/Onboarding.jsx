import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-white font-sans">
            {/* Kamu bisa tambah logo/gambar ilustrasi koki di sini nanti */}
            <div className="mb-10 text-6xl">🍳</div>

            <h1 className="text-4xl font-bold text-slate-800 mb-4">
                SnapChef <span className="text-chef-green">AI</span>
            </h1>

            <p className="text-gray-500 mb-12 max-w-xs leading-relaxed">
                Ubah bahan makanan di kulkasmu menjadi resep lezat hanya dengan satu foto.
            </p>

            <div className="w-full max-w-xs space-y-4">
                <button
                    onClick={() => navigate('/login')} // Ubah ke /login
                    className="w-full py-4 bg-chef-green text-white rounded-chef font-bold shadow-lg shadow-green-100 transition-transform active:scale-95"
                >
                    Mulai Sekarang
                </button>

                <p className="text-sm text-gray-400">
                    Sudah punya akun? <span onClick={() => navigate('/login')} className="text-chef-green font-bold cursor-pointer">Masuk</span>
                </p>
            </div>
        </div>
    );
};

export default Onboarding;