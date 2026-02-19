import React from 'react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4 py-8">
            <div className="w-full max-w-2xl space-y-6">
                <button
                    onClick={() => navigate('/')}
                    className="mb-8 text-orange-500 hover:text-orange-400 font-medium flex items-center gap-2 transition-colors"
                >
                    ← Back to Calculator
                </button>

                <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

                <div className="space-y-4 text-gray-300 leading-relaxed">
                    <p>
                        Last updated: {new Date().toLocaleDateString()}
                    </p>

                    <h2 className="text-xl font-semibold text-white mt-6">1. Introduction</h2>
                    <p>
                        Welcome to our Calculator app. We respect your privacy and are committed to protecting your personal data.
                        This privacy policy will inform you as to how we look after your personal data when you visit our application
                        and tell you about your privacy rights and how the law protects you.
                    </p>

                    <h2 className="text-xl font-semibold text-white mt-6">2. Data Collection</h2>
                    <p>
                        We do not collect, store, or process any personal data. All calculations are performed locally on your device.
                        No data is transmitted to any external servers.
                    </p>

                    <h2 className="text-xl font-semibold text-white mt-6">3. Cookies</h2>
                    <p>
                        We do not use cookies or similar tracking technologies.
                    </p>

                    <h2 className="text-xl font-semibold text-white mt-6">4. Contact Us</h2>
                    <p>
                        If you have any questions about this privacy policy, please contact us.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
