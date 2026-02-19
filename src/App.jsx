import { HashRouter, Routes, Route } from 'react-router-dom';
import Calculator from './components/Calculator';
import PrivacyPolicy from './components/PrivacyPolicy';

function App() {
    return (
        <HashRouter>
            <div className="flex items-center justify-center min-h-screen bg-black text-white font-sans sm:bg-[#1c1c1e] md:bg-gradient-to-br md:from-gray-900 md:to-black">
                <Routes>
                    <Route path="/" element={<Calculator />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                </Routes>
            </div>
        </HashRouter>
    );
}

export default App;
