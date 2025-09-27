'use client';

import { useState, useRef } from 'react';
import Header from '../../../../component/header.jsx';
import { SettingsIcon } from 'lucide-react';

const ExplorePage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragCurrent, setDragCurrent] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isRoseDragging, setIsRoseDragging] = useState(false);
  const [roseDragStart, setRoseDragStart] = useState({ x: 0, y: 0 });
  const [roseDragCurrent, setRoseDragCurrent] = useState({ x: 0, y: 0 });
  const [likedProfiles, setLikedProfiles] = useState([]);
  const [sentRoses, setSentRoses] = useState([]);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const cardRef = useRef(null);

  // Mock profile data
  const profiles = [
    {
      id: 1,
      name: 'Sarah',
      age: 24,
      bio: 'Love hiking and coffee ☕',
      photos: [
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop&crop=face'
      ],
      interests: ['Travel', 'Photography', 'Fitness'],
      prompts: [
        { question: 'My ideal first date', answer: 'A sunset hike followed by coffee ☕' },
        { question: 'I\'m weirdly attracted to', answer: 'People who can make me laugh until I cry' },
        { question: 'The way to my heart', answer: 'Surprise me with my favorite book' }
      ],
      bio: 'Love hiking and coffee ☕'
    },
    {
      id: 2,
      name: 'Alex',
      age: 26,
      bio: 'Musician and dog lover 🎵🐕',
      photos: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face'
      ],
      interests: ['Music', 'Art', 'Gaming'],
      prompts: [
        { question: 'My most irrational fear', answer: 'That my dog will learn to talk and judge me' },
        { question: 'I\'m a great +1 because', answer: 'I can play any song on guitar' },
        { question: 'The way to my heart', answer: 'Share your favorite playlist with me' }
      ],
      bio: 'Musician and dog lover 🎵🐕'
    },
    {
      id: 3,
      name: 'Emma',
      age: 23,
      bio: 'Foodie and adventure seeker 🍕',
      photos: [
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7b?w=400&h=600&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=600&fit=crop&crop=face'
      ],
      interests: ['Food', 'Travel', 'Movies'],
      prompts: [
        { question: 'My most irrational fear', answer: 'Running out of good food options' },
        { question: 'I\'m a great +1 because', answer: 'I know all the best restaurants in town' },
        { question: 'The way to my heart', answer: 'Take me to a hidden gem restaurant' }
      ],
      bio: 'Foodie and adventure seeker 🍕'
    },
    {
      id: 4,
      name: 'James',
      age: 28,
      bio: 'Tech enthusiast and fitness junkie 💻',
      photos: [
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop&crop=face'
      ],
      interests: ['Technology', 'Fitness', 'Reading'],
      prompts: [
        { question: 'My most irrational fear', answer: 'My code will become sentient and judge me' },
        { question: 'I\'m a great +1 because', answer: 'I can fix any tech problem' },
        { question: 'The way to my heart', answer: 'Challenge me to a coding competition' }
      ],
      bio: 'Tech enthusiast and fitness junkie 💻'
    }
  ];

  const handleSwipe = (direction) => {
    if (isAnimating || currentIndex >= profiles.length) return;
    
    setIsAnimating(true);
    
    if (direction === 'like') {
      console.log('Liked:', profiles[currentIndex].name);
      setLikedProfiles(prev => [...prev, profiles[currentIndex].id]);
    } else {
      console.log('Skipped:', profiles[currentIndex].name);
    }
    
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setIsAnimating(false);
    }, 300);
  };

  const handleRoseSend = () => {
    if (isAnimating) return;
    
    const currentProfile = profiles[currentIndex];
    console.log('🌹 Rose sent to:', currentProfile.name);
    setSentRoses(prev => [...prev, currentProfile.id]);
    
    // Auto-like when sending a rose
    if (!likedProfiles.includes(currentProfile.id)) {
      setLikedProfiles(prev => [...prev, currentProfile.id]);
    }
    
    // Show heart animation
    setShowHeartAnimation(true);
    
    // Hide animation after 2 seconds and move to next profile
    setTimeout(() => {
      setShowHeartAnimation(false);
      setCurrentIndex(prev => prev + 1);
    }, 1000);
  };

  const goToPreviousProfile = () => {
    if (isAnimating || currentIndex <= 0) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(prev => prev - 1);
      setIsAnimating(false);
    }, 300);
  };

  const goToNextProfile = () => {
    if (isAnimating || currentIndex >= profiles.length - 1) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setIsAnimating(false);
    }, 300);
  };

  const handleCardSwipe = (direction) => {
    if (isAnimating) return;
    
    const card = cardRef.current;
    if (!card) return;
    
    const rotation = direction === 'like' ? 15 : -15;
    const translateX = direction === 'like' ? 300 : -300;
    
    card.style.transform = `translateX(${translateX}px) rotate(${rotation}deg)`;
    card.style.opacity = '0';
    
    setTimeout(() => {
      handleSwipe(direction);
      card.style.transform = '';
      card.style.opacity = '1';
    }, 300);
  };

  // Touch/Mouse handlers for swiping
  const handleStart = (clientX, clientY) => {
    if (isAnimating) return;
    setDragStart({ x: clientX, y: clientY });
    setDragCurrent({ x: clientX, y: clientY });
    setIsDragging(true);
  };

  const handleMove = (clientX, clientY) => {
    if (!isDragging || isAnimating) return;
    setDragCurrent({ x: clientX, y: clientY });
    
    const card = cardRef.current;
    if (!card) return;
    
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;
    const rotation = deltaX * 0.1;
    
    card.style.transform = `translateX(${deltaX}px) translateY(${deltaY}px) rotate(${rotation}deg)`;
  };

  const handleEnd = () => {
    if (!isDragging || isAnimating) return;
    
    const deltaX = dragCurrent.x - dragStart.x;
    const deltaY = dragCurrent.y - dragStart.y;
    const threshold = 100;
    
    if (Math.abs(deltaY) > threshold) {
      // Vertical swipe on card
      if (deltaY < -threshold) {
        handleCardSwipe('like'); // Swipe up to like
      } else if (deltaY > threshold) {
        handleCardSwipe('skip'); // Swipe down to skip
      } else {
        // Reset position
        const card = cardRef.current;
        if (card) {
          card.style.transform = '';
        }
      }
    } else if (Math.abs(deltaX) > threshold) {
      // Horizontal swipe on card
      if (deltaX > threshold) {
        handleCardSwipe('like'); // Swipe right to like
      } else {
        handleCardSwipe('skip'); // Swipe left to skip
      }
    } else {
      // Reset position
      const card = cardRef.current;
      if (card) {
        card.style.transform = '';
      }
    }
    
    setIsDragging(false);
  };

  // Rose button specific handlers
  const handleRoseStart = (clientX, clientY) => {
    if (isAnimating) return;
    setRoseDragStart({ x: clientX, y: clientY });
    setRoseDragCurrent({ x: clientX, y: clientY });
    setIsRoseDragging(true);
  };

  const handleRoseMove = (clientX, clientY) => {
    if (!isRoseDragging || isAnimating) return;
    setRoseDragCurrent({ x: clientX, y: clientY });
  };

  const handleRoseEnd = () => {
    if (!isRoseDragging || isAnimating) return;
    
    const deltaY = roseDragCurrent.y - roseDragStart.y;
    const roseThreshold = 150; // Half screen threshold for rose
    
    if (deltaY < -roseThreshold) {
      // Rose sent! Trigger rose send action
      handleRoseSend();
    }
    
    setIsRoseDragging(false);
  };

  // Mouse events
  const handleMouseDown = (e) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e) => {
    e.preventDefault();
    handleMove(e.clientX, e.clientY);
  };

  const handleMouseUp = (e) => {
    e.preventDefault();
    handleEnd();
  };

  // Touch events
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = (e) => {
    handleEnd();
  };

  // Rose button mouse events
  const handleRoseMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleRoseStart(e.clientX, e.clientY);
  };

  const handleRoseMouseMove = (e) => {
    e.preventDefault();
    handleRoseMove(e.clientX, e.clientY);
  };

  const handleRoseMouseUp = (e) => {
    e.preventDefault();
    handleRoseEnd();
  };

  // Rose button touch events
  const handleRoseTouchStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const touch = e.touches[0];
    handleRoseStart(touch.clientX, touch.clientY);
  };

  const handleRoseTouchMove = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleRoseMove(touch.clientX, touch.clientY);
  };

  const handleRoseTouchEnd = (e) => {
    e.preventDefault();
    handleRoseEnd();
  };

  const currentProfile = profiles[currentIndex];

  if (currentIndex >= profiles.length) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' }}>
        <Header />
        <div className="flex items-center justify-center py-8 px-4">
          <div className="max-w-md w-full space-y-6 bg-white p-6 rounded-lg shadow-md text-center">
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--signature)' }}>
              No More Profiles
            </h1>
            <p className="text-sm text-gray-600">
              You've seen all available profiles! Check back later for new matches.
            </p>
            <button
              onClick={() => setCurrentIndex(0)}
              className="px-6 py-2 rounded-lg text-white font-medium transition-all duration-200 hover:shadow-md transform hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, var(--signature) 0%, var(--signature-2) 100%)'
              }}
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100vh-4rem] relative">
      {/* <Header /> */}
      <div className='h-12 flex items-center justify-between px-4'>
          <div></div>
          <h2 className='text-2xl font-semibold -mb-3 text-signature-2'>Rizzler</h2>
          <SettingsIcon className='w-5 h-5 mt-3' />
      </div>
      <div className="flex flex-col items-center p-6">
        {/* Profile Card */}
        <div className="relative w-full max-w-sm">
          {/* Navigation Buttons - Positioned on sides */}
          <button
            onClick={goToPreviousProfile}
            disabled={currentIndex === 0 || isAnimating}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 -translate-x-8 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed z-10"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={goToNextProfile}
            disabled={currentIndex >= profiles.length - 1 || isAnimating}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 translate-x-8 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed z-10"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div
            ref={cardRef}
            className="relative bg-white rounded-2xl overflow-y-auto shadow-xl transition-all duration-300 cursor-grab active:cursor-grabbing select-none"
            style={{ height: 'calc(100vh - 10rem)' }}

          >
            {/* Profile Image */}
            <div className="relative h-80">
              <img
                src={currentProfile.photos[0]}
                alt={currentProfile.name}
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              
              {/* Profile Info Overlay */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h2 className="text-2xl font-bold">
                  {currentProfile.name}, {currentProfile.age}
                </h2>
                <p className="text-sm opacity-90 mt-1">
                  He/Him
                </p>
              </div>
            </div>

            {/* bio */}
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-3">About {currentProfile.name}</h3>
              <p className="text-gray-600 leading-relaxed">
                {currentProfile.bio}
              </p>
            </div>
            
            {/* Interests */}
            <div className="px-6 pb-4">
              <h3 className="text-lg font-semibold mb-3">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {currentProfile.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium"
                    style={{ color: 'var(--foreground)' }}
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Mixed Content: Photos and Prompts */}
            <div className="px-6 pb-6">
              <div className="space-y-6">
                {/* Photo 2 */}
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <img
                    src={currentProfile.photos[1]}
                    alt={`${currentProfile.name} photo 2`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Random Prompt 1 */}
                {currentProfile.prompts[0] && (
                  <div className="bg-pink-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      {currentProfile.prompts[0].question}
                    </p>
                    <p className="text-sm text-gray-600">
                      {currentProfile.prompts[0].answer}
                    </p>
                  </div>
                )}

                {/* Photo 3 */}
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <img
                    src={currentProfile.photos[2]}
                    alt={`${currentProfile.name} photo 3`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Random Prompt 2 */}
                {currentProfile.prompts[1] && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      {currentProfile.prompts[1].question}
                    </p>
                    <p className="text-sm text-gray-600">
                      {currentProfile.prompts[1].answer}
                    </p>
                  </div>
                )}

                {/* Photo 4 */}
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <img
                    src={currentProfile.photos[3]}
                    alt={`${currentProfile.name} photo 4`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Random Prompt 3 */}
                {currentProfile.prompts[2] && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      {currentProfile.prompts[2].question}
                    </p>
                    <p className="text-sm text-gray-600">
                      {currentProfile.prompts[2].answer}
                    </p>
                  </div>
                )}
              </div>
            </div>


          </div>
        </div>

         {/* Heart Animation */}
         {showHeartAnimation && (
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
             <div className="animate-ping">
               <div className="w-32 h-32 flex items-center justify-center">
                 <svg 
                   className="w-24 h-24 text-red-500 animate-bounce" 
                   fill="currentColor" 
                   viewBox="0 0 24 24"
                 >
                   <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                 </svg>
               </div>
             </div>
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
               <div className="text-2xl font-bold text-red-500 animate-pulse">
                 💕 Rose Sent! 💕
               </div>
             </div>
           </div>
         )}

         {/* Rose Button */}
         <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
           <div
             className="relative transition-all duration-300 ease-out"
             style={{
               transform: isRoseDragging 
                 ? `translateY(${Math.min(roseDragCurrent.y - roseDragStart.y, 0)}px) scale(${1 + Math.abs(roseDragCurrent.y - roseDragStart.y) / 200})`
                 : 'translateY(0px) scale(1)'
             }}
           >
             <button
               onMouseDown={handleRoseMouseDown}
               onMouseMove={handleRoseMouseMove}
               onMouseUp={handleRoseMouseUp}
               onMouseLeave={handleRoseMouseUp}
               onTouchStart={handleRoseTouchStart}
               onTouchMove={handleRoseTouchMove}
               onTouchEnd={handleRoseTouchEnd}
               disabled={isAnimating}
               className="w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:opacity-50 active:scale-95 bg-white/80"
               style={{
                 boxShadow: '0 10px 25px rgba(236, 72, 153, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)'
               }}
             >
               {/* Rose Icon */}
               <img src="/rose.png" alt="Rose" className="w-16 h-16" />
             </button>
             
             {/* Drag indicator */}
             {isRoseDragging && (
               <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-pink-500 font-semibold text-sm whitespace-nowrap">
                 {Math.abs(roseDragCurrent.y - roseDragStart.y) > 150 ? 'Send Rose! 🌹' : 'Drag up to send'}
               </div>
             )}
           </div>
         </div>
      </div>
    </div>
  );
};

export default ExplorePage;