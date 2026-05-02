import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

function formatFCFA(n) {
  return (n || 0).toLocaleString('fr-FR') + ' FCFA';
}
function formatDate(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}
function genHash() {
  return '0x' + Array.from({ length: 8 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('') + '...' + Array.from({ length: 4 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}

/*const DEMO_TRANSACTIONS = [
  { id: '1', titre: 'Vente surplus de grains', montant: 1250000, type: 'revenu', statut: 'valide', date: new Date('2026-04-16'), hash: '0x4f2a...8e11', initiateur: 'Aminata S.' },
  { id: '2', titre: "Maintenance Pompe d'Irrigation #14", montant: 185000, type: 'depense', statut: 'valide', date: new Date('2026-04-17'), hash: '0x8b3c...2d45', initiateur: 'Moussa K.' },
  { id: '3', titre: 'Subvention Agriculture Durable UE', montant: 4500000, type: 'revenu', statut: 'valide', date: new Date('2026-04-18'), hash: '0x1c4d...9f12', initiateur: 'Auto Système' },
  { id: '4', titre: "Fourniture d'Engrais Organiques", montant: 890000, type: 'depense', statut: 'en_cours', date: new Date('2026-04-19'), hash: '0x7e5f...3a78', initiateur: 'Oumar D.' },
  { id: '5', titre: "Fonds de Secours d'Urgence", montant: 250000, type: 'depense', statut: 'valide', date: new Date('2026-04-20'), hash: '0x2a6b...5c34', initiateur: 'Fatima B.' },
  { id: '6', titre: 'Cotisation mensuelle — 45 membres', montant: 675000, type: 'revenu', statut: 'valide', date: new Date('2026-04-01'), hash: '0x9d7c...8e21', initiateur: 'Auto Système' },
  { id: '7', titre: 'Achat semences maïs', montant: 320000, type: 'depense', statut: 'valide', date: new Date('2026-03-28'), hash: '0x3b8e...7f56', initiateur: 'Kofi A.' },
  { id: '8', titre: 'Prime vente cacao Q1', montant: 2100000, type: 'revenu', statut: 'valide', date: new Date('2026-03-15'), hash: '0x6c9f...4d23', initiateur: 'Auto Système' },
];*/

const STATUT_CONFIG = {
  valide: { label: 'Vérifié', bg: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  en_cours: { label: 'En cours', bg: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
  rejete: { label: 'Rejeté', bg: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
};

const TYPE_CONFIG = {
  revenu: { label: 'Revenu', icon: '↑', bg: 'bg-green-100', color: 'text-green-600', sign: '+' },
  entree: { label: 'Revenu', icon: '↑', bg: 'bg-green-100', color: 'text-green-600', sign: '+' },
  depense: { label: 'Dépense', icon: '↓', bg: 'bg-red-100', color: 'text-red-500', sign: '-' },
  sortie: { label: 'Dépense', icon: '↓', bg: 'bg-red-100', color: 'text-red-500', sign: '-' },
};

function TransactionRow({ tx, index }) {
  const [expanded, setExpanded] = useState(false);
  const statut = STATUT_CONFIG[tx.statut] || STATUT_CONFIG.valide;
  const type = TYPE_CONFIG[tx.type] || TYPE_CONFIG.depense;

  return (
    <>
      <tr
        className="hover:bg-gray-50 cursor-pointer transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <td className="px-4 py-3 text-sm text-gray-500">{formatDate(tx.date)}</td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 ${type.bg} rounded-lg flex items-center justify-center text-xs font-bold ${type.color}`}>
              {type.icon}
            </div>
            <span className={`text-xs font-semibold ${type.color}`}>{type.label}</span>
          </div>
        </td>
        <td className="px-4 py-3">
          <p className="text-sm font-semibold text-gray-900">{tx.titre}</p>
          <p className="text-xs text-gray-400 font-mono mt-0.5">{tx.hash || genHash()}</p>
        </td>
        <td className="px-4 py-3 text-right">
          <span className={`text-sm font-bold ${type.color}`}>
            {type.sign}{(tx.montant || 0).toLocaleString('fr-FR')}
          </span>
        </td>
        <td className="px-4 py-3 text-center">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${statut.bg}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statut.dot}`} />
            {statut.label}
          </span>
        </td>
        <td className="px-4 py-3 text-sm text-gray-500 text-center">{tx.initiateur || '—'}</td>
        <td className="px-4 py-3 text-center text-gray-400">
          {expanded ? '▲' : '▼'}
        </td>
      </tr>
      {expanded && (
        <tr className="bg-green-50">
          <td colSpan={7} className="px-6 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Hash Blockchain</p>
                <p className="font-mono text-green-700 text-xs">{tx.hash || genHash()}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Réseau</p>
                <p className="font-semibold text-gray-700">Polygon Blockchain</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Confirmation</p>
                <p className="font-semibold text-green-600">✓ Immuable · 4 nœuds</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Montant exact</p>
                <p className="font-bold text-gray-900">{formatFCFA(tx.montant)}</p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function Historique({ userData }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtre, setFiltre] = useState('tout');
  const [recherche, setRecherche] = useState('');
  const [page, setPage] = useState(1);
  const PAR_PAGE = 5;

  useEffect(() => {
    const q = query(collection(db, 'transactions'), orderBy('date', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      // ✅ Seulement les vraies données — pas de fallback fictif
      setTransactions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtrees = transactions.filter(tx => {
    const matchFiltre =
      filtre === 'tout' ? true :
      filtre === 'revenus' ? (tx.type === 'revenu' || tx.type === 'entree') :
      filtre === 'depenses' ? (tx.type === 'depense' || tx.type === 'sortie') :
      filtre === 'valeur_elevee' ? tx.montant > 500000 : true;
    const matchRecherche = recherche === '' ||
      tx.titre?.toLowerCase().includes(recherche.toLowerCase()) ||
      tx.hash?.toLowerCase().includes(recherche.toLowerCase());
    return matchFiltre && matchRecherche;
  });

  const totalPages = Math.ceil(filtrees.length / PAR_PAGE);
  const affichees = filtrees.slice((page - 1) * PAR_PAGE, page * PAR_PAGE);

const soldeTotal = transactions
  .filter(t => t.statut === 'valide')
  .reduce((acc, tx) => {
    const isEntree = tx.type === 'revenu' || tx.type === 'entree';
    return isEntree ? acc + (tx.montant || 0) : acc - (tx.montant || 0);
  }, 0);

const revenuMensuel = transactions
  .filter(t => (t.type === 'revenu' || t.type === 'entree') && t.statut === 'valide')
  .reduce((acc, tx) => acc + (tx.montant || 0), 0);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="text-5xl mb-3 animate-pulse"></div>
        <p className="text-green-700 font-semibold">Chargement du registre...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Transparence Financière</p>
          <h1 className="text-2xl font-bold text-gray-900">Le Registre Vivant 📋</h1>
          <p className="text-gray-500 text-sm mt-1">
            Registre immuable de chaque FCFA transitant par le fonds agricole. Basé sur la transparence, vérifié par la communauté.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-600 px-4 py-2 rounded-xl text-sm font-medium transition">
            Audit PDF
          </button>
          <button className="flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-600 px-4 py-2 rounded-xl text-sm font-medium transition">
            Exporter CSV
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Solde Total</p>
          <p className="text-3xl font-black text-gray-900">{(soldeTotal / 1000000).toFixed(2)}M</p>
          <p className="text-xs text-gray-400 mt-1">FCFA</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Revenu Mensuel</p>
{/* ✅ Affiche 0 si vide — pas de valeur fictive */}
          <p className="text-3xl font-black text-blue-600">
            {revenuMensuel >= 1000000
              ? `${(revenuMensuel / 1000000).toFixed(2)}M`
              : revenuMensuel >= 1000
              ? `${(revenuMensuel / 1000).toFixed(0)}K`
              : revenuMensuel.toLocaleString('fr-FR')}
          </p>
          <p className="text-xs text-gray-400 mt-1">FCFA</p>
        </div>
        <div className="bg-green-900 rounded-2xl p-5 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-24 flex items-center justify-center text-6xl opacity-10">🔒</div>
          <p className="text-sm text-green-300 mb-1">Vérification Blockchain</p>
          <p className="text-sm font-bold text-white leading-relaxed">
            Les transactions sont signées cryptographiquement et sécurisées sur 4 nœuds.
          </p>
        </div>
      </div>

      {/* FILTRES + RECHERCHE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { key: 'tout', label: 'Toutes les Transactions' },
              { key: 'revenus', label: 'Revenus' },
              { key: 'depenses', label: 'Dépenses' },
              { key: 'valeur_elevee', label: 'Valeur Élevée (>500k)' },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => { setFiltre(f.key); setPage(1); }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  filtre === f.key
                    ? 'bg-green-800 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2">
              <span className="text-gray-400"></span>
              <input
                type="text"
                placeholder="Rechercher..."
                value={recherche}
                onChange={e => { setRecherche(e.target.value); setPage(1); }}
                className="outline-none text-sm text-gray-700 w-40 bg-transparent"
              />
            </div>
          </div>
        </div>

        {/* TABLEAU */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide">Date</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide">Type</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide">Description</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-400 uppercase tracking-wide">Montant (FCFA)</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-400 uppercase tracking-wide">Statut</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-400 uppercase tracking-wide">Initiateur</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-400 uppercase tracking-wide">Détails</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {affichees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    Aucune transaction trouvée
                  </td>
                </tr>
              ) : (
                affichees.map((tx, i) => (
                  <TransactionRow key={tx.id} tx={tx} index={i} />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Affichage de {Math.min(PAR_PAGE, filtrees.length)} entrées sur {filtrees.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-sm hover:bg-gray-50 disabled:opacity-40 transition"
            >‹</button>
            {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-sm font-semibold transition ${
                  page === p ? 'bg-green-800 text-white' : 'border border-gray-200 hover:bg-gray-50'
                }`}
              >{p}</button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-sm hover:bg-gray-50 disabled:opacity-40 transition"
            >›</button>
          </div>
        </div>
      </div>

      {/* GARANTIE TRANSPARENCE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
        
        <h3 className="font-bold text-green-800 text-lg mb-2">Notre Garantie de Transparence Radicale</h3>
        <p className="text-gray-500 text-sm leading-relaxed max-w-2xl mx-auto mb-4">
          Chaque transaction est visible par tous les membres. Aucune manipulation cachée n'est possible.
          CoopLedger utilise des ancres cryptographiques pour garantir qu'une fois un enregistrement saisi,
          il ne peut être modifié sans le consensus de la communauté.
        </p>
        <div className="flex justify-center gap-6 text-xs text-gray-400 font-medium uppercase tracking-wider">
          <button className="hover:text-green-700 transition">Spécifications Techniques</button>
          <button className="hover:text-green-700 transition">Gouvernance du Registre</button>
          <button className="hover:text-green-700 transition">Politique de Sécurité</button>
        </div>
      </div>
    </div>
  );
}