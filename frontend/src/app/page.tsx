import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="container-safe flex items-center justify-between py-4">
          <div className="text-2xl font-bold text-primary-700">
            CampanhaOS
          </div>
          <div className="flex gap-4">
            <Link
              href="/auth/login"
              className="btn-secondary"
            >
              Entrar
            </Link>
            <Link
              href="/auth/register"
              className="btn-primary"
            >
              Registrar
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container-safe py-20 text-center animate-slideUp">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Gestão Inteligente de Campanhas Eleitorais
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          CampanhaOS é uma plataforma SaaS completa para gerenciar todos os
          aspectos de suas campanhas eleitorais, com autenticação multi-tenant,
          insights em tempo real e inteligência artificial.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/register" className="btn-primary">
            Começar Agora
          </Link>
          <Link href="#features" className="btn-secondary">
            Conhecer Recursos
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 py-20">
        <div className="container-safe">
          <h2 className="text-3xl font-bold text-center mb-12">
            Recursos Principais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Dashboard em Tempo Real',
                description:
                  'Visualize métricas, metas de votos e alertas automáticos',
                icon: '📊',
              },
              {
                title: 'Gestão de Contatos',
                description: 'Organize lideranças, eleitores e equipe em um único lugar',
                icon: '👥',
              },
              {
                title: 'Marketing Digital',
                description: 'Campanhas em Instagram, WhatsApp e E-mail integradas',
                icon: '📱',
              },
              {
                title: 'Financeiro Completo',
                description: 'Controle de contas, notas fiscais e prestação de contas',
                icon: '💰',
              },
              {
                title: 'IA & Previsões',
                description: 'Previsão de votos e sugestões automáticas',
                icon: '🤖',
              },
              {
                title: 'Segurança & LGPD',
                description: 'Conformidade completa com regulações brasileiras',
                icon: '🔒',
              },
            ].map((feature, idx) => (
              <div key={idx} className="card text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container-safe text-center">
          <p>&copy; 2026 CampanhaOS. Todos os direitos reservados.</p>
          <p className="text-sm mt-2">
            Desenvolvido com ❤️ para campanhas eleitorais
          </p>
        </div>
      </footer>
    </main>
  );
}
