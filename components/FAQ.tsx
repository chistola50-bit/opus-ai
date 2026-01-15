'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqData: { [key: string]: { title: string; subtitle: string; items: { q: string; a: string }[] } } = {
  EN: {
    title: 'Frequently Asked Questions',
    subtitle: 'Everything you need to know',
    items: [
      { 
        q: 'What is this service?', 
        a: 'This is a usage-based AI service that helps you write, reply, summarize, explain, and generate content. You don\'t pay for a subscription — you pay only for what you use, using AI Credits. One action → one result → credits are consumed.' 
      },
      { 
        q: 'How does billing work?', 
        a: 'You purchase AI Credits. Credits are consumed based on actual usage, depending on: input length, output size, and type of action. Different actions may consume different amounts of credits. Credits do not expire.' 
      },
      { 
        q: 'What are AI Credits?', 
        a: 'AI Credits are an internal unit used to measure AI usage. They are: usage-based, non-transferable, non-refundable, and not a cryptocurrency. Credits are consumed automatically when you generate results.' 
      },
      { 
        q: 'Why is there a service fee?', 
        a: 'Each purchase includes a fixed service fee that covers: infrastructure, security, payment processing, and platform maintenance. Credits are added only for the remaining amount after the service fee. This allows us to keep prices stable and fair for all users.' 
      },
      { 
        q: 'How many credits do I get for my purchase?', 
        a: 'Credits are calculated based on the USD value of your purchase, excluding the service fee. Example: $7.49 purchase − $0.49 service fee = $7.00 goes to credits = 700,000 AI Credits. This calculation is applied consistently for all users.' 
      },
      { 
        q: 'Why can credit usage vary?', 
        a: 'Credit usage depends on: how much text you submit, how long the AI response is, and the type of action selected. Some requests naturally require more processing than others. To ensure fair usage, we apply output limits and step-by-step generation for long results.' 
      },
      { 
        q: 'Why are long answers generated in parts?', 
        a: 'To keep the service fast, affordable, and fair: long results are generated step by step, and each "Continue" counts as a new action. This prevents excessive usage in a single request and ensures transparent billing.' 
      },
      { 
        q: 'Do credits ever expire?', 
        a: 'No. Credits never expire and remain on your account until used.' 
      },
      { 
        q: 'Is there a free trial?', 
        a: 'Yes. New users receive 1,000 free credits to try the service. Free credits are for testing only, granted once per user, and cannot be transferred or reused across multiple accounts.' 
      },
      { 
        q: 'How does referral bonus work?', 
        a: 'You receive referral bonuses only if your invited user makes a purchase. Conditions: minimum purchase required, bonus is granted in AI Credits, bonuses are verified before activation. Referral bonuses are designed to reward real usage, not registrations.' 
      },
      { 
        q: 'Can I get a refund?', 
        a: 'No. All purchases are final and non-refundable. This is because: payments are made in cryptocurrency, credits are usage-based, and AI resources are consumed instantly. Please use free credits to test the service before purchasing.' 
      },
      { 
        q: 'What happens if I send more crypto than required?', 
        a: 'If you send more than the required amount: credits are calculated based on the actual amount received, credits are added accordingly, and excess funds are not refunded.' 
      },
      { 
        q: 'What happens if I send less crypto than required?', 
        a: 'If the payment amount is insufficient: credits are not added, the transaction is marked as underpaid, and you may retry the payment with the correct amount.' 
      },
      { 
        q: 'How are crypto prices calculated?', 
        a: 'All prices are set in USD. When paying with USDT or TON: the crypto amount is calculated at the current exchange rate, the rate is fixed for a short time during payment, and rounding is applied to avoid underpayment. This ensures fairness and price stability.' 
      },
      { 
        q: 'Can I use VPN or multiple accounts?', 
        a: 'Using VPNs, proxies, or multiple accounts may limit access to: free credits, referral bonuses, and certain features. To protect the service from abuse, we apply automated risk controls.' 
      },
      { 
        q: 'Is this a subscription?', 
        a: 'No. There are: no subscriptions, no auto-renewals, and no recurring charges. You pay once and use your credits whenever you want.' 
      },
      { 
        q: 'Do you store my content?', 
        a: 'Your content is used only to generate results. We do not sell user data or generated content.' 
      },
      { 
        q: 'Why is this system fair?', 
        a: 'Because: you pay only for actual usage, credits don\'t expire, there are no hidden subscriptions, and billing is transparent and consistent.' 
      }
    ]
  },
  RU: {
    title: 'Часто задаваемые вопросы',
    subtitle: 'Всё, что нужно знать',
    items: [
      { 
        q: 'Что это за сервис?', 
        a: 'Это AI-сервис с оплатой по факту использования, который помогает писать, отвечать, суммировать и генерировать контент. Вы не платите за подписку — вы платите только за то, что используете, с помощью AI-кредитов. Одно действие → один результат → кредиты списываются.' 
      },
      { 
        q: 'Как работает оплата?', 
        a: 'Вы покупаете AI-кредиты. Кредиты списываются на основе фактического использования в зависимости от: длины ввода, размера вывода и типа действия. Разные действия могут потреблять разное количество кредитов. Кредиты не сгорают.' 
      },
      { 
        q: 'Что такое AI-кредиты?', 
        a: 'AI-кредиты — это внутренняя единица для измерения использования AI. Они: основаны на использовании, не передаются, не возвращаются и не являются криптовалютой. Кредиты списываются автоматически при генерации результатов.' 
      },
      { 
        q: 'Почему есть сервисный сбор?', 
        a: 'Каждая покупка включает фиксированный сервисный сбор, который покрывает: инфраструктуру, безопасность, обработку платежей и поддержку платформы. Кредиты добавляются только за оставшуюся сумму после сервисного сбора. Это позволяет поддерживать стабильные и справедливые цены.' 
      },
      { 
        q: 'Сколько кредитов я получу за покупку?', 
        a: 'Кредиты рассчитываются на основе суммы покупки в USD за вычетом сервисного сбора. Пример: покупка $7.49 − сервисный сбор $0.49 = $7.00 идёт на кредиты = 700,000 AI-кредитов. Этот расчёт применяется одинаково для всех пользователей.' 
      },
      { 
        q: 'Почему расход кредитов может различаться?', 
        a: 'Расход кредитов зависит от: объёма отправленного текста, длины ответа AI и выбранного типа действия. Некоторые запросы требуют больше обработки. Для справедливого использования мы применяем лимиты вывода и пошаговую генерацию для длинных результатов.' 
      },
      { 
        q: 'Почему длинные ответы генерируются частями?', 
        a: 'Чтобы сервис оставался быстрым, доступным и справедливым: длинные результаты генерируются пошагово, и каждое "Продолжить" считается новым действием. Это предотвращает чрезмерное использование за один запрос и обеспечивает прозрачную тарификацию.' 
      },
      { 
        q: 'Кредиты когда-нибудь сгорают?', 
        a: 'Нет. Кредиты никогда не сгорают и остаются на вашем аккаунте до использования.' 
      },
      { 
        q: 'Есть бесплатный пробный период?', 
        a: 'Да. Новые пользователи получают 1,000 бесплатных кредитов для тестирования сервиса. Бесплатные кредиты предназначены только для тестирования, выдаются один раз и не могут быть переданы или использованы повторно на других аккаунтах.' 
      },
      { 
        q: 'Как работает реферальный бонус?', 
        a: 'Вы получаете реферальные бонусы только если приглашённый пользователь совершает покупку. Условия: требуется минимальная покупка, бонус начисляется в AI-кредитах, бонусы проверяются перед активацией. Реферальные бонусы вознаграждают реальное использование, а не регистрации.' 
      },
      { 
        q: 'Могу ли я получить возврат?', 
        a: 'Нет. Все покупки окончательны и не подлежат возврату. Это связано с тем, что: платежи производятся в криптовалюте, кредиты основаны на использовании, и AI-ресурсы потребляются мгновенно. Пожалуйста, используйте бесплатные кредиты для тестирования перед покупкой.' 
      },
      { 
        q: 'Что будет, если я отправлю больше крипты, чем нужно?', 
        a: 'Если вы отправите больше требуемой суммы: кредиты рассчитываются на основе фактически полученной суммы, кредиты добавляются соответственно, излишки не возвращаются.' 
      },
      { 
        q: 'Что будет, если я отправлю меньше крипты, чем нужно?', 
        a: 'Если сумма платежа недостаточна: кредиты не добавляются, транзакция помечается как недоплата, вы можете повторить платёж с правильной суммой.' 
      },
      { 
        q: 'Как рассчитываются крипто-цены?', 
        a: 'Все цены установлены в USD. При оплате USDT или TON: сумма в крипте рассчитывается по текущему курсу, курс фиксируется на короткое время во время оплаты, применяется округление во избежание недоплаты. Это обеспечивает справедливость и стабильность цен.' 
      },
      { 
        q: 'Можно ли использовать VPN или несколько аккаунтов?', 
        a: 'Использование VPN, прокси или нескольких аккаунтов может ограничить доступ к: бесплатным кредитам, реферальным бонусам и некоторым функциям. Для защиты сервиса от злоупотреблений мы применяем автоматический контроль рисков.' 
      },
      { 
        q: 'Это подписка?', 
        a: 'Нет. Здесь нет: подписок, автопродлений и регулярных платежей. Вы платите один раз и используете кредиты когда хотите.' 
      },
      { 
        q: 'Вы храните мой контент?', 
        a: 'Ваш контент используется только для генерации результатов. Мы не продаём данные пользователей или сгенерированный контент.' 
      },
      { 
        q: 'Почему эта система справедлива?', 
        a: 'Потому что: вы платите только за фактическое использование, кредиты не сгорают, нет скрытых подписок, и тарификация прозрачна и последовательна.' 
      }
    ]
  },
  PT: {
    title: 'Perguntas Frequentes',
    subtitle: 'Tudo o que você precisa saber',
    items: [
      { 
        q: 'O que é este serviço?', 
        a: 'Este é um serviço de IA baseado em uso que ajuda você a escrever, responder, resumir, explicar e gerar conteúdo. Você não paga por assinatura — você paga apenas pelo que usa, usando Créditos de IA. Uma ação → um resultado → créditos são consumidos.' 
      },
      { 
        q: 'Como funciona a cobrança?', 
        a: 'Você compra Créditos de IA. Os créditos são consumidos com base no uso real, dependendo de: tamanho da entrada, tamanho da saída e tipo de ação. Diferentes ações podem consumir diferentes quantidades de créditos. Os créditos não expiram.' 
      },
      { 
        q: 'O que são Créditos de IA?', 
        a: 'Créditos de IA são uma unidade interna usada para medir o uso de IA. Eles são: baseados em uso, intransferíveis, não reembolsáveis e não são criptomoeda. Os créditos são consumidos automaticamente quando você gera resultados.' 
      },
      { 
        q: 'Por que há uma taxa de serviço?', 
        a: 'Cada compra inclui uma taxa de serviço fixa que cobre: infraestrutura, segurança, processamento de pagamentos e manutenção da plataforma. Os créditos são adicionados apenas pelo valor restante após a taxa de serviço. Isso nos permite manter preços estáveis e justos para todos os usuários.' 
      },
      { 
        q: 'Quantos créditos recebo pela minha compra?', 
        a: 'Os créditos são calculados com base no valor em USD da sua compra, excluindo a taxa de serviço. Exemplo: compra de $7,49 − taxa de serviço de $0,49 = $7,00 vão para créditos = 700.000 Créditos de IA. Este cálculo é aplicado consistentemente para todos os usuários.' 
      },
      { 
        q: 'Por que o uso de créditos pode variar?', 
        a: 'O uso de créditos depende de: quanto texto você envia, quão longa é a resposta da IA e o tipo de ação selecionada. Algumas solicitações naturalmente requerem mais processamento. Para garantir uso justo, aplicamos limites de saída e geração passo a passo para resultados longos.' 
      },
      { 
        q: 'Por que respostas longas são geradas em partes?', 
        a: 'Para manter o serviço rápido, acessível e justo: resultados longos são gerados passo a passo, e cada "Continuar" conta como uma nova ação. Isso evita uso excessivo em uma única solicitação e garante cobrança transparente.' 
      },
      { 
        q: 'Os créditos expiram?', 
        a: 'Não. Os créditos nunca expiram e permanecem na sua conta até serem usados.' 
      },
      { 
        q: 'Existe um teste gratuito?', 
        a: 'Sim. Novos usuários recebem 1.000 créditos gratuitos para experimentar o serviço. Créditos gratuitos são apenas para teste, concedidos uma vez por usuário e não podem ser transferidos ou reutilizados em várias contas.' 
      },
      { 
        q: 'Como funciona o bônus de indicação?', 
        a: 'Você recebe bônus de indicação apenas se o usuário convidado fizer uma compra. Condições: compra mínima necessária, bônus é concedido em Créditos de IA, bônus são verificados antes da ativação. Bônus de indicação são projetados para recompensar uso real, não registros.' 
      },
      { 
        q: 'Posso obter reembolso?', 
        a: 'Não. Todas as compras são finais e não reembolsáveis. Isso porque: pagamentos são feitos em criptomoeda, créditos são baseados em uso e recursos de IA são consumidos instantaneamente. Use créditos gratuitos para testar o serviço antes de comprar.' 
      },
      { 
        q: 'O que acontece se eu enviar mais cripto do que o necessário?', 
        a: 'Se você enviar mais do que o valor necessário: os créditos são calculados com base no valor real recebido, os créditos são adicionados de acordo e os fundos em excesso não são reembolsados.' 
      },
      { 
        q: 'O que acontece se eu enviar menos cripto do que o necessário?', 
        a: 'Se o valor do pagamento for insuficiente: os créditos não são adicionados, a transação é marcada como pagamento insuficiente e você pode tentar novamente o pagamento com o valor correto.' 
      },
      { 
        q: 'Como os preços de cripto são calculados?', 
        a: 'Todos os preços são definidos em USD. Ao pagar com USDT ou TON: o valor em cripto é calculado na taxa de câmbio atual, a taxa é fixada por um curto período durante o pagamento e arredondamento é aplicado para evitar pagamento insuficiente. Isso garante justiça e estabilidade de preços.' 
      },
      { 
        q: 'Posso usar VPN ou múltiplas contas?', 
        a: 'Usar VPNs, proxies ou múltiplas contas pode limitar o acesso a: créditos gratuitos, bônus de indicação e certos recursos. Para proteger o serviço contra abuso, aplicamos controles de risco automatizados.' 
      },
      { 
        q: 'Isso é uma assinatura?', 
        a: 'Não. Não há: assinaturas, renovações automáticas ou cobranças recorrentes. Você paga uma vez e usa seus créditos quando quiser.' 
      },
      { 
        q: 'Vocês armazenam meu conteúdo?', 
        a: 'Seu conteúdo é usado apenas para gerar resultados. Não vendemos dados de usuários ou conteúdo gerado.' 
      },
      { 
        q: 'Por que este sistema é justo?', 
        a: 'Porque: você paga apenas pelo uso real, os créditos não expiram, não há assinaturas ocultas e a cobrança é transparente e consistente.' 
      }
    ]
  },
  HI: {
    title: 'अक्सर पूछे जाने वाले प्रश्न',
    subtitle: 'सब कुछ जो आपको जानना चाहिए',
    items: [
      { q: 'यह सेवा क्या है?', a: 'यह एक उपयोग-आधारित AI सेवा है जो आपको लिखने, जवाब देने, सारांश करने और कंटेंट जेनरेट करने में मदद करती है। आप सब्सक्रिप्शन के लिए भुगतान नहीं करते — आप केवल उसके लिए भुगतान करते हैं जो आप उपयोग करते हैं, AI क्रेडिट का उपयोग करके।' },
      { q: 'बिलिंग कैसे काम करती है?', a: 'आप AI क्रेडिट खरीदते हैं। क्रेडिट वास्तविक उपयोग के आधार पर खर्च होते हैं: इनपुट की लंबाई, आउटपुट का आकार और एक्शन का प्रकार। क्रेडिट कभी समाप्त नहीं होते।' },
      { q: 'AI क्रेडिट क्या हैं?', a: 'AI क्रेडिट एक आंतरिक इकाई है जो AI उपयोग को मापने के लिए उपयोग की जाती है। वे उपयोग-आधारित, गैर-हस्तांतरणीय, गैर-वापसी योग्य हैं और क्रिप्टोकरेंसी नहीं हैं।' },
      { q: 'सर्विस फीस क्यों है?', a: 'प्रत्येक खरीद में एक निश्चित सर्विस फीस शामिल है जो कवर करती है: इंफ्रास्ट्रक्चर, सुरक्षा, भुगतान प्रोसेसिंग और प्लेटफॉर्म रखरखाव।' },
      { q: 'मुझे अपनी खरीद के लिए कितने क्रेडिट मिलेंगे?', a: 'क्रेडिट की गणना सर्विस फीस को छोड़कर आपकी खरीद के USD मूल्य के आधार पर की जाती है। उदाहरण: $7.49 खरीद − $0.49 सर्विस फीस = $7.00 क्रेडिट में जाता है = 700,000 AI क्रेडिट।' },
      { q: 'क्रेडिट उपयोग क्यों भिन्न हो सकता है?', a: 'क्रेडिट उपयोग इस पर निर्भर करता है: आप कितना टेक्स्ट सबमिट करते हैं, AI रिस्पॉन्स कितना लंबा है, और किस प्रकार की एक्शन चुनी गई है।' },
      { q: 'लंबे जवाब भागों में क्यों जेनरेट होते हैं?', a: 'सेवा को तेज़, किफायती और उचित रखने के लिए: लंबे परिणाम चरण दर चरण जेनरेट होते हैं, और प्रत्येक "जारी रखें" एक नई एक्शन के रूप में गिना जाता है।' },
      { q: 'क्या क्रेडिट कभी समाप्त होते हैं?', a: 'नहीं। क्रेडिट कभी समाप्त नहीं होते और उपयोग होने तक आपके खाते में रहते हैं।' },
      { q: 'क्या कोई फ्री ट्रायल है?', a: 'हां। नए उपयोगकर्ताओं को सेवा आज़माने के लिए 1,000 मुफ्त क्रेडिट मिलते हैं।' },
      { q: 'रेफरल बोनस कैसे काम करता है?', a: 'आपको रेफरल बोनस तभी मिलता है जब आपका आमंत्रित उपयोगकर्ता खरीदारी करता है।' },
      { q: 'क्या मुझे रिफंड मिल सकता है?', a: 'नहीं। सभी खरीदारी अंतिम और गैर-वापसी योग्य हैं। कृपया खरीदने से पहले मुफ्त क्रेडिट से सेवा का परीक्षण करें।' },
      { q: 'अगर मैं ज़रूरत से ज़्यादा क्रिप्टो भेजूं तो क्या होगा?', a: 'क्रेडिट प्राप्त राशि के आधार पर जोड़े जाएंगे, अतिरिक्त राशि वापस नहीं की जाएगी।' },
      { q: 'अगर मैं ज़रूरत से कम क्रिप्टो भेजूं तो क्या होगा?', a: 'क्रेडिट नहीं जोड़े जाएंगे, लेनदेन को अंडरपेड के रूप में चिह्नित किया जाएगा।' },
      { q: 'क्रिप्टो कीमतों की गणना कैसे होती है?', a: 'सभी कीमतें USD में सेट हैं। USDT या TON से भुगतान करते समय मौजूदा विनिमय दर पर क्रिप्टो राशि की गणना की जाती है।' },
      { q: 'क्या मैं VPN या मल्टीपल अकाउंट्स का उपयोग कर सकता हूं?', a: 'VPN, प्रॉक्सी या मल्टीपल अकाउंट्स का उपयोग मुफ्त क्रेडिट, रेफरल बोनस और कुछ फीचर्स तक पहुंच सीमित कर सकता है।' },
      { q: 'क्या यह सब्सक्रिप्शन है?', a: 'नहीं। कोई सब्सक्रिप्शन, ऑटो-रिन्यूअल या आवर्ती शुल्क नहीं है। आप एक बार भुगतान करते हैं और जब चाहें अपने क्रेडिट का उपयोग करते हैं।' },
      { q: 'क्या आप मेरा कंटेंट स्टोर करते हैं?', a: 'आपका कंटेंट केवल परिणाम जेनरेट करने के लिए उपयोग किया जाता है। हम उपयोगकर्ता डेटा या जेनरेटेड कंटेंट नहीं बेचते।' },
      { q: 'यह सिस्टम उचित क्यों है?', a: 'क्योंकि: आप केवल वास्तविक उपयोग के लिए भुगतान करते हैं, क्रेडिट समाप्त नहीं होते, कोई छिपी सब्सक्रिप्शन नहीं है, और बिलिंग पारदर्शी है।' }
    ]
  },
  ID: {
    title: 'Pertanyaan yang Sering Diajukan',
    subtitle: 'Semua yang perlu Anda ketahui',
    items: [
      { q: 'Apa layanan ini?', a: 'Ini adalah layanan AI berbasis penggunaan yang membantu Anda menulis, membalas, meringkas, menjelaskan, dan menghasilkan konten. Anda tidak membayar langganan — Anda hanya membayar apa yang Anda gunakan, menggunakan Kredit AI.' },
      { q: 'Bagaimana penagihan bekerja?', a: 'Anda membeli Kredit AI. Kredit dikonsumsi berdasarkan penggunaan aktual, tergantung pada: panjang input, ukuran output, dan jenis tindakan. Kredit tidak kedaluwarsa.' },
      { q: 'Apa itu Kredit AI?', a: 'Kredit AI adalah unit internal yang digunakan untuk mengukur penggunaan AI. Mereka berbasis penggunaan, tidak dapat ditransfer, tidak dapat dikembalikan, dan bukan cryptocurrency.' },
      { q: 'Mengapa ada biaya layanan?', a: 'Setiap pembelian termasuk biaya layanan tetap yang mencakup: infrastruktur, keamanan, pemrosesan pembayaran, dan pemeliharaan platform.' },
      { q: 'Berapa kredit yang saya dapatkan untuk pembelian saya?', a: 'Kredit dihitung berdasarkan nilai USD pembelian Anda, tidak termasuk biaya layanan. Contoh: pembelian $7,49 − biaya layanan $0,49 = $7,00 menjadi kredit = 700.000 Kredit AI.' },
      { q: 'Mengapa penggunaan kredit bisa bervariasi?', a: 'Penggunaan kredit tergantung pada: berapa banyak teks yang Anda kirim, seberapa panjang respons AI, dan jenis tindakan yang dipilih.' },
      { q: 'Mengapa jawaban panjang dihasilkan dalam bagian?', a: 'Untuk menjaga layanan tetap cepat, terjangkau, dan adil: hasil panjang dihasilkan langkah demi langkah, dan setiap "Lanjutkan" dihitung sebagai tindakan baru.' },
      { q: 'Apakah kredit pernah kedaluwarsa?', a: 'Tidak. Kredit tidak pernah kedaluwarsa dan tetap di akun Anda sampai digunakan.' },
      { q: 'Apakah ada uji coba gratis?', a: 'Ya. Pengguna baru menerima 1.000 kredit gratis untuk mencoba layanan.' },
      { q: 'Bagaimana bonus referral bekerja?', a: 'Anda menerima bonus referral hanya jika pengguna yang diundang melakukan pembelian.' },
      { q: 'Bisakah saya mendapat pengembalian dana?', a: 'Tidak. Semua pembelian bersifat final dan tidak dapat dikembalikan. Silakan gunakan kredit gratis untuk menguji layanan sebelum membeli.' },
      { q: 'Apa yang terjadi jika saya mengirim lebih banyak kripto dari yang diperlukan?', a: 'Kredit dihitung berdasarkan jumlah aktual yang diterima, kelebihan dana tidak dikembalikan.' },
      { q: 'Apa yang terjadi jika saya mengirim lebih sedikit kripto dari yang diperlukan?', a: 'Kredit tidak ditambahkan, transaksi ditandai sebagai kurang bayar.' },
      { q: 'Bagaimana harga kripto dihitung?', a: 'Semua harga ditetapkan dalam USD. Saat membayar dengan USDT atau TON, jumlah kripto dihitung pada kurs saat ini.' },
      { q: 'Bisakah saya menggunakan VPN atau beberapa akun?', a: 'Menggunakan VPN, proxy, atau beberapa akun dapat membatasi akses ke kredit gratis, bonus referral, dan fitur tertentu.' },
      { q: 'Apakah ini langganan?', a: 'Tidak. Tidak ada langganan, perpanjangan otomatis, atau biaya berulang. Anda membayar sekali dan menggunakan kredit kapan saja.' },
      { q: 'Apakah Anda menyimpan konten saya?', a: 'Konten Anda hanya digunakan untuk menghasilkan hasil. Kami tidak menjual data pengguna atau konten yang dihasilkan.' },
      { q: 'Mengapa sistem ini adil?', a: 'Karena: Anda hanya membayar untuk penggunaan aktual, kredit tidak kedaluwarsa, tidak ada langganan tersembunyi, dan penagihan transparan dan konsisten.' }
    ]
  },
  PH: {
    title: 'Mga Madalas Itanong',
    subtitle: 'Lahat ng kailangan mong malaman',
    items: [
      { q: 'Ano ang serbisyong ito?', a: 'Ito ay isang serbisyo ng AI na nakabatay sa paggamit na tumutulong sa iyo na magsulat, tumugon, mag-summarize, magpaliwanag, at gumawa ng content. Hindi ka nagbabayad ng subscription — nagbabayad ka lang para sa ginagamit mo, gamit ang AI Credits.' },
      { q: 'Paano gumagana ang billing?', a: 'Bumibili ka ng AI Credits. Ang mga credits ay ginagamit batay sa aktwal na paggamit, depende sa: haba ng input, laki ng output, at uri ng aksyon. Hindi nag-e-expire ang mga credits.' },
      { q: 'Ano ang AI Credits?', a: 'Ang AI Credits ay isang internal na unit na ginagamit upang sukatin ang paggamit ng AI. Sila ay nakabatay sa paggamit, hindi maililipat, hindi maibabalik, at hindi cryptocurrency.' },
      { q: 'Bakit may service fee?', a: 'Ang bawat pagbili ay may kasamang fixed na service fee na sumasaklaw sa: infrastructure, security, payment processing, at platform maintenance.' },
      { q: 'Ilang credits ang makukuha ko sa aking pagbili?', a: 'Ang mga credits ay kinakalkula batay sa USD value ng iyong pagbili, hindi kasama ang service fee. Halimbawa: $7.49 na pagbili − $0.49 service fee = $7.00 napupunta sa credits = 700,000 AI Credits.' },
      { q: 'Bakit maaaring mag-iba ang paggamit ng credits?', a: 'Ang paggamit ng credits ay depende sa: dami ng text na iyong isinumite, gaano kahaba ang AI response, at uri ng aksyon na napili.' },
      { q: 'Bakit ang mahabang sagot ay ginagawa sa mga bahagi?', a: 'Para mapanatiling mabilis, abot-kaya, at patas ang serbisyo: ang mahabang resulta ay ginagawa nang hakbang-hakbang, at ang bawat "Continue" ay binibilang bilang bagong aksyon.' },
      { q: 'Nag-e-expire ba ang mga credits?', a: 'Hindi. Hindi kailanman nag-e-expire ang mga credits at nananatili sa iyong account hanggang magamit.' },
      { q: 'May libreng trial ba?', a: 'Oo. Ang mga bagong user ay nakakatanggap ng 1,000 libreng credits upang subukan ang serbisyo.' },
      { q: 'Paano gumagana ang referral bonus?', a: 'Nakakatanggap ka ng referral bonus kung ang iyong inimbitahang user ay bumili.' },
      { q: 'Maaari ba akong humingi ng refund?', a: 'Hindi. Lahat ng pagbili ay pinal at hindi maibabalik. Mangyaring gamitin ang libreng credits upang subukan ang serbisyo bago bumili.' },
      { q: 'Ano ang mangyayari kung magpadala ako ng mas maraming crypto kaysa sa kinakailangan?', a: 'Ang mga credits ay kinakalkula batay sa aktwal na halaga na natanggap, ang sobrang pondo ay hindi ibabalik.' },
      { q: 'Ano ang mangyayari kung magpadala ako ng mas kaunting crypto kaysa sa kinakailangan?', a: 'Hindi maidadagdag ang mga credits, ang transaksyon ay mamarkahan bilang underpaid.' },
      { q: 'Paano kinakalkula ang mga presyo ng crypto?', a: 'Lahat ng presyo ay nakatakda sa USD. Kapag nagbabayad gamit ang USDT o TON, ang halaga ng crypto ay kinakalkula sa kasalukuyang exchange rate.' },
      { q: 'Maaari ba akong gumamit ng VPN o maraming account?', a: 'Ang paggamit ng VPN, proxy, o maraming account ay maaaring maglimita ng access sa libreng credits, referral bonus, at ilang feature.' },
      { q: 'Ito ba ay subscription?', a: 'Hindi. Walang subscription, auto-renewal, o recurring charges. Nagbabayad ka nang isang beses at ginagamit ang iyong credits kahit kailan mo gusto.' },
      { q: 'Iniimbak ba ninyo ang aking content?', a: 'Ang iyong content ay ginagamit lamang upang gumawa ng mga resulta. Hindi namin ibinebenta ang data ng user o ang nagawang content.' },
      { q: 'Bakit patas ang sistemang ito?', a: 'Dahil: nagbabayad ka lang para sa aktwal na paggamit, hindi nag-e-expire ang mga credits, walang nakatagong subscription, at transparent at consistent ang billing.' }
    ]
  }
};

export default function FAQ({ currentLang }: { currentLang: string }) {
  const data = faqData[currentLang] || faqData.EN;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            {data.title}
          </h2>
          <p className="text-xl text-gray-400">
            {data.subtitle}
          </p>
        </div>

        <div className="space-y-3">
          {data.items.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-900/70 transition-colors"
              >
                <span className="text-base font-medium text-white pr-4">
                  {faq.q}
                </span>
                <ChevronDown 
                  size={20} 
                  className={`text-yellow-500 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <div className={`transition-all duration-300 ease-in-out ${
                openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
              } overflow-hidden`}>
                <p className="px-5 pb-5 text-gray-400 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}