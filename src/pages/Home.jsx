const Home = () => {
    return (
        <div className="p-6">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Halo, Chef! 👋</h1>
                <p className="text-gray-500">Mau masak apa hari ini?</p>
            </header>

            <div className="aspect-video bg-gray-200 rounded-3xl flex items-center justify-center border-2 border-dashed border-gray-400 mb-6">
                <p className="text-gray-500 font-medium text-center p-4">
                    [ Area Kamera / Scanner AI ] <br />
                    <span className="text-sm font-normal">Klik untuk ambil foto bahan makanan</span>
                </p>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="font-semibold mb-2">Riwayat Terakhir</h2>
                <p className="text-sm text-gray-400 italic">Belum ada riwayat scan.</p>
            </div>
        </div>
    );
};

export default Home;