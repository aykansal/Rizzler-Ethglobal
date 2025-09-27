'use client';

import { useState } from 'react';
import Header from '../../../../component/header.jsx';
import { SearchIcon, MoreVerticalIcon, SendIcon, HeartIcon, SmileIcon, ImageIcon } from 'lucide-react';

const ChatsPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock chat data
  const chats = [
    {
      id: 1,
      name: 'Sarah',
      lastMessage: 'Hey! How was your day? 🌹',
      timestamp: '2m ago',
      unread: 2,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      isOnline: true,
      messages: [
        { id: 1, text: 'Hey there! 👋', sender: 'other', timestamp: '10:30 AM' },
        { id: 2, text: 'Hi! How are you doing?', sender: 'me', timestamp: '10:31 AM' },
        { id: 3, text: 'Great! Just finished hiking 🥾', sender: 'other', timestamp: '10:32 AM' },
        { id: 4, text: 'That sounds amazing! Where did you go?', sender: 'me', timestamp: '10:33 AM' },
        { id: 5, text: 'Hey! How was your day? 🌹', sender: 'other', timestamp: '2m ago' }
      ]
    },
    {
      id: 2,
      name: 'Emma',
      lastMessage: 'Thanks for the rose! 💕',
      timestamp: '1h ago',
      unread: 0,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      isOnline: false,
      messages: [
        { id: 1, text: 'Thanks for the rose! 💕', sender: 'other', timestamp: '1h ago' },
        { id: 2, text: 'You\'re welcome! Your photos are beautiful', sender: 'me', timestamp: '1h ago' }
      ]
    },
    {
      id: 3,
      name: 'Alex',
      lastMessage: 'Coffee sometime this week?',
      timestamp: '3h ago',
      unread: 1,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      isOnline: true,
      messages: [
        { id: 1, text: 'Coffee sometime this week?', sender: 'other', timestamp: '3h ago' },
        { id: 2, text: 'I\'d love that! When works for you?', sender: 'me', timestamp: '3h ago' }
      ]
    }
  ];

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sendMessage = () => {
    if (message.trim() && selectedChat) {
      // Here you would typically send the message to a backend
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          {selectedChat ? (
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setSelectedChat(null)}
                className="md:hidden p-1 text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex items-center space-x-2">
                <img
                  src={selectedChat.avatar}
                  alt={selectedChat.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">{selectedChat.name}</h1>
                  <p className="text-xs text-gray-500">
                    {selectedChat.isOnline ? 'Online' : 'Last seen recently'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
          )}
          <div className="flex items-center space-x-2">
            {!selectedChat && (
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <SearchIcon className="w-5 h-5" />
              </button>
            )}
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <MoreVerticalIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Chat List Sidebar */}
        <div className={`${selectedChat ? 'hidden md:flex' : 'flex'} w-full md:w-80 bg-white border-r border-gray-200 flex-col`}>
          {/* Search */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`p-3 md:p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedChat?.id === chat.id ? 'bg-pink-50 border-r-2 border-r-pink-500' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={chat.avatar}
                      alt={chat.name}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                    />
                    {chat.isOnline && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{chat.name}</h3>
                      <span className="text-xs text-gray-500 ml-2">{chat.timestamp}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs md:text-sm text-gray-600 truncate flex-1">{chat.lastMessage}</p>
                      {chat.unread > 0 && (
                        <span className="bg-pink-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center ml-2">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`${selectedChat ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
          {selectedChat ? (
            <>
              {/* Desktop Chat Header - Hidden on mobile */}
              <div className="hidden md:block bg-white border-b border-gray-200 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={selectedChat.avatar}
                        alt={selectedChat.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      {selectedChat.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">{selectedChat.name}</h2>
                      <p className="text-sm text-gray-500">
                        {selectedChat.isOnline ? 'Online' : 'Last seen recently'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-500 hover:text-gray-700">
                      <HeartIcon className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-gray-700">
                      <MoreVerticalIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
                {selectedChat.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] md:max-w-xs lg:max-w-md px-3 py-2 md:px-4 md:py-2 rounded-2xl ${
                        msg.sender === 'me'
                          ? 'bg-pink-500 text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      <p className="text-sm break-words">{msg.text}</p>
                      <p className={`text-xs mt-1 ${
                        msg.sender === 'me' ? 'text-pink-100' : 'text-gray-500'
                      }`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="bg-white border-t border-gray-200 p-3 md:p-4">
                <div className="flex items-end space-x-2 md:space-x-3">
                  <button className="p-1.5 md:p-2 text-gray-500 hover:text-gray-700 flex-shrink-0">
                    <ImageIcon className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  <div className="flex-1 relative">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      rows={1}
                      className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-200 rounded-full focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-sm md:text-base"
                    />
                  </div>
                  <button className="p-1.5 md:p-2 text-gray-500 hover:text-gray-700 flex-shrink-0">
                    <SmileIcon className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  <button
                    onClick={sendMessage}
                    disabled={!message.trim()}
                    className="p-1.5 md:p-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                  >
                    <SendIcon className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* No Chat Selected */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HeartIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-500">Choose a chat to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatsPage;


