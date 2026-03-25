import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Servicios from '../components/Servicios';
import GalleryHighlights from '../components/GalleryHighlights';
import Testimonios from '../components/Testimonios';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';

const Home = () => {
    return (
        <PageTransition>
            <Navbar />
            <main>
                <Hero />
                <Servicios />
                <GalleryHighlights />
                <Testimonios />
                <CTA />
            </main>
            <Footer />
        </PageTransition>
    );
};

export default Home;