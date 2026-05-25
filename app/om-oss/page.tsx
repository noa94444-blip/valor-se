// @ts-nocheck
export default function OmOssPage() {
  const team = [
    { name: 'Sara Lindqvist', role: 'VD & Grundare', emoji: '👩‍💼', bio: 'Tidigare på Klarna. Brinner för att göra premium-upplevelser tillgängliga för alla.' },
    { name: 'Erik Johansson', role: 'CTO', emoji: '👨‍💻', bio: 'Full-stack-ingenjör med 10 år i fintech. Bygger systemen som driver Valör.' },
    { name: 'Maja Karlsson', role: 'Affärsutveckling', emoji: '👩‍🤝‍👩', bio: 'Ansvarar för alla handlarpartnerskap. 50+ partners onboardade sedan start.' },
  ]

  const values = [
    { icon: '⭐', title: 'Kvalitet', desc: 'Vi kurerar noggrant varje deal. Inga halvmesyrer — bara erbjudanden vi själva skulle köpa.' },
    { icon: '🤝', title: 'Ärlighet', desc: 'Transparenta priser, tydliga villkor. Inga dolda avgifter eller lurig fine print.' },
    { icon: '🌱', title: 'Lokalt fokus', desc: 'Vi stödjer lokala handlare och hjälper dem nå fler kunder i sin stad.' },
    { icon: '🔒', title: 'Trygghet', desc: 'GDPR-compliant, SSL-krypterat, aldrig tredjepartsreklam. Din data är din.' },
  ]

  const stats = [
    { value: '9+', label: 'Aktiva deals' },
    { value: '979', label: 'Nöjda kunder' },
    { value: '85%', label: 'Till handlaren' },
    { value: '2024', label: 'Grundades' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#F5F2ED' }}>
      {/* Header */}
      <div style={{ background: '#26231F', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ color: '#F5F2ED', fontWeight: '800', fontSize: '20px', textDecoration: 'none', letterSpacing: '-0.5px' }}>VALÖR</a>
        <nav style={{ display: 'flex', gap: '24px' }}>
          {[['Deals', '/deals'], ['Kontakt', '/kontakt'], ['Hemsida', '/']].map(([label, href]) => (
            <a key={href} href={href} style={{ color: '#F5F2ED', textDecoration: 'none', fontSize: '14px', opacity: 0.85 }}>{label}</a>
          ))}
        </nav>
      </div>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(160deg, #26231F 0%, #3A3228 50%, #4A6741 100%)', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '56px', marginBottom: '20px' }}>🌟</div>
        <h1 style={{ fontSize: '42px', fontWeight: '800', color: '#F5F2ED', marginBottom: '16px', letterSpacing: '-1px' }}>Om Valör</h1>
        <p style={{ color: '#B0AA9F', fontSize: '18px', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
          Vi skapades för att göra det enkelt att hitta och boka de bästa lokala upplevelserna — till ett riktigt bra pris.
        </p>
      </div>

      {/* Stats */}
      <div style={{ background: '#FFFFFF', padding: '32px 24px', borderBottom: '1px solid #E2DDD6' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', textAlign: 'center' }}>
          {stats.map(({ value, label }) => (
            <div key={label}>
              <div style={{ fontSize: '36px', fontWeight: '800', color: '#4A6741', marginBottom: '4px' }}>{value}</div>
              <div style={{ fontSize: '13px', color: '#6B6560' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '56px 24px' }}>
        {/* Story */}
        <div style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#26231F', marginBottom: '20px' }}>Vår historia</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'center' }}>
            <div>
              <p style={{ color: '#6B6560', fontSize: '16px', lineHeight: '1.7', marginBottom: '16px' }}>
                Valör startades 2024 av ett gäng tech-entusiaster som tröttnade på att missa bra lokala erbjudanden. Vi såg hur fantastiska restauranger, spaanläggningar och upplevelser kämpade för att nå ut till nya kunder — och hur konsumenter betalade fullpris när de inte behövde.
              </p>
              <p style={{ color: '#6B6560', fontSize: '16px', lineHeight: '1.7', marginBottom: '16px' }}>
                Lösningen? En kurerad plattform där kvalitet alltid går före kvantitet. Varje deal på Valör är handplockat av oss — vi provar alltid själva innan vi listar.
              </p>
              <p style={{ color: '#6B6560', fontSize: '16px', lineHeight: '1.7' }}>
                Idag samarbetar vi med handlare i hela Sverige och hjälper tusentals kunder att hitta sin nästa favoritupplevelse.
              </p>
            </div>
            <div style={{ background: '#26231F', borderRadius: '16px', padding: '32px', color: '#FFFFFF', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>💡</div>
              <div style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px', color: '#F5F2ED' }}>Vår mission</div>
              <p style={{ color: '#8B8680', lineHeight: '1.6', fontSize: '14px' }}>
                "Att göra premium-upplevelser tillgängliga för alla — och ge lokala handlare de verktyg de behöver för att växa."
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#26231F', marginBottom: '24px' }}>Våra värderingar</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            {values.map(({ icon, title, desc }) => (
              <div key={title} style={{ background: '#FFFFFF', borderRadius: '12px', padding: '24px', border: '1px solid #E2DDD6', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{icon}</div>
                <div style={{ fontSize: '17px', fontWeight: '700', color: '#26231F', marginBottom: '8px' }}>{title}</div>
                <div style={{ color: '#6B6560', fontSize: '14px', lineHeight: '1.6' }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#26231F', marginBottom: '24px' }}>Teamet bakom Valör</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {team.map(({ name, role, emoji, bio }) => (
              <div key={name} style={{ background: '#FFFFFF', borderRadius: '12px', padding: '24px', border: '1px solid #E2DDD6', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>{emoji}</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#26231F', marginBottom: '4px' }}>{name}</div>
                <div style={{ fontSize: '12px', color: '#8B6914', fontWeight: '600', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{role}</div>
                <div style={{ color: '#6B6560', fontSize: '13px', lineHeight: '1.5' }}>{bio}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: '#4A6741', borderRadius: '16px', padding: '40px 32px', textAlign: 'center', color: '#FFFFFF' }}>
          <div style={{ fontSize: '36px', marginBottom: '16px' }}>🚀</div>
          <h2 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '12px' }}>Redo att utforska?</h2>
          <p style={{ color: '#B8D4B5', marginBottom: '24px', fontSize: '15px' }}>Se alla våra aktiva deals eller bli en av våra partners.</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/deals" style={{ background: '#FFFFFF', color: '#4A6741', padding: '13px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>Se alla deals →</a>
            <a href="/avtal" style={{ background: 'transparent', color: '#FFFFFF', padding: '13px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '14px', border: '2px solid rgba(255,255,255,0.5)' }}>Bli partner</a>
          </div>
        </div>
      </div>
    </div>
  )
}
