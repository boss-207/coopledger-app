import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function Navbar({ userData }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const roleColors = {
    president: 'bg-purple-100 text-purple-700',
    tresorier: 'bg-blue-100 text-blue-700',
    membre: 'bg-green-100 text-green-700',
  };

  const roleLabels = {
    president: 'Président',
    tresorier: 'Trésorier',
    membre: 'Membre',
  };

  const links = [
    { to: '/', label: 'Tableau de bord' },
    { to: '/vote', label: 'Votes' },
    { to: '/historique', label: 'Historique' },
    ...(userData?.role === 'tresorier' || userData?.role === 'president'
      ? [{ to: '/nouvelle-transaction', label: '➕ Nouvelle Transaction' }]
      : []),
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">


        <Link to="/" className="flex items-center gap-3 no-underline">
          <div className="w-9 h-9 bg-green-700 rounded-full flex items-center justify-center text-lg">🌱</div>
          <div>
            <span className="font-bold text-gray-900 text-lg">Coop<span className="text-green-700">Ledger</span></span>
            <p className="text-xs text-gray-400 leading-none">CTA de Broukou</p>
          </div>
        </Link>


        <div className="hidden md:flex items-center gap-1">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition no-underline ${
                location.pathname === link.to
                  ? 'bg-green-700 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>


        <div className="flex items-center gap-3">
          {userData && (
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${roleColors[userData.role] || 'bg-gray-100 text-gray-600'}`}>
              {roleLabels[userData.role] || userData.role}
            </span>
          )}
          <button
            onClick={() => signOut(auth)}
            className="text-sm text-gray-500 hover:text-red-600 transition px-3 py-2 rounded-xl hover:bg-red-50"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
}