// Dibujos de 300 x 200. Procura que cada zona tenga algo reconocible.
export const DIBUJOS = {
  casa: {
    icono: '🏠',
    contenido: (
      <>
        <rect width="300" height="200" fill="#8fd8ff" />
        <circle cx="45" cy="42" r="26" fill="#ffd60a" stroke="#ff9f1c" strokeWidth="7" />
        <path d="M205 45a18 18 0 0 1 32-12 20 20 0 0 1 32 14 14 14 0 0 1-4 27h-55a15 15 0 0 1-5-29z" fill="#fff" />
        <rect y="145" width="300" height="55" fill="#4fcf5c" />
        <rect x="95" y="85" width="110" height="85" fill="#ffb45c" stroke="#2b2350" strokeWidth="4" />
        <path d="M80 90 150 28l70 62z" fill="#ff5a6e" stroke="#2b2350" strokeWidth="4" strokeLinejoin="round" />
        <rect x="135" y="120" width="32" height="50" rx="14" fill="#9b5de5" stroke="#2b2350" strokeWidth="4" />
        <rect x="105" y="100" width="24" height="24" fill="#fff6a8" stroke="#2b2350" strokeWidth="4" />
        <rect x="173" y="100" width="24" height="24" fill="#fff6a8" stroke="#2b2350" strokeWidth="4" />
        <rect x="248" y="115" width="14" height="55" fill="#9a5b34" />
        <circle cx="255" cy="108" r="30" fill="#1f9d4c" />
        <circle cx="244" cy="100" r="6" fill="#ff5a6e" />
        <circle cx="266" cy="115" r="6" fill="#ff5a6e" />
        <circle cx="40" cy="167" r="13" fill="#ff70c0" />
        <circle cx="40" cy="167" r="5" fill="#ffd60a" />
      </>
    ),
  },
  mar: {
    icono: '⛵',
    contenido: (
      <>
        <rect width="300" height="200" fill="#bfe9ff" />
        <circle cx="255" cy="40" r="27" fill="#ffd60a" stroke="#ff9f1c" strokeWidth="7" />
        <path d="M30 45q14-18 28 0 14-18 28 0" fill="none" stroke="#2b2350" strokeWidth="5" strokeLinecap="round" />
        <path d="M0 110q25-18 50 0t50 0 50 0 50 0 50 0 50 0v90H0z" fill="#2f9bff" />
        <path d="M145 25v80H85z" fill="#ff5a6e" stroke="#2b2350" strokeWidth="4" strokeLinejoin="round" />
        <path d="M155 40v65h48z" fill="#ffd60a" stroke="#2b2350" strokeWidth="4" strokeLinejoin="round" />
        <path d="M75 108h150l-28 34h-94z" fill="#9a5b34" stroke="#2b2350" strokeWidth="4" strokeLinejoin="round" />
        <path d="M30 170q30-32 62 0-32 32-62 0l-20 17v-34z" fill="#ff9f1c" stroke="#2b2350" strokeWidth="4" strokeLinejoin="round" />
        <circle cx="75" cy="165" r="5" fill="#2b2350" />
        <path d="m240 150 9 18 20 3-15 14 4 20-18-10-18 10 4-20-15-14 20-3z" fill="#ff70c0" stroke="#2b2350" strokeWidth="4" strokeLinejoin="round" />
      </>
    ),
  },
};
