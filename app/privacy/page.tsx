'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import LanguageSelector from '@/components/LanguageSelector';

const texts: { [key: string]: {
  back: string;
  title: string;
  updated: string;
  section1Title: string;
  section1Text: string;
  section1List: string[];
  section2Title: string;
  section2Text: string;
  section2List: string[];
  section3Title: string;
  section3Text: string;
  section4Title: string;
  section4Text: string;
  contactEmail: string;
}} = {
  EN: {
    back: 'Back to Home',
    title: 'Privacy Policy',
    updated: 'Last updated: January 2025',
    section1Title: '1. Information We Collect',
    section1Text: 'We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.',
    section1List: ['Email address', 'Payment information (processed securely by third parties)', 'Usage data and preferences'],
    section2Title: '2. How We Use Your Information',
    section2Text: 'We use the information we collect to:',
    section2List: ['Provide, maintain, and improve our services', 'Process transactions and send related information', 'Send technical notices and support messages', 'Respond to your comments and questions'],
    section3Title: '3. Data Security',
    section3Text: 'We take reasonable measures to help protect your personal information from loss, theft, misuse, and unauthorized access. Your text inputs are processed in real-time and are not stored on our servers after processing.',
    section4Title: '4. Contact Us',
    section4Text: 'If you have any questions about this Privacy Policy, please contact us at:',
    contactEmail: 'support@opus.ai'
  },
  RU: {
    back: 'На главную',
    title: 'Политика конфиденциальности',
    updated: 'Последнее обновление: Январь 2025',
    section1Title: '1. Информация, которую мы собираем',
    section1Text: 'Мы собираем информацию, которую вы предоставляете нам напрямую, например, при создании аккаунта, использовании наших услуг или обращении в поддержку.',
    section1List: ['Адрес электронной почты', 'Платёжная информация (обрабатывается безопасно третьими сторонами)', 'Данные об использовании и предпочтениях'],
    section2Title: '2. Как мы используем вашу информацию',
    section2Text: 'Мы используем собранную информацию для:',
    section2List: ['Предоставления, поддержки и улучшения наших услуг', 'Обработки транзакций и отправки связанной информации', 'Отправки технических уведомлений и сообщений поддержки', 'Ответов на ваши комментарии и вопросы'],
    section3Title: '3. Безопасность данных',
    section3Text: 'Мы принимаем разумные меры для защиты вашей личной информации от потери, кражи, неправильного использования и несанкционированного доступа. Ваши текстовые вводы обрабатываются в реальном времени и не сохраняются на наших серверах после обработки.',
    section4Title: '4. Связаться с нами',
    section4Text: 'Если у вас есть вопросы о данной Политике конфиденциальности, свяжитесь с нами:',
    contactEmail: 'support@opus.ai'
  },
  PT: {
    back: 'Voltar ao Início',
    title: 'Política de Privacidade',
    updated: 'Última atualização: Janeiro 2025',
    section1Title: '1. Informações que Coletamos',
    section1Text: 'Coletamos informações que você nos fornece diretamente, como quando cria uma conta, usa nossos serviços ou entra em contato conosco.',
    section1List: ['Endereço de e-mail', 'Informações de pagamento (processadas com segurança por terceiros)', 'Dados de uso e preferências'],
    section2Title: '2. Como Usamos Suas Informações',
    section2Text: 'Usamos as informações coletadas para:',
    section2List: ['Fornecer, manter e melhorar nossos serviços', 'Processar transações e enviar informações relacionadas', 'Enviar avisos técnicos e mensagens de suporte', 'Responder seus comentários e perguntas'],
    section3Title: '3. Segurança dos Dados',
    section3Text: 'Tomamos medidas razoáveis para proteger suas informações pessoais contra perda, roubo, uso indevido e acesso não autorizado. Seus textos são processados em tempo real e não são armazenados em nossos servidores após o processamento.',
    section4Title: '4. Contate-nos',
    section4Text: 'Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato:',
    contactEmail: 'support@opus.ai'
  },
  HI: {
    back: 'होम पर वापस जाएं',
    title: 'गोपनीयता नीति',
    updated: 'अंतिम अपडेट: जनवरी 2025',
    section1Title: '1. हम कौन सी जानकारी एकत्र करते हैं',
    section1Text: 'हम वह जानकारी एकत्र करते हैं जो आप हमें सीधे प्रदान करते हैं, जैसे कि जब आप अकाउंट बनाते हैं, हमारी सेवाओं का उपयोग करते हैं, या सहायता के लिए संपर्क करते हैं।',
    section1List: ['ईमेल पता', 'भुगतान जानकारी (तृतीय पक्षों द्वारा सुरक्षित रूप से संसाधित)', 'उपयोग डेटा और प्राथमिकताएं'],
    section2Title: '2. हम आपकी जानकारी का उपयोग कैसे करते हैं',
    section2Text: 'हम एकत्रित जानकारी का उपयोग इसके लिए करते हैं:',
    section2List: ['हमारी सेवाओं को प्रदान करना, बनाए रखना और सुधारना', 'लेनदेन संसाधित करना और संबंधित जानकारी भेजना', 'तकनीकी नोटिस और सहायता संदेश भेजना', 'आपकी टिप्पणियों और प्रश्नों का उत्तर देना'],
    section3Title: '3. डेटा सुरक्षा',
    section3Text: 'हम आपकी व्यक्तिगत जानकारी को हानि, चोरी, दुरुपयोग और अनधिकृत पहुंच से बचाने के लिए उचित उपाय करते हैं। आपके टेक्स्ट इनपुट रीयल-टाइम में संसाधित होते हैं और प्रोसेसिंग के बाद हमारे सर्वर पर संग्रहीत नहीं होते।',
    section4Title: '4. हमसे संपर्क करें',
    section4Text: 'यदि इस गोपनीयता नीति के बारे में आपके कोई प्रश्न हैं, तो हमसे संपर्क करें:',
    contactEmail: 'support@opus.ai'
  },
  ID: {
    back: 'Kembali ke Beranda',
    title: 'Kebijakan Privasi',
    updated: 'Terakhir diperbarui: Januari 2025',
    section1Title: '1. Informasi yang Kami Kumpulkan',
    section1Text: 'Kami mengumpulkan informasi yang Anda berikan langsung kepada kami, seperti saat Anda membuat akun, menggunakan layanan kami, atau menghubungi kami untuk dukungan.',
    section1List: ['Alamat email', 'Informasi pembayaran (diproses dengan aman oleh pihak ketiga)', 'Data penggunaan dan preferensi'],
    section2Title: '2. Bagaimana Kami Menggunakan Informasi Anda',
    section2Text: 'Kami menggunakan informasi yang dikumpulkan untuk:',
    section2List: ['Menyediakan, memelihara, dan meningkatkan layanan kami', 'Memproses transaksi dan mengirim informasi terkait', 'Mengirim pemberitahuan teknis dan pesan dukungan', 'Menanggapi komentar dan pertanyaan Anda'],
    section3Title: '3. Keamanan Data',
    section3Text: 'Kami mengambil langkah-langkah yang wajar untuk melindungi informasi pribadi Anda dari kehilangan, pencurian, penyalahgunaan, dan akses tidak sah. Input teks Anda diproses secara real-time dan tidak disimpan di server kami setelah pemrosesan.',
    section4Title: '4. Hubungi Kami',
    section4Text: 'Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami di:',
    contactEmail: 'support@opus.ai'
  },
  PH: {
    back: 'Bumalik sa Home',
    title: 'Patakaran sa Privacy',
    updated: 'Huling na-update: Enero 2025',
    section1Title: '1. Impormasyon na Kinokolekta Namin',
    section1Text: 'Kinokolekta namin ang impormasyon na direkta mong ibinibigay sa amin, tulad ng kapag gumawa ka ng account, gumamit ng aming mga serbisyo, o makipag-ugnayan sa amin para sa suporta.',
    section1List: ['Email address', 'Impormasyon sa pagbabayad (ligtas na pinoproseso ng mga third party)', 'Data ng paggamit at mga kagustuhan'],
    section2Title: '2. Paano Namin Ginagamit ang Iyong Impormasyon',
    section2Text: 'Ginagamit namin ang nakolektang impormasyon para:',
    section2List: ['Magbigay, mapanatili, at mapabuti ang aming mga serbisyo', 'Magproseso ng mga transaksyon at magpadala ng kaugnay na impormasyon', 'Magpadala ng mga teknikal na abiso at mensahe ng suporta', 'Tumugon sa iyong mga komento at tanong'],
    section3Title: '3. Seguridad ng Data',
    section3Text: 'Gumagawa kami ng mga makatwirang hakbang upang protektahan ang iyong personal na impormasyon mula sa pagkawala, pagnanakaw, maling paggamit, at hindi awtorisadong pag-access. Ang iyong mga text input ay pinoproseso sa real-time at hindi iniimbak sa aming mga server pagkatapos ng pagproseso.',
    section4Title: '4. Makipag-ugnayan sa Amin',
    section4Text: 'Kung mayroon kang mga tanong tungkol sa Patakaran sa Privacy na ito, mangyaring makipag-ugnayan sa amin sa:',
    contactEmail: 'support@opus.ai'
  }
};

export default function PrivacyPage() {
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

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">{t.section1Title}</h2>
            <p className="text-gray-300 mb-4">{t.section1Text}</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              {t.section1List.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">{t.section2Title}</h2>
            <p className="text-gray-300 mb-4">{t.section2Text}</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              {t.section2List.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">{t.section3Title}</h2>
            <p className="text-gray-300">{t.section3Text}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">{t.section4Title}</h2>
            <p className="text-gray-300">
              {t.section4Text}
              <a href={`mailto:${t.contactEmail}`} className="text-yellow-500 hover:underline ml-1">
                {t.contactEmail}
              </a>
            </p>
          </section>

        </div>
      </main>
    </div>
  );
}