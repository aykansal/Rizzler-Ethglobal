'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const BottomNavbar = () => {
  const [activeTab, setActiveTab] = useState('explore');
  const router = useRouter();
  const pathname = usePathname();
  const navItems = [
    {
      id: 'profile',
      label: 'Profile',
      href: '/profile'
    },
    {
      id: 'explore',
      label: 'Explore',
      href: '/explore'
    },
    {
      id: 'chats',
      label: 'Chats',
      href: '/chats'
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl rounded-t-xl border-t border-gray-200 h-16 z-50" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' }}>
      <div className="max-w-sm mx-auto h-full px-4">
        <div className="flex items-center justify-around h-full">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab(item.id);
                let href = item.href;
                if (pathname.includes('male')) {
                  href = `/male${item.href}`;
                } else if (pathname.includes('female')) {
                  href = `/female${item.href}`;
                }
                router.push(href);
              }}
              className={`flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ease-out ${
                activeTab === item.id
                  ? 'bg-gray-900 text-white shadow-lg'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
            >
              <svg className={`w-5 h-5 transition-all duration-300 ${
                activeTab === item.id ? 'scale-110' : 'scale-100'
              }`} fill="currentColor" viewBox="0 0 24 24">
                {item.id === 'profile' && (
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                )}
                {item.id === 'explore' && (
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                )}
                {item.id === 'chats' && (
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                )}
              </svg>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavbar;


