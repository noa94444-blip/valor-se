// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'

const responses = [
  {
    keywords: ['hej', 'hallå', 'tjena', 'hejsan', 'hi', 'hello'],
    reply: 'Hej! 👋 Välkommen till Valörs support. Hur kan jag hjälpa dig idag? Du kan fråga om våra deals, betalning, leverans eller återbetalning.'
  },
  {
    keywords: ['deal', 'erbjudande', 'rabatt', 'kampanj', 'köp', 'deals'],
    reply: 'Vi har massor av fantastiska deals! 🎁 Besök vår deals-sida på /deals för att se alla aktuella erbjudanden. Du kan filtrera på kategori för att hitta precis det du letar efter.'
  },
  {
    keywords: ['kassa', 'betala', 'betalning', 'checkout', 'order', 'beställning', 'köpa'],
    reply: 'För att göra en beställning: 1️⃣ Hitta din deal på /deals, 2️⃣ Klicka "Köp nu", 3️⃣ Fyll i dina uppgifter i kassan, 4️⃣ Bekräfta din beställning. Du får en bekräftelse direkt på skärmen med ditt order-ID!'
  },
  {
    keywords: ['återbetalning', 'pengarna', 'refund', 'ångra', 'avboka', 'cancel'],
    reply: 'Vill du avboka eller begära återbetalning? 💳 Kontakta oss på support@valor.se med ditt order-ID så hjälper vi dig inom 1-2 arbetsdagar. Vi följer konsumentköplagen och distansavtalslagen.'
  },
  {
    keywords: ['leverans', 'frakt', 'skicka', 'när', 'tid'],
    reply: 'Våra deals är digitala vouchers som skickas till din e-post! 📧 Du bokar sedan tid direkt med handlaren. Leveranstiden för bekräftelse-mail är normalt 1-24 timmar efter beställning.'
  },
  {
    keywords: ['kontakt', 'email', 'mail', 'telefon', 'hjälp'],
    reply: 'Du når oss på: 📧 support@valor.se. Vi svarar inom 1-2 arbetsdagar. För brådskande ärenden, ange ditt order-ID i ämnesraden så prioriterar vi ditt ärende!'
  },
  {
    keywords: ['säkerhet', 'trygg', 'säker', 'gdpr', 'integritet'],
    reply: 'Din säkerhet är vår högsta prioritet! 🔒 Vi använder SSL-kryptering och följer GDPR. Vi sparar aldrig kortnummer eller känsliga betalningsuppgifter. Läs mer i vår integritetspolicy på /integritet.'
  },
  {
    keywords: ['merchant', 'partner', 'samarbeta', 'lista', 'sälja', 'handlare', 'avtal'],
    reply: 'Vill du bli partner med Valör? 🤝 Vi tar 15% provision och du får 85% av försäljningspriset. Läs mer och signera ert avtal digitalt på /avtal. Välkommen att kontakta oss på partner@valor.se!'
  },
  {
    keywords: ['villkor', 'terms', 'regler', 'policy'],
    reply: 'Du hittar våra villkor och policys här: 📋 Köpvillkor: /villkor | Integritetspolicy: /integritet | Handlaravtal: /avtal. Har du specifika frågor, kontakta oss på support@valor.se.'
  },
  {
    keywords: ['kategori', 'mat', 'restaurang', 'skönhet', 'upplevelse', 'sport', 'hälsa'],
    reply: 'Vi har deals inom många kategorier! 🍽️ Mat & Restaurang, 💆 Skönhet & Spa, 🎭 Upplevelser, 🏋️ Sport & Hälsa, 🚗 Bil & Service, och mycket mer. Utforska allt på /deals!'
  },
  {
    keywords: ['valör', 'valor', 'om oss', 'vad är', 'hur fungerar'],
    reply: 'Valör är Sveriges smartaste deal-plattform! 🌟 Vi samlar de bästa erbjudandena från lokala handlare och låter dig spara pengar på det du redan gillar. Bläddra bland hundratals deals på /deals!'
  }
]

function getReply(message) {
  const lower = message.toLowerCase()
  for (const item of responses) {
    for (const keyword of item.keywords) {
      if (lower.includes(keyword)) {
        return item.reply
      }
    }
  }
  return 'Tack för din fråga! 🤔 Jag är inte helt säker på svaret. Kontakta gärna oss direkt på support@valor.se så hjälper vårt team dig inom 1-2 arbetsdagar.'
}

export async function POST(req) {
  try {
    const { message } = await req.json()
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 })
    }
    await new Promise(resolve => setTimeout(resolve, 400))
    const reply = getReply(message.trim())
    return NextResponse.json({ reply })
  } catch (err) {
    return NextResponse.json({ reply: 'Något gick fel. Försök igen eller kontakta oss på support@valor.se.' })
  }
}
