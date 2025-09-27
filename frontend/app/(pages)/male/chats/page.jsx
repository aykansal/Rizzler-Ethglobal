'use client';

import Header from '../../../../component/header.jsx';

const ChatsPage = () => {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' }}>
      <div className="flex items-center justify-center py-8 px-4">
        <div className="max-w-md w-full space-y-6 bg-white p-6 rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--signature)' }}>
              Chats
            </h1>
            <p className="text-sm text-gray-600">
              Your conversations will appear here!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatsPage;


