'use client';

import Header from '../../../../component/header.jsx';

const ProfilePage = () => {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' }}>
      <Header />
      <div className="flex items-center justify-center py-8 px-4">
        <div className="max-w-md w-full space-y-6 bg-white p-6 rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--signature)' }}>
              Profile
            </h1>
            <p className="text-sm text-gray-600">
              Your profile page is coming soon!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;


