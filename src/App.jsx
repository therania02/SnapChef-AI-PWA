import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Profile from './pages/Profile';
import RecipeDetail from './pages/RecipeDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-slate-900">
        <Routes>
          {/* Halaman yang pertama kali muncul */}
          <Route path="/" element={<Onboarding />} />

          {/* Alur Utama Aplikasi */}
          <Route path="/home" element={<Home />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;