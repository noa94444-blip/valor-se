import Link from 'next/link'

export const metadata = {
  title: 'Om oss | Valör',
  description: 'Lär dig mer om Valör – Sveriges modernaste premium deals-plattform.',
}

export default function OmOssPage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0A0806', paddingTop: '60px' }}>

      {/* HERO */}
      <section style={{
        background: 'linear-gradient(160deg, #0A0806 0%, #1A1410 60%, #0a0806 100%)',
        padding: '80px 24px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ fontSize: '48px', marginBottom: '24px' }}>⭐</div>
          <h1 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(36px, 6vw, 64px)',
            color: '#F5F0E8',
            marginBottom: '24px',
          }}>
            Om Valör
          </h1>
          <p style={{ color: '#9A8B7A', fontSize: '18px', lineHeight: '1.7' }}>
            Vi skapades för att göra det enkelt att hitta och boka de bästa lokala
            upplevelserna — till ett riktigt bra pris.
          </p>
        </div>
      </section>

      {/* STATS */}
      <section style={{
        backgroundColor: '#F5F0E8',
        padding: '60px 24px',
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '40px',
          textAlign: 'center',
        }}>
          {[
            { value: '9+', label: 'Aktiva deals' },
            { value: '979', label: 'Nöjda kunder' },
            { value: '85%', label: 'Till handlaren' },
            { value: '2024', label: 'Grundades' },
          ].map((stat) => (
            <div key={stat.label}>
              <div style={{ fontSize: '48px', fontWeight: '700', color: '#2D6A4F', marginBottom: '8px' }}>
                {stat.value}
              </div>
              <div style={{ color: '#6B5B45', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VÅR HISTORIA */}
      <section style={{
        backgroundColor: '#0A0806',
        padding: '80px 24px',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '36px',
            color: '#F5F0E8',
            marginBottom: '32px',
          }}>
            Vår historia
          </h2>
          <p style={{ color: '#9A8B7A', fontSize: '17px', lineHeight: '1.8', marginBottom: '20px' }}>
            Valör grundades 2024 med en enkel tanke: det ska vara enkelt att hitta och boka kvalitetsupplevelser i
            din stad — utan att behöva betala fullt pris.
          </p>
          <p style={{ color: '#9A8B7A', fontSize: '17px', lineHeight: '1.8', marginBottom: '20px' }}>
            Vi samarbetar med noggrant utvalda restauranger, spatn, fitnessanläggningar och upplevelser som
            delar vår vision: att göra premium tillgängligt för alla.
          </p>
          <p style={{ color: '#9A8B7A', fontSize: '17px', lineHeight: '1.8' }}>
            Vår affärsmodell är enkel — vi tar bara 15% provision. Inga månadsavgifter, inga dolda kostnader. Vi
            tjänar när du tjänar.
          </p>
        </div>
      </section>

      {/* VÅRA VÄRDERINGAR */}
      <section style={{
        backgroundColor: '#F5F0E8',
        padding: '80px 24px',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '36px',
            color: '#1A1410',
            marginBottom: '48px',
            textAlign: 'center',
          }}>
            Våra värderingar
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '32px',
          }}>
            {[
              {
                icon: '✨',
                title: 'Kvalitet först',
                desc: 'Vi accepterar bara de bästa partnerna. Varje deal granskas noggrant före publicering.',
              },
              {
                icon: '🤝',
                title: 'Partnerskap',
                desc: 'Vi bygger långsiktiga relationer med våra partners. Deras framgång är vår framgång.',
              },
              {
                icon: '🛡️',
                title: 'Trygghet',
                desc: 'Säker betalning, tydliga villkor och alltid någon att kontakta om något går fel.',
              },
            ].map((v) => (
              <div key={v.title} style={{
                backgroundColor: '#fff',
                borderRadius: '16px',
                padding: '32px 24px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              }}>
                <div style={{ fontSize: '36px', marginBottom: '16px' }}>{v.icon}</div>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', color: '#1A1410', marginBottom: '12px' }}>
                  {v.title}
                </h3>
                <p style={{ color: '#6B5B45', fontSize: '15px', lineHeight: '1.7' }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GRUNDARE */}
      <section style={{
        backgroundColor: '#0A0806',
        padding: '80px 24px',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '36px',
            color: '#F5F0E8',
            marginBottom: '48px',
          }}>
            Bakom plattformen
          </h2>
          <div style={{
            backgroundColor: '#1A1410',
            borderRadius: '20px',
            padding: '48px 40px',
            border: '1px solid rgba(212, 175, 55, 0.2)',
          }}>
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #D4AF37, #8B7355)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '36px',
              margin: '0 auto 24px auto',
            }}>
              N
            </div>
            <h3 style={{
              fontFamily: 'Georgia, serif',
              fontSize: '28px',
              color: '#D4AF37',
              marginBottom: '8px',
            }}>
              Noa
            </h3>
            <p style={{
              color: '#9A8B7A',
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: '24px',
            }}>
              Grundare &amp; Byggt av
            </p>
            <p style={{
              color: '#B8A99A',
              fontSize: '17px',
              lineHeight: '1.8',
            }}>
              Valör är byggt och skapat av Noa — med passion för att koppla ihop människor med
              de bästa lokala upplevelserna till ett riktigt bra pris. Varje detalj på plattformen
              är noggrant genomtänkt för att ge både kunder och partners en premium upplevelse.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: 'linear-gradient(135deg, #1A1410 0%, #2D6A4F 100%)',
        padding: '80px 24px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '36px',
            color: '#F5F0E8',
            marginBottom: '16px',
          }}>
            Vill du bli partner?
          </h2>
          <p style={{ color: '#9A8B7A', fontSize: '18px', marginBottom: '40px' }}>
            Vi tar bara 15% provision — inga månadsavgifter.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/registrera" style={{
              display: 'inline-block',
              backgroundColor: '#D4AF37',
              color: '#0A0806',
              padding: '14px 32px',
              borderRadius: '50px',
              fontWeight: '700',
              textDecoration: 'none',
              fontSize: '16px',
            }}>
              Registrera som partner
            </Link>
            <Link href="/kontakt" style={{
              display: 'inline-block',
              backgroundColor: 'transparent',
              color: '#D4AF37',
              padding: '14px 32px',
              borderRadius: '50px',
              fontWeight: '600',
              textDecoration: 'none',
              fontSize: '16px',
              border: '2px solid #D4AF37',
            }}>
              Kontakta oss
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}
