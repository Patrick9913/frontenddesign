'use client';

import React, { useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";

export const Navbar: React.FC = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
        setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevenir scroll cuando el menú está abierto
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    const navItems = [
        { name: 'Inicio', href: '#hero' },
        { name: 'Sobre mí', href: '#about' },
        { name: 'Habilidades', href: '#skills' },
        { name: 'Proyectos', href: '#projects' },
        { name: 'Contacto', href: '#contact' },
    ];
    return (
        <>
        <nav className="max-w-6xl mx-auto px-6 py-4 relative z-50">
            <div className="flex flex-row md:flex-col justify-between items-center">
                <a href="#hero" className="text-2xl font-bold text-gray-200 hover:text-gray-700 transition-colors">
                    Patrick Ordoñez
                </a>
            
            {/* Desktop Navigation */}
                <div className="hidden md:flex md:mt-4 space-x-8">
                    {navItems.map((item) => (
                    <a
                        key={item.name}
                        href={item.href}
                        className="text-gray-300 hover:text-gray-100 transition-colors font-medium"
                    >
                        {item.name}
                    </a>
                    ))}
                </div>

            {/* Mobile Menu Button - Fijo en la esquina superior derecha */}
                <button
                    className="md:hidden p-2 text-gray-200 hover:text-gray-100 transition-colors z-[60] fixed top-4 right-4 bg-gray-800 rounded-lg shadow-lg"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <IoMdClose size={28} /> : <AiOutlineMenu size={28} />}
                </button>
            </div>
      </nav>

        {/* Overlay oscuro de fondo */}
        {isMenuOpen && (
            <div 
                className="fixed inset-0 bg-black/70 z-40 md:hidden transition-opacity duration-300"
                onClick={() => setIsMenuOpen(false)}
            />
        )}

        {/* Mobile Navigation - Sidebar desde la derecha */}
        <div className={`fixed top-0 right-0 h-full w-[280px] bg-gradient-to-b from-gray-900 to-gray-950 shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
            <div className="flex flex-col h-full pt-20 px-6">
                <div className="flex flex-col space-y-2">
                    {navItems.map((item, index) => (
                    <a
                        key={item.name}
                        href={item.href}
                        className="text-gray-200 hover:text-white hover:bg-gray-800 transition-all px-4 py-4 rounded-lg text-lg font-medium border-b border-gray-800"
                        onClick={() => setIsMenuOpen(false)}
                        style={{ 
                            animation: isMenuOpen ? `slideIn 0.3s ease-out ${index * 0.05}s forwards` : 'none',
                            opacity: 0
                        }}
                    >
                        {item.name}
                    </a>
                    ))}
                </div>
            </div>
        </div>

        <style jsx>{`
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateX(20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
        `}</style>
        </>
    )
}