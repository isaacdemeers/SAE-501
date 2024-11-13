'use client'

import { useState } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex-shrink-0">
              <img className="h-8 w-8" src="/placeholder.svg?height=32&width=32" alt="Logo" />
            </a>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#" className="text-gray-800 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium">Accueil</a>
                <a href="#" className="text-gray-800 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium">Produits</a>
                <a href="#" className="text-gray-800 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium">À propos</a>
                <a href="#" className="text-gray-800 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium">Contact</a>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <Button variant="outline" className="mr-2">Se connecter</Button>
            <Button>S'inscrire</Button>
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Ouvrir le menu principal</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#" className="text-gray-800 hover:bg-gray-200 block px-3 py-2 rounded-md text-base font-medium">Accueil</a>
            <a href="#" className="text-gray-800 hover:bg-gray-200 block px-3 py-2 rounded-md text-base font-medium">Produits</a>
            <a href="#" className="text-gray-800 hover:bg-gray-200 block px-3 py-2 rounded-md text-base font-medium">À propos</a>
            <a href="#" className="text-gray-800 hover:bg-gray-200 block px-3 py-2 rounded-md text-base font-medium">Contact</a>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-5">
              <Button variant="outline" className="mr-2 w-full">Se connecter</Button>
            </div>
            <div className="mt-3 px-5">
              <Button className="w-full">S'inscrire</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}