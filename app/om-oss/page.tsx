import Link from 'next/link'

export const metadata = {
  title: 'Om oss | Valör',
  description: 'Lär dig mer om Valör — Sveriges modernaste premium deals-plattform.',
}

export default function OmOssPage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0A0806', paddingTop: '60px' }}>

      {/* HERO */}
      <section style={{
        background: 'linear-gradient(160deg, #0A0806 0%, #1A1410 60%, #0A0806 100%)',
        padding: '80px 24px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ fontSize: '3rem', marginBottom: '24px' }}>⭐</div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, color: '#F5F2ED', marginBottom: '20px' }}>
            Om Valör
          </h1>
          <p style={{ color: '#8A847C', fontSize: '1.1rem', lineHeight: 1.75, maxWidth: '560px', margin: '0 auto' }}>
            Vi skapades för att göra det enkelt att hitta och boka de bästa lokala upplevelserna — till ett riktigt bra pris.
          </p>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: '60px 24px', backgroundColor: '#F5F2ED' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '32px', textAlign: 'center' }}>
          {[
            { num: '9+', label: 'Aktiva deals' },
            { num: '979', label: 'Nöjda kunder' },
            { num: '85%', label: 'Till handlaren' },
            { num: '2024', label: 'Grundades' },
          ].map(({ num, label }) => (
            <div key={label}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#2D5A3A', fontFamily: 'Georgia, serif' }}>{num}</div>
              <div style={{ color: '#5C5650', fontSize: '0.95rem', marginTop: '4px' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* VÅR HISTORIA */}
      <section style={{ padding: '80px 24px', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: '#F5F2ED', marginBottom: '24px' }}>
          Vår historia
        </h2>
        <p style={{ color: '#8A847C', lineHeight: 1.8, fontSize: '1rem', marginBottom: '16px' }}>
          Valör grundades 2024 med en enkel tanke: det ska vara enkelt att hitta och boka kvalitetsupplevelser i din stad — utan att behöva betala fullt pris.
        </p>
        <p style={{ color: '#8A847C', lineHeight: 1.8, fontSize: '1rem', marginBottom: '16px' }}>
          Vi samarbetar med noggrant utvalda restauranger, spatn, fitnessanläggningar och upplevelser som delar vår vision: att göra premium tillgängligt för alla.
        </p>
        <p style={{ color: '#8A847C', lineHeight: 1.8, fontSize: '1rem' }}>
          Vår affärsmodell är enkel — vi tar bara 15% provision. Inga månadsavgifter, inga dolda kostnader. Vi tjänar när du tjänar.
        </p>
      </section>

      {/* VÅRA VÄRDERINGAR */}
      <section style={{ padding: '60px 24px 80px', backgroundColor: '#F5F2ED' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: '#1A1A1A', marginBottom: '40px', textAlign: 'center' }}>
            Våra värderingar
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            {[
              { icon: '🌟', title: 'Kvalitet först', desc: 'Vi accepterar bara de bästa partnerna. Varje deal granskas noggrant före publicering.' },
              { icon: '🤝', title: 'Partnerskap', desc: 'Vi bygger långsiktiga relationer med våra partners. Deras framgång är vår framgång.' },
              { icon: '🔒', title: 'Trygghet', desc: 'Säker betalning, tydliga villkor och alltid någon att kontakta om något går fel.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{
                background: '#fff', borderRadius: '16px', padding: '28px',
                border: '1px solid #E2DDD6',
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{icon}</div>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.15rem', color: '#1A1A1A', marginBottom: '10px' }}>{title}</h3>
                <p style={{ color: '#5C5650', lineHeight: 1.7, fontSize: '0.9rem' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: '60px 24px 100px' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#F5F2ED', marginBottom: '16px' }}>
          Vill du bli partner?
        </h2>
        <p style={{ color: '#8A847C', marginBottom: '28px' }}>
          Vi tar bara 15% provision — inga månadsavgifter.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/registrera" style={{
            display: 'inline-block', padding: '14px 32px', borderRadius: '100px',
            background: 'linear-gradient(135deg, #C9A84C, #9A7A1A)',
            color: '#000', fontWeight: 700, textDecoration: 'none',
          }}>
            Registrera som partner
          </Link>
          <Link href="/kontakt" style={{
            display: 'inline-block', padding: '14px 32px', borderRadius: '100px',
            border: '1.5px solid rgba(201,168,76,0.4)',
            color: '#C9A84C', fontWeight: 600, textDecoration: 'none',
          }}>
            Kontakta oss
          </Link>
        </div>
      </section>
    </main>
  )
}
