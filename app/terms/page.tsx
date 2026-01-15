'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import LanguageSelector from '@/components/LanguageSelector';

const texts: { [key: string]: {
  back: string;
  title: string;
  updated: string;
  sections: { title: string; text: string; list?: string[] }[];
  contactEmail: string;
}} = {
  EN: {
    back: 'Back to Home',
    title: 'Terms of Service',
    updated: 'Last updated: January 2025',
    sections: [
      {
        title: '1. Acceptance of Terms',
        text: 'By accessing and using Opus, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our service.'
      },
      {
        title: '2. Use of Service',
        text: 'You agree to use Opus only for lawful purposes and in accordance with these Terms. You agree not to:',
        list: [
          'Use the service for any illegal or unauthorized purpose',
          'Attempt to gain unauthorized access to our systems',
          'Interfere with or disrupt the service',
          'Generate content that is harmful, abusive, or violates others\' rights'
        ]
      },
      {
        title: '3. Credits and Payments',
        text: 'Credits are purchased in advance and used to access our AI tools. Important points:',
        list: [
          'All purchases are final and non-refundable',
          'Credits do not expire',
          'Credits cannot be transferred to other accounts',
          'We reserve the right to modify pricing at any time'
        ]
      },
      {
        title: '4. Intellectual Property',
        text: 'Content generated using Opus belongs to you. However, you grant us a license to use anonymized data to improve our services. We do not claim ownership of your input or output content.'
      },
      {
        title: '5. Limitation of Liability',
        text: 'Opus is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the service.'
      }
    ],
    contactEmail: 'support@opus.ai'
  },
  RU: {
    back: 'На главную',
    title: 'Условия использования',
    updated: 'Последнее обновление: Январь 2025',
    sections: [
      {
        title: '1. Принятие условий',
        text: 'Используя Opus, вы соглашаетесь с условиями данного соглашения. Если вы не согласны с этими условиями, пожалуйста, не используйте наш сервис.'
      },
      {
        title: '2. Использование сервиса',
        text: 'Вы соглашаетесь использовать Opus только в законных целях. Вы обязуетесь не:',
        list: [
          'Использовать сервис в незаконных или несанкционированных целях',
          'Пытаться получить несанкционированный доступ к нашим системам',
          'Нарушать работу сервиса',
          'Генерировать контент, который является вредным или нарушает права других'
        ]
      },
      {
        title: '3. Кредиты и платежи',
        text: 'Кредиты приобретаются заранее и используются для доступа к нашим AI-инструментам. Важные моменты:',
        list: [
          'Все покупки являются окончательными и не подлежат возврату',
          'Кредиты не имеют срока действия',
          'Кредиты не могут быть переданы другим аккаунтам',
          'Мы оставляем за собой право изменять цены в любое время'
        ]
      },
      {
        title: '4. Интеллектуальная собственность',
        text: 'Контент, созданный с помощью Opus, принадлежит вам. Однако вы предоставляете нам лицензию на использование анонимизированных данных для улучшения наших услуг.'
      },
      {
        title: '5. Ограничение ответственности',
        text: 'Opus предоставляется "как есть" без каких-либо гарантий. Мы не несём ответственности за косвенные или случайные убытки, возникающие в результате использования сервиса.'
      }
    ],
    contactEmail: 'support@opus.ai'
  },
  PT: {
    back: 'Voltar ao Início',
    title: 'Termos de Serviço',
    updated: 'Última atualização: Janeiro 2025',
    sections: [
      {
        title: '1. Aceitação dos Termos',
        text: 'Ao acessar e usar o Opus, você aceita e concorda em cumprir os termos deste acordo. Se você não concordar, por favor não use nosso serviço.'
      },
      {
        title: '2. Uso do Serviço',
        text: 'Você concorda em usar o Opus apenas para fins legais. Você concorda em não:',
        list: [
          'Usar o serviço para fins ilegais ou não autorizados',
          'Tentar obter acesso não autorizado aos nossos sistemas',
          'Interferir ou interromper o serviço',
          'Gerar conteúdo prejudicial ou que viole os direitos de outros'
        ]
      },
      {
        title: '3. Créditos e Pagamentos',
        text: 'Os créditos são comprados antecipadamente. Pontos importantes:',
        list: [
          'Todas as compras são finais e não reembolsáveis',
          'Os créditos não expiram',
          'Os créditos não podem ser transferidos',
          'Reservamos o direito de modificar os preços a qualquer momento'
        ]
      },
      {
        title: '4. Propriedade Intelectual',
        text: 'O conteúdo gerado usando o Opus pertence a você. No entanto, você nos concede uma licença para usar dados anônimos para melhorar nossos serviços.'
      },
      {
        title: '5. Limitação de Responsabilidade',
        text: 'O Opus é fornecido "como está" sem garantias de qualquer tipo. Não somos responsáveis por danos indiretos ou consequentes decorrentes do uso do serviço.'
      }
    ],
    contactEmail: 'support@opus.ai'
  },
  HI: {
    back: 'होम पर वापस जाएं',
    title: 'सेवा की शर्तें',
    updated: 'अंतिम अपडेट: जनवरी 2025',
    sections: [
      {
        title: '1. शर्तों की स्वीकृति',
        text: 'Opus का उपयोग करके, आप इस समझौते की शर्तों से बंधे होने के लिए सहमत हैं। यदि आप इन शर्तों से सहमत नहीं हैं, तो कृपया हमारी सेवा का उपयोग न करें।'
      },
      {
        title: '2. सेवा का उपयोग',
        text: 'आप केवल वैध उद्देश्यों के लिए Opus का उपयोग करने के लिए सहमत हैं। आप सहमत हैं कि आप नहीं करेंगे:',
        list: [
          'सेवा का अवैध या अनधिकृत उद्देश्य के लिए उपयोग',
          'हमारे सिस्टम तक अनधिकृत पहुंच प्राप्त करने का प्रयास',
          'सेवा में हस्तक्षेप या बाधा',
          'हानिकारक सामग्री उत्पन्न करना'
        ]
      },
      {
        title: '3. क्रेडिट और भुगतान',
        text: 'क्रेडिट पहले से खरीदे जाते हैं। महत्वपूर्ण बिंदु:',
        list: [
          'सभी खरीद अंतिम हैं और वापसी योग्य नहीं हैं',
          'क्रेडिट समाप्त नहीं होते',
          'क्रेडिट अन्य खातों में स्थानांतरित नहीं किए जा सकते',
          'हम किसी भी समय कीमतें बदलने का अधिकार सुरक्षित रखते हैं'
        ]
      },
      {
        title: '4. बौद्धिक संपदा',
        text: 'Opus का उपयोग करके उत्पन्न सामग्री आपकी है। हालांकि, आप हमें अपनी सेवाओं को बेहतर बनाने के लिए अनाम डेटा का उपयोग करने का लाइसेंस देते हैं।'
      },
      {
        title: '5. दायित्व की सीमा',
        text: 'Opus "जैसा है" प्रदान किया जाता है बिना किसी गारंटी के। हम सेवा के उपयोग से उत्पन्न अप्रत्यक्ष या आकस्मिक नुकसान के लिए उत्तरदायी नहीं हैं।'
      }
    ],
    contactEmail: 'support@opus.ai'
  },
  ID: {
    back: 'Kembali ke Beranda',
    title: 'Ketentuan Layanan',
    updated: 'Terakhir diperbarui: Januari 2025',
    sections: [
      {
        title: '1. Penerimaan Ketentuan',
        text: 'Dengan mengakses dan menggunakan Opus, Anda menerima dan setuju untuk terikat oleh ketentuan perjanjian ini. Jika Anda tidak setuju, harap jangan gunakan layanan kami.'
      },
      {
        title: '2. Penggunaan Layanan',
        text: 'Anda setuju untuk menggunakan Opus hanya untuk tujuan yang sah. Anda setuju untuk tidak:',
        list: [
          'Menggunakan layanan untuk tujuan ilegal atau tidak sah',
          'Mencoba mendapatkan akses tidak sah ke sistem kami',
          'Mengganggu atau merusak layanan',
          'Menghasilkan konten yang berbahaya atau melanggar hak orang lain'
        ]
      },
      {
        title: '3. Kredit dan Pembayaran',
        text: 'Kredit dibeli di muka. Poin penting:',
        list: [
          'Semua pembelian bersifat final dan tidak dapat dikembalikan',
          'Kredit tidak kedaluwarsa',
          'Kredit tidak dapat ditransfer ke akun lain',
          'Kami berhak mengubah harga kapan saja'
        ]
      },
      {
        title: '4. Kekayaan Intelektual',
        text: 'Konten yang dihasilkan menggunakan Opus adalah milik Anda. Namun, Anda memberi kami lisensi untuk menggunakan data anonim untuk meningkatkan layanan kami.'
      },
      {
        title: '5. Batasan Tanggung Jawab',
        text: 'Opus disediakan "apa adanya" tanpa jaminan apa pun. Kami tidak bertanggung jawab atas kerusakan tidak langsung atau konsekuensial yang timbul dari penggunaan layanan.'
      }
    ],
    contactEmail: 'support@opus.ai'
  },
  PH: {
    back: 'Bumalik sa Home',
    title: 'Mga Tuntunin ng Serbisyo',
    updated: 'Huling na-update: Enero 2025',
    sections: [
      {
        title: '1. Pagtanggap ng mga Tuntunin',
        text: 'Sa pag-access at paggamit ng Opus, tinatanggap mo at sumasang-ayon na sumunod sa mga tuntunin ng kasunduang ito. Kung hindi ka sumasang-ayon, mangyaring huwag gamitin ang aming serbisyo.'
      },
      {
        title: '2. Paggamit ng Serbisyo',
        text: 'Sumasang-ayon kang gamitin ang Opus para lamang sa mga legal na layunin. Sumasang-ayon kang hindi:',
        list: [
          'Gamitin ang serbisyo para sa mga ilegal na layunin',
          'Subukang makakuha ng hindi awtorisadong access sa aming mga sistema',
          'Makagambala o makaabala sa serbisyo',
          'Gumawa ng nakakapinsalang content'
        ]
      },
      {
        title: '3. Mga Credit at Pagbabayad',
        text: 'Ang mga credit ay binibili nang maaga. Mahahalagang punto:',
        list: [
          'Lahat ng pagbili ay final at hindi refundable',
          'Hindi nag-e-expire ang mga credit',
          'Hindi maaaring ilipat ang mga credit sa ibang account',
          'May karapatan kaming baguhin ang mga presyo anumang oras'
        ]
      },
      {
        title: '4. Intellectual Property',
        text: 'Ang content na nagawa gamit ang Opus ay sa iyo. Gayunpaman, binibigyan mo kami ng lisensya na gumamit ng anonymous data upang mapabuti ang aming mga serbisyo.'
      },
      {
        title: '5. Limitasyon ng Pananagutan',
        text: 'Ang Opus ay ibinibigay "as is" nang walang anumang garantiya. Hindi kami mananagot para sa anumang hindi direkta o konsekwensyal na pinsala na nagmumula sa paggamit ng serbisyo.'
      }
    ],
    contactEmail: 'support@opus.ai'
  }
};

export default function TermsPage() {
  const { lang } = useLanguage();
  const t = texts[lang] || texts.EN;

  return (
    <div className="min-h-screen bg-black">
      
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition"
          >
            <ArrowLeft size={20} />
            {t.back}
          </Link>
          <LanguageSelector />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <h1 className="text-4xl font-bold text-white mb-8">{t.title}</h1>
        
        <div className="prose prose-invert max-w-none">
          
          <p className="text-gray-400 mb-6">{t.updated}</p>

          {t.sections.map((section, i) => (
            <section key={i} className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">{section.title}</h2>
              <p className="text-gray-300 mb-4">{section.text}</p>
              {section.list && (
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  {section.list.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">6. Contact</h2>
            <p className="text-gray-300">
              <a href={`mailto:${t.contactEmail}`} className="text-yellow-500 hover:underline">
                {t.contactEmail}
              </a>
            </p>
          </section>

        </div>
      </main>
    </div>
  );
}