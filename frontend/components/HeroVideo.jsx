'use client';

import React from 'react';

const HeroVideo = () => {
    return (
        <div className="w-full relative bg-black">
            <video
                className="w-full h-auto object-cover" // Removed max-h constraint to ensure full coverage
                autoPlay
                loop
                muted
                playsInline
            >
                <source src="/hero-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default HeroVideo;
