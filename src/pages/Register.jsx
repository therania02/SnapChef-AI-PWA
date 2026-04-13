import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await register(email, password);
            navigate('/home');
        } catch (err) {
            alert("Gagal daftar: " + err.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white">
            <div className="w-full max-w-sm">
                <h1 className="text-3xl font-bold mb-2 text-slate-800">Daftar Akun</h1>
                <p className="text-gray-500 mb-8">Buat akun untuk simpan resep favoritmu.</p>

                <form onSubmit={handleRegister} className="space-y-4">
                    <input
                        type="text" placeholder="Nama Lengkap"
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-chef outline-none focus:ring-2 focus:ring-chef-green"
                    />
                    <input
                        type="email" placeholder="Email" required
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-chef outline-none focus:ring-2 focus:ring-chef-green"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password" placeholder="Password (min. 6 karakter)" required
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-chef outline-none focus:ring-2 focus:ring-chef-green"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="w-full py-4 bg-chef-green text-white rounded-chef font-bold shadow-lg shadow-green-100 mt-4 transition-transform active:scale-95">
                        Buat Akun
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-500">
                    Sudah punya akun? <Link to="/login" className="text-chef-green font-bold">Masuk</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;