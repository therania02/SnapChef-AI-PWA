const Profile = () => {
    return (
        <div className="p-6 text-center">
            <div className="w-24 h-24 bg-green-200 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">
                👩‍🍳
            </div>
            <h1 className="text-xl font-bold mb-1">Therania (Nia)</h1>
            <p className="text-gray-500 text-sm mb-6">Pencinta Masakan Praktis</p>

            <div className="text-left space-y-3">
                <div className="p-4 bg-gray-50 rounded-2xl flex justify-between items-center">
                    <span className="font-medium text-slate-700">Preferensi Diet</span>
                    <span className="text-green-600 font-bold">Halal</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl flex justify-between items-center">
                    <span className="font-medium text-slate-700">Tipe Akun</span>
                    <span className="text-yellow-600 font-bold">Premium ✨</span>
                </div>
            </div>
        </div>
    );
};

export default Profile;