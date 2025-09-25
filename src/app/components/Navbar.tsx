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

    const navItems = [
        { name: 'Inicio', href: '#hero' },
        { name: 'Sobre mí', href: '#about' },
        { name: 'Habilidades', href: '#skills' },
        { name: 'Proyectos', href: '#projects' },
        { name: 'Contacto', href: '#contact' },
    ];
    return (
        <nav className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex flex-col gap-y-2 justify-between items-center">
                <a href="#hero" className="text-2xl font-bold text-gray-200 hover:text-gray-700 transition-colors">
                    Patrick Ordoñez
                </a>
            {/* Desktop Navigation */}
                <div className="hidden md:flex space-x-8">
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

            {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <IoMdClose /> : <AiOutlineMenu />}
                </button>
            </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
            <div className="md:hidden mt-4 py-4 bg-white rounded-lg shadow-lg">
                {navItems.map((item) => (
                <a
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all"
                    onClick={() => setIsMenuOpen(false)}
                >
                    {item.name}
                </a>
                ))}
            </div>
        )}
      </nav>
    )
}