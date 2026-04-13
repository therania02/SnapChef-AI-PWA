import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/home');
        } catch (err) {
            alert("Email atau password salah!");
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
            navigate('/home');
        } catch (err) {
            alert("Gagal login dengan Google");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white">
            <div className="w-full max-w-sm">
                <h1 className="text-3xl font-bold mb-2 text-slate-800 text-center">Masuk</h1>
                <p className="text-gray-500 mb-8 text-center text-sm">Masak lezat dimulai dari sini</p>

                {/* Form Login Biasa */}
                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="email" placeholder="Email" required
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-chef outline-none focus:ring-2 focus:ring-chef-green"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password" placeholder="Password" required
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-chef outline-none focus:ring-2 focus:ring-chef-green"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="w-full py-4 bg-chef-green text-white rounded-chef font-bold shadow-lg shadow-green-100 transition-transform active:scale-95">
                        Masuk
                    </button>
                </form>

                {/* Divider "Atau" */}
                <div className="relative flex items-center justify-center my-8">
                    <div className="border-t w-full border-gray-200"></div>
                    <span className="bg-white px-4 text-xs text-gray-400 absolute">Atau masuk dengan</span>
                </div>

                {/* Tombol Google (SESUAI FIGMA) */}
                <button
                    onClick={handleGoogleLogin}
                    className="w-full py-4 border border-gray-200 rounded-chef flex items-center justify-center gap-3 font-semibold text-slate-700 hover:bg-gray-50 transition active:scale-95"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5" />
                    Google
                </button>

                <p className="mt-8 text-center text-sm text-gray-500">
                    Belum punya akun? <Link to="/register" className="text-chef-green font-bold">Daftar</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;