import Link from 'next/link'
import { SAMPLE_DEALS, CATEGORIES } from '@/lib/data'

export default function HomePage() {
  const featured = SAMPLE_DEALS.filter((d: any) => d.featured).slice(0, 4)
  const latest = SAMPLE_DEALS.slice(0, 8)

  return (
    <div style={{minHeight:'100vh',background:'#F5F2ED',fontFamily:'Inter,system-ui,sans-serif'}}>
      <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:100,background:'rgba(245,242,237,0.95)',backdropFilter:'blur(12px)',borderBottom:'1px solid rgba(196,151,74,0.15)',boxShadow:'0 1px 20px rgba(26,58,42,0.06)'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',padding:'0 24px',height:'72px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <Link href="/" style={{textDecoration:'none',display:'flex',alignItems:'center',gap:'10px'}}>
            <div style={{width:'36px',height:'36px',background:'linear-gradient(135deg,#1A3A2A,#2D5A3D)',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 12px rgba(26,58,42,0.3)'}}>
              <span style={{color:'#C4974A',fontSize:'16px',fontWeight:'700',fontFamily:'Georgia,serif'}}>V</span>
            </div>
            <span style={{fontSize:'22px',fontWeight:'700',color:'#1A3A2A',fontFamily:'Georgia,serif',letterSpacing:'-0.5px'}}>Valor</span>
          </Link>
          <div style={{display:'flex',alignItems:'center',gap:'32px'}}>
            <Link href="/deals" style={{textDecoration:'none',color:'#4A5568',fontSize:'14px',fontWeight:'500'}}>Utforska</Link>
            <Link href="/deals?kategori=spa" style={{textDecoration:'none',color:'#4A5568',fontSize:'14px',fontWeight:'500'}}>Spa</Link>
            <Link href="/deals?kategori=restauranger" style={{textDecoration:'none',color:'#4A5568',fontSize:'14px',fontWeight:'500'}}>Restauranger</Link>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
            <Link href="/logga-in" style={{textDecoration:'none',color:'#1A3A2A',fontSize:'14px',fontWeight:'500',padding:'8px 18px',border:'1.5px solid rgba(26,58,42,0.25)',borderRadius:'10px'}}>Logga in</Link>
            <Link href="/registrera" style={{textDecoration:'none',color:'#fff',fontSize:'14px',fontWeight:'600',padding:'9px 20px',background:'linear-gradient(135deg,#1A3A2A,#2D5A3D)',borderRadius:'10px',boxShadow:'0 4px 14px rgba(26,58,42,0.3)'}}>Kom igang</Link>
          </div>
        </div>
      </nav>

      <section style={{position:'relative',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',paddingTop:'72px'}}>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,#0D2418 0%,#1A3A2A 45%,#0F2D1E 100%)'}} />
        <div style={{position:'absolute',inset:0,backgroundImage:'radial-gradient(ellipse at 20% 50%,rgba(196,151,74,0.15) 0%,transparent 60%),radial-gradient(ellipse at 80% 20%,rgba(45,90,61,0.4) 0%,transparent 50%)'}} />
        <div style={{position:'relative',textAlign:'center',padding:'0 24px',maxWidth:'800px',margin:'0 auto'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:'8px',background:'rgba(196,151,74,0.12)',border:'1px solid rgba(196,151,74,0.3)',borderRadius:'50px',padding:'6px 16px',marginBottom:'32px'}}>
            <div style={{width:'6px',height:'6px',background:'#C4974A',borderRadius:'50%'}} />
            <span style={{color:'rgba(196,151,74,0.9)',fontSize:'12px',fontWeight:'600',letterSpacing:'1px',textTransform:'uppercase'}}>Premium deals i Goteborg</span>
          </div>
          <h1 style={{fontSize:'80px',fontWeight:'800',color:'#fff',lineHeight:'1.05',letterSpacing:'-2px',marginBottom:'24px',fontFamily:'Georgia,serif'}}>
            Upplev mer.
          </h1>
          <h1 style={{fontSize:'80px',fontWeight:'800',color:'#C4974A',lineHeight:'1.05',letterSpacing:'-2px',marginBottom:'24px',fontFamily:'Georgia,serif'}}>
            Betala mindre.
          </h1>
          <p style={{color:'rgba(255,255,255,0.65)',fontSize:'18px',lineHeight:'1.7',marginBottom:'48px',maxWidth:'520px',margin:'0 auto 48px'}}>
            Kurerade premium deals pa spa, restauranger och upplevelser. Bara det basta, till halva priset.
          </p>
          <div style={{display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/deals" style={{textDecoration:'none',display:'inline-flex',alignItems:'center',gap:'8px',background:'linear-gradient(135deg,#C4974A,#D4AA5A)',color:'#1A2E1A',fontSize:'16px',fontWeight:'700',padding:'16px 36px',borderRadius:'14px',boxShadow:'0 8px 30px rgba(196,151,74,0.4)'}}>
              Utforska deals
            </Link>
            <Link href="/for-foretag" style={{textDecoration:'none',display:'inline-flex',alignItems:'center',background:'rgba(255,255,255,0.08)',border:'1.5px solid rgba(255,255,255,0.2)',color:'rgba(255,255,255,0.85)',fontSize:'16px',fontWeight:'500',padding:'16px 36px',borderRadius:'14px'}}>
              For foretag
            </Link>
          </div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'40px',marginTop:'64px',paddingTop:'40px',borderTop:'1px solid rgba(255,255,255,0.08)'}}>
            {([['2 400+','Nojda kunder'],['180+','Premium deals'],['4.9','Betyg'],['48 tim','Support']] as const).map(([n,l]) => (
              <div key={String(l)} style={{textAlign:'center'}}>
                <div style={{fontSize:'24px',fontWeight:'800',color:'#C4974A',fontFamily:'Georgia,serif'}}>{n}</div>
                <div style={{fontSize:'11px',color:'rgba(255,255,255,0.45)',marginTop:'2px',letterSpacing:'0.5px',textTransform:'uppercase'}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{background:'#fff',borderBottom:'1px solid rgba(196,151,74,0.12)',boxShadow:'0 4px 20px rgba(26,58,42,0.04)'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',padding:'20px 24px',display:'flex',gap:'10px',overflowX:'auto'}}>
          <Link href="/deals" style={{textDecoration:'none',flexShrink:0,display:'inline-flex',alignItems:'center',gap:'6px',background:'linear-gradient(135deg,#1A3A2A,#2D5A3D)',color:'#fff',fontSize:'13px',fontWeight:'600',padding:'9px 18px',borderRadius:'50px'}}>
            Alla deals
          </Link>
          {CATEGORIES.map((cat: any) => (
            <Link key={cat.slug} href={'/deals?kategori=' + cat.slug}
              style={{textDecoration:'none',flexShrink:0,display:'inline-flex',alignItems:'center',gap:'6px',background:'#F5F2ED',color:'#4A5568',fontSize:'13px',fontWeight:'500',padding:'9px 18px',borderRadius:'50px',border:'1.5px solid rgba(196,151,74,0.15)'}}>
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section style={{maxWidth:'1200px',margin:'0 auto',padding:'80px 24px 40px'}}>
        <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:'40px'}}>
          <div>
            <p style={{fontSize:'11px',fontWeight:'700',letterSpacing:'2px',textTransform:'uppercase',color:'#C4974A',marginBottom:'8px'}}>Utvalda</p>
            <h2 style={{fontSize:'36px',fontWeight:'800',color:'#1A3A2A',fontFamily:'Georgia,serif',letterSpacing:'-1px'}}>Veckans basta deals</h2>
          </div>
          <Link href="/deals" style={{textDecoration:'none',display:'inline-flex',alignItems:'center',gap:'6px',color:'#1A3A2A',fontSize:'14px',fontWeight:'600',padding:'10px 20px',border:'1.5px solid rgba(26,58,42,0.2)',borderRadius:'10px'}}>
            Se alla
          </Link>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:'24px'}}>
          {featured.map((deal: any) => <DealCard key={deal.id} deal={deal} />)}
        </div>
      </section>

      <section style={{background:'linear-gradient(180deg,#F5F2ED 0%,#EDE8E0 100%)',padding:'60px 0 80px'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',padding:'0 24px'}}>
          <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:'40px'}}>
            <h2 style={{fontSize:'36px',fontWeight:'800',color:'#1A3A2A',fontFamily:'Georgia,serif',letterSpacing:'-1px'}}>Senaste deals</h2>
            <Link href="/deals" style={{textDecoration:'none',color:'#C4974A',fontSize:'14px',fontWeight:'600'}}>Se alla</Link>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:'24px'}}>
            {latest.map((deal: any) => <DealCard key={deal.id} deal={deal} />)}
          </div>
        </div>
      </section>

      <section style={{background:'#fff',padding:'80px 24px'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto',textAlign:'center'}}>
          <p style={{fontSize:'11px',fontWeight:'700',letterSpacing:'2px',textTransform:'uppercase',color:'#C4974A',marginBottom:'12px'}}>Hur det fungerar</p>
          <h2 style={{fontSize:'36px',fontWeight:'800',color:'#1A3A2A',fontFamily:'Georgia,serif',letterSpacing:'-1px',marginBottom:'56px'}}>Tre enkla steg</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'40px'}}>
            {([
              {n:'01',title:'Utforska deals',desc:'Bladda bland kurerade premium-erbjudanden pa spa, restauranger och upplevelser i din stad.'},
              {n:'02',title:'Kop sakert',desc:'Saker betalning. Du far en digital voucher direkt i mobilen - redo att anvandas.'},
              {n:'03',title:'Njut och upplev',desc:'Visa din voucher hos partnern och njut av en upplevelse du aldrig glommer.'},
            ] as const).map(s => (
              <div key={s.n} style={{textAlign:'center',padding:'40px 28px',background:'#F5F2ED',borderRadius:'20px',border:'1px solid rgba(196,151,74,0.12)'}}>
                <div style={{width:'56px',height:'56px',background:'linear-gradient(135deg,#1A3A2A,#2D5A3D)',borderRadius:'16px',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',boxShadow:'0 8px 24px rgba(26,58,42,0.2)'}}>
                  <span style={{color:'#C4974A',fontSize:'18px',fontWeight:'800',fontFamily:'Georgia,serif'}}>{s.n}</span>
                </div>
                <h3 style={{fontSize:'18px',fontWeight:'700',color:'#1A3A2A',marginBottom:'10px'}}>{s.title}</h3>
                <p style={{fontSize:'14px',color:'#6B7280',lineHeight:'1.6'}}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{background:'linear-gradient(135deg,#0D2418 0%,#1A3A2A 100%)',padding:'80px 24px',textAlign:'center'}}>
        <div style={{maxWidth:'600px',margin:'0 auto'}}>
          <h2 style={{fontSize:'40px',fontWeight:'800',color:'#fff',fontFamily:'Georgia,serif',letterSpacing:'-1px',marginBottom:'16px'}}>Redo att uppleva mer?</h2>
          <p style={{color:'rgba(255,255,255,0.6)',fontSize:'16px',marginBottom:'36px'}}>Ga med tusentals nojda kunder och hitta din nasta upplevelse idag.</p>
          <Link href="/deals" style={{textDecoration:'none',display:'inline-flex',alignItems:'center',gap:'8px',background:'linear-gradient(135deg,#C4974A,#D4AA5A)',color:'#1A2E1A',fontSize:'16px',fontWeight:'700',padding:'16px 40px',borderRadius:'14px',boxShadow:'0 8px 30px rgba(196,151,74,0.4)'}}>
            Utforska alla deals
          </Link>
        </div>
      </section>

      <footer style={{background:'#0D1F14',padding:'60px 24px 32px'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingBottom:'32px',borderBottom:'1px solid rgba(255,255,255,0.08)',marginBottom:'32px',flexWrap:'wrap',gap:'20px'}}>
            <span style={{fontSize:'20px',fontWeight:'700',color:'#fff',fontFamily:'Georgia,serif'}}>Valor</span>
            <div style={{display:'flex',gap:'32px'}}>
              {(['Om oss','Kontakt','For foretag','Integritetspolicy'] as const).map(l => (
                <Link key={l} href="/" style={{textDecoration:'none',color:'rgba(255,255,255,0.4)',fontSize:'13px'}}>{l}</Link>
              ))}
            </div>
          </div>
          <div style={{textAlign:'center',color:'rgba(255,255,255,0.25)',fontSize:'12px'}}>
            2025 Valor. Alla rattigheter forbehallna.
          </div>
        </div>
      </footer>
    </div>
  )
}

function DealCard({ deal }: { deal: any }) {
  const price = deal.price || 0
  const originalPrice = deal.originalPrice || 0
  const discount = originalPrice > 0 ? Math.round((1 - price / originalPrice) * 100) : 0
  return (
    <Link href={'/deals/' + deal.slug} style={{textDecoration:'none',display:'block',background:'#fff',borderRadius:'20px',overflow:'hidden',boxShadow:'0 4px 20px rgba(26,58,42,0.07)',border:'1px solid rgba(196,151,74,0.1)',cursor:'pointer'}}>
      <div style={{position:'relative',height:'200px',background:'linear-gradient(135deg,#1A3A2A,#2D5A3D)',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'radial-gradient(circle at 70% 30%,rgba(196,151,74,0.2),transparent 60%)'}} />
        <div style={{position:'absolute',top:'14px',left:'14px',background:'rgba(0,0,0,0.4)',color:'#C4974A',fontSize:'11px',fontWeight:'700',padding:'5px 10px',borderRadius:'50px',border:'1px solid rgba(196,151,74,0.3)'}}>
          -{discount}%
        </div>
        {deal.featured && (
          <div style={{position:'absolute',top:'14px',right:'14px',background:'rgba(196,151,74,0.15)',color:'#C4974A',fontSize:'10px',fontWeight:'700',padding:'5px 10px',borderRadius:'50px',border:'1px solid rgba(196,151,74,0.3)'}}>
            UTVALT
          </div>
        )}
        <div style={{position:'absolute',bottom:'14px',left:'14px'}}>
          <span style={{background:'rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.7)',fontSize:'11px',padding:'4px 10px',borderRadius:'50px'}}>
            {deal.category}
          </span>
        </div>
      </div>
      <div style={{padding:'20px'}}>
        <p style={{fontSize:'11px',fontWeight:'600',color:'#C4974A',marginBottom:'4px',letterSpacing:'0.5px',textTransform:'uppercase'}}>{deal.merchant}</p>
        <h3 style={{fontSize:'16px',fontWeight:'700',color:'#1A3A2A',lineHeight:'1.3',marginBottom:'12px'}}>{deal.title}</h3>
        <div style={{display:'flex',alignItems:'baseline',gap:'8px',marginBottom:'12px'}}>
          <span style={{fontSize:'24px',fontWeight:'800',color:'#1A3A2A',fontFamily:'Georgia,serif'}}>{price.toLocaleString('sv-SE')} kr</span>
          <span style={{fontSize:'13px',color:'#9CA3AF',textDecoration:'line-through'}}>{originalPrice.toLocaleString('sv-SE')} kr</span>
        </div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <span style={{fontSize:'12px',color:'#6B7280'}}>&#9733; {deal.rating} · {deal.location}</span>
          {deal.spotsLeft && deal.spotsLeft < 20 && (
            <span style={{fontSize:'11px',color:'#DC6B3A',fontWeight:'600'}}>{deal.spotsLeft} kvar</span>
          )}
        </div>
      </div>
    </Link>
  )
}
