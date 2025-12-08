import React from 'react';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';

const Home = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Hero />
            <Features />
        </div>
    );
};

export default Home;
