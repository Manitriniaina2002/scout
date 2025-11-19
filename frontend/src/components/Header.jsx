import adesLogo from '../assets/LOGO-ADES_HD.png'

function Header() {
  return (
    <header className="shadow-lg" style={{ backgroundColor: '#E3F3DD', color: '#4b8b32' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                Évaluation de conformité du SMSI
              </h1>
              <p className="text-sm sm:text-base mt-1 font-bold" style={{ color: '#000000ff' }}>
               ADES Solaire Madagascar
              </p>
            </div>
            <img src={adesLogo} alt="ADES Logo" className="w-20 h-20 object-contain" />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
