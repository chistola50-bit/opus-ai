'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MessageSquare, 
  CheckCircle, 
  RefreshCw, 
  FileText, 
  User, 
  AlignLeft, 
  Video, 
  Lightbulb,
  CreditCard,
  LogOut,
  Coins,
  Copy,
  Check,
  Info,
  Sparkles,
  Zap,
  TrendingUp,
  Users,
  Gift
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import LanguageSelector from '@/components/LanguageSelector';
import { signOut } from 'next-auth/react';

const ioLanguages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'id', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'tl', name: 'Filipino', flag: '🇵🇭' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

const ui: { [key: string]: {
  yourText: string;
  result: string;
  generate: string;
  generating: string;
  resultPlaceholder: string;
  inputLang: string;
  outputLang: string;
  buyCredits: string;
  copied: string;
  copy: string;
  creditsUsed: string;
  estimated: string;
  actual: string;
  saved: string;
  inputProcessing: string;
  outputGeneration: string;
  total: string;
  yourBalance: string;
  estimatedCost: string;
  characters: string;
  referrals: string;
  earnCredits: string;
}} = {
  EN: {
    yourText: 'Your Text',
    result: 'Result',
    generate: 'Generate',
    generating: 'Generating...',
    resultPlaceholder: 'Result will appear here...',
    inputLang: 'Input Language',
    outputLang: 'Output Language',
    buyCredits: 'Buy Credits',
    copied: 'Copied!',
    copy: 'Copy',
    creditsUsed: 'Credits Used',
    estimated: 'Estimated max',
    actual: 'Actually used',
    saved: 'You saved',
    inputProcessing: 'Reading your text',
    outputGeneration: 'Generating response',
    total: 'Total',
    yourBalance: 'Your balance',
    estimatedCost: 'Estimated cost',
    characters: 'characters',
    referrals: 'Referrals',
    earnCredits: 'Earn 10K credits'
  },
  RU: {
    yourText: 'Ваш текст',
    result: 'Результат',
    generate: 'Сгенерировать',
    generating: 'Генерация...',
    resultPlaceholder: 'Результат появится здесь...',
    inputLang: 'Язык ввода',
    outputLang: 'Язык вывода',
    buyCredits: 'Купить кредиты',
    copied: 'Скопировано!',
    copy: 'Копировать',
    creditsUsed: 'Использовано кредитов',
    estimated: 'Максимум',
    actual: 'Списано',
    saved: 'Сэкономлено',
    inputProcessing: 'Чтение вашего текста',
    outputGeneration: 'Генерация ответа',
    total: 'Итого',
    yourBalance: 'Ваш баланс',
    estimatedCost: 'Примерная стоимость',
    characters: 'символов',
    referrals: 'Рефералы',
    earnCredits: 'Получи 10К кредитов'
  },
  PT: {
    yourText: 'Seu Texto',
    result: 'Resultado',
    generate: 'Gerar',
    generating: 'Gerando...',
    resultPlaceholder: 'O resultado aparecerá aqui...',
    inputLang: 'Idioma de Entrada',
    outputLang: 'Idioma de Saída',
    buyCredits: 'Comprar Créditos',
    copied: 'Copiado!',
    copy: 'Copiar',
    creditsUsed: 'Créditos Usados',
    estimated: 'Máximo estimado',
    actual: 'Usado',
    saved: 'Economizado',
    inputProcessing: 'Lendo seu texto',
    outputGeneration: 'Gerando resposta',
    total: 'Total',
    yourBalance: 'Seu saldo',
    estimatedCost: 'Custo estimado',
    characters: 'caracteres',
    referrals: 'Indicações',
    earnCredits: 'Ganhe 10K créditos'
  },
  HI: {
    yourText: 'आपका टेक्स्ट',
    result: 'परिणाम',
    generate: 'जनरेट करें',
    generating: 'जनरेट हो रहा है...',
    resultPlaceholder: 'परिणाम यहाँ दिखेगा...',
    inputLang: 'इनपुट भाषा',
    outputLang: 'आउटपुट भाषा',
    buyCredits: 'क्रेडिट खरीदें',
    copied: 'कॉपी हो गया!',
    copy: 'कॉपी करें',
    creditsUsed: 'क्रेडिट इस्तेमाल',
    estimated: 'अनुमानित',
    actual: 'वास्तविक',
    saved: 'बचाया',
    inputProcessing: 'टेक्स्ट पढ़ना',
    outputGeneration: 'जवाब बनाना',
    total: 'कुल',
    yourBalance: 'आपका बैलेंस',
    estimatedCost: 'अनुमानित लागत',
    characters: 'वर्ण',
    referrals: 'रेफरल',
    earnCredits: '10K क्रेडिट पाएं'
  },
  ID: {
    yourText: 'Teks Anda',
    result: 'Hasil',
    generate: 'Hasilkan',
    generating: 'Menghasilkan...',
    resultPlaceholder: 'Hasil akan muncul di sini...',
    inputLang: 'Bahasa Input',
    outputLang: 'Bahasa Output',
    buyCredits: 'Beli Kredit',
    copied: 'Disalin!',
    copy: 'Salin',
    creditsUsed: 'Kredit Digunakan',
    estimated: 'Estimasi maks',
    actual: 'Digunakan',
    saved: 'Dihemat',
    inputProcessing: 'Membaca teks',
    outputGeneration: 'Membuat respons',
    total: 'Total',
    yourBalance: 'Saldo Anda',
    estimatedCost: 'Biaya estimasi',
    characters: 'karakter',
    referrals: 'Referral',
    earnCredits: 'Dapatkan 10K kredit'
  },
  PH: {
    yourText: 'Iyong Teksto',
    result: 'Resulta',
    generate: 'Gumawa',
    generating: 'Gumagawa...',
    resultPlaceholder: 'Ang resulta ay lalabas dito...',
    inputLang: 'Input na Wika',
    outputLang: 'Output na Wika',
    buyCredits: 'Bumili ng Credits',
    copied: 'Nakopya!',
    copy: 'Kopyahin',
    creditsUsed: 'Ginamit na Credits',
    estimated: 'Tinatantya',
    actual: 'Aktwal',
    saved: 'Na-save',
    inputProcessing: 'Binabasa ang teksto',
    outputGeneration: 'Gumagawa ng sagot',
    total: 'Kabuuan',
    yourBalance: 'Iyong balanse',
    estimatedCost: 'Tinatayang gastos',
    characters: 'mga character',
    referrals: 'Mga Referral',
    earnCredits: 'Makakuha ng 10K credits'
  },
  ES: {
    yourText: 'Tu Texto',
    result: 'Resultado',
    generate: 'Generar',
    generating: 'Generando...',
    resultPlaceholder: 'El resultado aparecerá aquí...',
    inputLang: 'Idioma de Entrada',
    outputLang: 'Idioma de Salida',
    buyCredits: 'Comprar Créditos',
    copied: '¡Copiado!',
    copy: 'Copiar',
    creditsUsed: 'Créditos Usados',
    estimated: 'Máximo estimado',
    actual: 'Usado',
    saved: 'Ahorrado',
    inputProcessing: 'Leyendo tu texto',
    outputGeneration: 'Generando respuesta',
    total: 'Total',
    yourBalance: 'Tu saldo',
    estimatedCost: 'Costo estimado',
    characters: 'caracteres',
    referrals: 'Referidos',
    earnCredits: 'Gana 10K créditos'
  },
  FR: {
    yourText: 'Votre Texte',
    result: 'Résultat',
    generate: 'Générer',
    generating: 'Génération...',
    resultPlaceholder: 'Le résultat apparaîtra ici...',
    inputLang: 'Langue d\'entrée',
    outputLang: 'Langue de sortie',
    buyCredits: 'Acheter des Crédits',
    copied: 'Copié!',
    copy: 'Copier',
    creditsUsed: 'Crédits Utilisés',
    estimated: 'Maximum estimé',
    actual: 'Utilisé',
    saved: 'Économisé',
    inputProcessing: 'Lecture de votre texte',
    outputGeneration: 'Génération de la réponse',
    total: 'Total',
    yourBalance: 'Votre solde',
    estimatedCost: 'Coût estimé',
    characters: 'caractères',
    referrals: 'Parrainages',
    earnCredits: 'Gagnez 10K crédits'
  },
  DE: {
    yourText: 'Ihr Text',
    result: 'Ergebnis',
    generate: 'Generieren',
    generating: 'Generierung...',
    resultPlaceholder: 'Das Ergebnis erscheint hier...',
    inputLang: 'Eingabesprache',
    outputLang: 'Ausgabesprache',
    buyCredits: 'Credits Kaufen',
    copied: 'Kopiert!',
    copy: 'Kopieren',
    creditsUsed: 'Verwendete Credits',
    estimated: 'Geschätztes Maximum',
    actual: 'Verwendet',
    saved: 'Gespart',
    inputProcessing: 'Text lesen',
    outputGeneration: 'Antwort generieren',
    total: 'Gesamt',
    yourBalance: 'Ihr Guthaben',
    estimatedCost: 'Geschätzte Kosten',
    characters: 'Zeichen',
    referrals: 'Empfehlungen',
    earnCredits: '10K Credits verdienen'
  },
  AR: {
    yourText: 'النص الخاص بك',
    result: 'النتيجة',
    generate: 'توليد',
    generating: 'جاري التوليد...',
    resultPlaceholder: 'ستظهر النتيجة هنا...',
    inputLang: 'لغة الإدخال',
    outputLang: 'لغة الإخراج',
    buyCredits: 'شراء رصيد',
    copied: 'تم النسخ!',
    copy: 'نسخ',
    creditsUsed: 'الرصيد المستخدم',
    estimated: 'الحد الأقصى المقدر',
    actual: 'المستخدم',
    saved: 'الموفر',
    inputProcessing: 'قراءة النص',
    outputGeneration: 'توليد الرد',
    total: 'المجموع',
    yourBalance: 'رصيدك',
    estimatedCost: 'التكلفة المقدرة',
    characters: 'حرف',
    referrals: 'الإحالات',
    earnCredits: 'اكسب 10 آلاف رصيد'
  }
};

const toolNames: { [key: string]: { [key: string]: string } } = {
  reply: { EN: 'Reply to Client', RU: 'Ответ клиенту', PT: 'Responder Cliente', HI: 'क्लाइंट को जवाब', ID: 'Balas Klien', PH: 'Sagutin ang Kliyente', ES: 'Responder al Cliente', FR: 'Répondre au Client', DE: 'Kunden antworten', AR: 'الرد على العميل' },
  fix: { EN: 'Fix My Text', RU: 'Исправить текст', PT: 'Corrigir Texto', HI: 'टेक्स्ट सुधारें', ID: 'Perbaiki Teks', PH: 'Ayusin ang Teksto', ES: 'Corregir Texto', FR: 'Corriger le Texte', DE: 'Text korrigieren', AR: 'تصحيح النص' },
  rewrite: { EN: 'Rewrite Text', RU: 'Переписать текст', PT: 'Reescrever Texto', HI: 'टेक्स्ट फिर से लिखें', ID: 'Tulis Ulang Teks', PH: 'Isulat Muli', ES: 'Reescribir Texto', FR: 'Réécrire le Texte', DE: 'Text umschreiben', AR: 'إعادة كتابة النص' },
  proposal: { EN: 'Write Proposal', RU: 'Написать предложение', PT: 'Escrever Proposta', HI: 'प्रपोज़ल लिखें', ID: 'Tulis Proposal', PH: 'Sumulat ng Proposal', ES: 'Escribir Propuesta', FR: 'Écrire une Proposition', DE: 'Angebot schreiben', AR: 'كتابة عرض' },
  cv: { EN: 'Create CV', RU: 'Создать резюме', PT: 'Criar Currículo', HI: 'CV बनाएं', ID: 'Buat CV', PH: 'Gumawa ng CV', ES: 'Crear CV', FR: 'Créer un CV', DE: 'Lebenslauf erstellen', AR: 'إنشاء سيرة ذاتية' },
  summarize: { EN: 'Summarize', RU: 'Сократить', PT: 'Resumir', HI: 'सारांश', ID: 'Ringkas', PH: 'Ibuod', ES: 'Resumir', FR: 'Résumer', DE: 'Zusammenfassen', AR: 'تلخيص' },
  video: { EN: 'Video Script', RU: 'Сценарий видео', PT: 'Roteiro de Vídeo', HI: 'वीडियो स्क्रिप्ट', ID: 'Skrip Video', PH: 'Video Script', ES: 'Guión de Video', FR: 'Script Vidéo', DE: 'Video-Skript', AR: 'سيناريو فيديو' },
  ideas: { EN: 'Content Ideas', RU: 'Идеи контента', PT: 'Ideias de Conteúdo', HI: 'कंटेंट आइडियाज़', ID: 'Ide Konten', PH: 'Mga Ideya', ES: 'Ideas de Contenido', FR: 'Idées de Contenu', DE: 'Content-Ideen', AR: 'أفكار المحتوى' }
};

const toolDescriptions: { [key: string]: { [key: string]: string } } = {
  reply: { EN: 'Write a professional, friendly reply', RU: 'Напишет профессиональный, дружелюбный ответ', PT: 'Escreva uma resposta profissional', HI: 'प्रोफेशनल जवाब लिखें', ID: 'Tulis balasan profesional', PH: 'Sumulat ng propesyonal na sagot', ES: 'Escribir una respuesta profesional', FR: 'Écrire une réponse professionnelle', DE: 'Eine professionelle Antwort schreiben', AR: 'كتابة رد احترافي' },
  fix: { EN: 'Fix grammar and make it natural', RU: 'Исправит грамматику и сделает текст естественным', PT: 'Corrija gramática e torne natural', HI: 'ग्रामर सुधारें', ID: 'Perbaiki tata bahasa', PH: 'Ayusin ang grammar', ES: 'Corregir gramática y hacerlo natural', FR: 'Corriger la grammaire et rendre naturel', DE: 'Grammatik korrigieren und natürlich machen', AR: 'تصحيح القواعد وجعله طبيعياً' },
  rewrite: { EN: 'Rewrite to sound more professional', RU: 'Перепишет более профессионально', PT: 'Reescreva profissionalmente', HI: 'प्रोफेशनल तरीके से लिखें', ID: 'Tulis ulang lebih profesional', PH: 'Isulat muli ng propesyonal', ES: 'Reescribir de forma más profesional', FR: 'Réécrire de façon plus professionnelle', DE: 'Professioneller umschreiben', AR: 'إعادة الكتابة باحترافية' },
  proposal: { EN: 'Create a winning proposal', RU: 'Создаст выигрышное предложение', PT: 'Crie uma proposta vencedora', HI: 'विनिंग प्रपोज़ल बनाएं', ID: 'Buat proposal pemenang', PH: 'Gumawa ng panalong proposal', ES: 'Crear una propuesta ganadora', FR: 'Créer une proposition gagnante', DE: 'Ein erfolgreiches Angebot erstellen', AR: 'إنشاء عرض فائز' },
  cv: { EN: 'Generate a professional CV', RU: 'Сгенерирует профессиональное резюме', PT: 'Gere um currículo profissional', HI: 'प्रोफेशनल CV बनाएं', ID: 'Buat CV profesional', PH: 'Gumawa ng propesyonal na CV', ES: 'Generar un CV profesional', FR: 'Générer un CV professionnel', DE: 'Einen professionellen Lebenslauf erstellen', AR: 'إنشاء سيرة ذاتية احترافية' },
  summarize: { EN: 'Get key points from long text', RU: 'Выделит ключевые моменты', PT: 'Obtenha pontos-chave', HI: 'मुख्य बिंदु निकालें', ID: 'Dapatkan poin penting', PH: 'Kumuha ng mga pangunahing punto', ES: 'Obtener puntos clave del texto largo', FR: 'Obtenir les points clés d\'un long texte', DE: 'Wichtige Punkte aus langem Text extrahieren', AR: 'الحصول على النقاط الرئيسية' },
  video: { EN: 'Write an engaging video script', RU: 'Напишет увлекательный сценарий', PT: 'Escreva um roteiro envolvente', HI: 'आकर्षक स्क्रिप्ट लिखें', ID: 'Tulis skrip menarik', PH: 'Sumulat ng nakaka-engganyong script', ES: 'Escribir un guión de video atractivo', FR: 'Écrire un script vidéo engageant', DE: 'Ein ansprechendes Video-Skript schreiben', AR: 'كتابة سيناريو فيديو جذاب' },
  ideas: { EN: 'Generate fresh content ideas', RU: 'Сгенерирует свежие идеи', PT: 'Gere ideias frescas', HI: 'फ्रेश आइडियाज़ जनरेट करें', ID: 'Hasilkan ide segar', PH: 'Gumawa ng sariwang ideya', ES: 'Generar ideas de contenido frescas', FR: 'Générer des idées de contenu fraîches', DE: 'Frische Content-Ideen generieren', AR: 'توليد أفكار محتوى جديدة' }
};

const toolPlaceholders: { [key: string]: { [key: string]: string } } = {
  reply: { EN: 'Paste the client message you want to reply to...', RU: 'Вставьте сообщение клиента...', PT: 'Cole a mensagem do cliente...', HI: 'क्लाइंट का मैसेज पेस्ट करें...', ID: 'Tempel pesan klien...', PH: 'I-paste ang mensahe ng kliyente...', ES: 'Pega el mensaje del cliente...', FR: 'Collez le message du client...', DE: 'Fügen Sie die Kundennachricht ein...', AR: 'الصق رسالة العميل...' },
  fix: { EN: 'Paste text with errors to fix...', RU: 'Вставьте текст с ошибками...', PT: 'Cole o texto com erros...', HI: 'गलतियों वाला टेक्स्ट पेस्ट करें...', ID: 'Tempel teks dengan kesalahan...', PH: 'I-paste ang teksto na may error...', ES: 'Pega el texto con errores...', FR: 'Collez le texte avec des erreurs...', DE: 'Fügen Sie den fehlerhaften Text ein...', AR: 'الصق النص الذي به أخطاء...' },
  rewrite: { EN: 'Paste text to rewrite...', RU: 'Вставьте текст для улучшения...', PT: 'Cole o texto para reescrever...', HI: 'टेक्स्ट पेस्ट करें...', ID: 'Tempel teks untuk ditulis ulang...', PH: 'I-paste ang teksto...', ES: 'Pega el texto para reescribir...', FR: 'Collez le texte à réécrire...', DE: 'Fügen Sie den Text zum Umschreiben ein...', AR: 'الصق النص لإعادة كتابته...' },
  proposal: { EN: 'Paste the job description...', RU: 'Вставьте описание вакансии...', PT: 'Cole a descrição do trabalho...', HI: 'जॉब डिस्क्रिप्शन पेस्ट करें...', ID: 'Tempel deskripsi pekerjaan...', PH: 'I-paste ang job description...', ES: 'Pega la descripción del trabajo...', FR: 'Collez la description du poste...', DE: 'Fügen Sie die Stellenbeschreibung ein...', AR: 'الصق وصف الوظيفة...' },
  cv: { EN: 'Describe your experience and skills...', RU: 'Опишите свой опыт и навыки...', PT: 'Descreva sua experiência...', HI: 'अपना अनुभव बताएं...', ID: 'Jelaskan pengalaman Anda...', PH: 'Ilarawan ang iyong karanasan...', ES: 'Describe tu experiencia y habilidades...', FR: 'Décrivez votre expérience et compétences...', DE: 'Beschreiben Sie Ihre Erfahrung und Fähigkeiten...', AR: 'صف خبرتك ومهاراتك...' },
  summarize: { EN: 'Paste long text to summarize...', RU: 'Вставьте длинный текст...', PT: 'Cole o texto longo...', HI: 'लंबा टेक्स्ट पेस्ट करें...', ID: 'Tempel teks panjang...', PH: 'I-paste ang mahabang teksto...', ES: 'Pega el texto largo para resumir...', FR: 'Collez le long texte à résumer...', DE: 'Fügen Sie den langen Text zum Zusammenfassen ein...', AR: 'الصق النص الطويل للتلخيص...' },
  video: { EN: 'Describe what your video should be about...', RU: 'Опишите тему видео...', PT: 'Descreva seu vídeo...', HI: 'वीडियो का टॉपिक बताएं...', ID: 'Jelaskan tentang video Anda...', PH: 'Ilarawan ang video mo...', ES: 'Describe de qué debería ser tu video...', FR: 'Décrivez le sujet de votre vidéo...', DE: 'Beschreiben Sie Ihr Video...', AR: 'صف موضوع الفيديو...' },
  ideas: { EN: 'Describe your niche or topic...', RU: 'Опишите вашу нишу или тему...', PT: 'Descreva seu nicho...', HI: 'अपनी niche बताएं...', ID: 'Jelaskan niche Anda...', PH: 'Ilarawan ang iyong niche...', ES: 'Describe tu nicho o tema...', FR: 'Décrivez votre niche ou sujet...', DE: 'Beschreiben Sie Ihre Nische oder Ihr Thema...', AR: 'صف مجالك أو موضوعك...' }
};

const tools = [
  { id: 'reply', icon: MessageSquare, color: 'bg-blue-500', gradient: 'from-blue-500 to-blue-600' },
  { id: 'fix', icon: CheckCircle, color: 'bg-green-500', gradient: 'from-green-500 to-green-600' },
  { id: 'rewrite', icon: RefreshCw, color: 'bg-purple-500', gradient: 'from-purple-500 to-purple-600' },
  { id: 'proposal', icon: FileText, color: 'bg-orange-500', gradient: 'from-orange-500 to-orange-600' },
  { id: 'cv', icon: User, color: 'bg-pink-500', gradient: 'from-pink-500 to-pink-600' },
  { id: 'summarize', icon: AlignLeft, color: 'bg-cyan-500', gradient: 'from-cyan-500 to-cyan-600' },
  { id: 'video', icon: Video, color: 'bg-red-500', gradient: 'from-red-500 to-red-600' },
  { id: 'ideas', icon: Lightbulb, color: 'bg-yellow-500', gradient: 'from-yellow-500 to-amber-500' },
];

interface Stats {
  estimated: number;
  actual: number;
  saved: number;
  inputCost: number;
  outputCost: number;
}

export default function DashboardPage() {
  const { lang } = useLanguage();
  const [inputLang, setInputLang] = useState('en');
  const [outputLang, setOutputLang] = useState('en');
  const [selectedTool, setSelectedTool] = useState('reply');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [credits, setCredits] = useState(0);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/user/credits')
      .then(res => res.json())
      .then(data => setCredits(data.credits || 0))
      .catch(() => {});
  }, []);

  const t = ui[lang] || ui.EN;

  const estimatedCost = Math.ceil(inputText.length * 1.5);
  const charCount = inputText.length;

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    
    setLoading(true);
    setOutputText('');
    setStats(null);
    
    const toolMap: { [key: string]: string } = {
      reply: 'reply-to-client',
      fix: 'fix-english',
      rewrite: 'rewrite',
      proposal: 'proposal',
      cv: 'resume',
      summarize: 'summarize',
      video: 'video-script',
      ideas: 'content-ideas',
    };

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: toolMap[selectedTool],
          input: inputText,
          inputLang: inputLang,
          outputLang: outputLang,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402) {
          setOutputText(`Not enough credits.\nRequired: ${data.required.toLocaleString()}\nYour balance: ${data.balance.toLocaleString()}\n\nPlease buy more credits.`);
        } else {
          setOutputText(`Error: ${data.error || 'Generation failed'}`);
        }
        return;
      }

      setOutputText(data.output);
      setCredits(data.balance);
      setStats({
        estimated: data.estimated,
        actual: data.actual,
        saved: data.saved,
        inputCost: data.inputCost || Math.round(data.actual * 0.4),
        outputCost: data.outputCost || Math.round(data.actual * 0.6),
      });
      
    } catch (error) {
      setOutputText('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen bg-black">
      
      {/* Header */}
      <header className="bg-black border-b border-gray-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-bold text-yellow-500">
                Opus
              </span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              
              <LanguageSelector />

              {/* Referral Button */}
              <Link
                href="/referral"
                className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-2 rounded-lg font-medium hover:from-purple-500 hover:to-pink-500 transition text-sm"
              >
                <Gift size={16} />
                <span>{t.earnCredits}</span>
              </Link>

              {/* Mobile Referral Button */}
              <Link
                href="/referral"
                className="sm:hidden flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 text-white p-2 rounded-lg"
              >
                <Gift size={18} />
              </Link>

              <div className="hidden sm:flex items-center gap-2 bg-gray-900 px-3 sm:px-4 py-2 rounded-lg border border-gray-800">
                <Coins size={16} className="text-yellow-500" />
                <span className="text-white font-medium text-sm">
                  {credits.toLocaleString()}
                </span>
              </div>

              <Link
                href="/dashboard/buy"
                className="flex items-center gap-2 bg-yellow-500 text-black px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-yellow-400 transition text-sm"
              >
                <CreditCard size={16} />
                <span className="hidden sm:inline">{t.buyCredits}</span>
                <span className="sm:hidden">Buy</span>
              </Link>

              <button 
                onClick={handleLogout}
                className="text-gray-400 hover:text-white transition p-2"
              >
                <LogOut size={20} />
              </button>

            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Mobile Credits & Referral */}
        <div className="sm:hidden mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 bg-gray-900 px-4 py-3 rounded-lg border border-gray-800 flex-1">
            <Coins size={18} className="text-yellow-500" />
            <span className="text-white font-medium">
              {credits.toLocaleString()}
            </span>
          </div>
        </div>
        
        {/* Tools Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3 mb-6 sm:mb-8">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const name = toolNames[tool.id][lang] || toolNames[tool.id].EN;
            const isSelected = selectedTool === tool.id;
            
            return (
              <button
                key={tool.id}
                onClick={() => {
                  setSelectedTool(tool.id);
                  setStats(null);
                  setInputText('');
                  setOutputText('');
                }}
                className={`relative flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all ${
                  isSelected
                    ? 'bg-gray-900 border-yellow-500 shadow-lg shadow-yellow-500/10'
                    : 'bg-gray-950 border-gray-900 hover:border-gray-800'
                }`}
              >
                
                <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${tool.gradient} rounded-lg sm:rounded-xl flex items-center justify-center`}>
                  <Icon size={20} className="text-white sm:w-6 sm:h-6" />
                </div>
                
                <span className="text-xs text-gray-400 font-medium text-center leading-tight line-clamp-2">
                  {name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tool Header */}
        <div className="mb-6 sm:mb-8 bg-gray-950 border border-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">
                {toolNames[selectedTool][lang] || toolNames[selectedTool].EN}
              </h1>
              <p className="text-sm sm:text-base text-gray-500">
                {toolDescriptions[selectedTool][lang] || toolDescriptions[selectedTool].EN}
              </p>
            </div>
            
            <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-2 self-start">
              <Zap size={16} className="text-yellow-500" />
              <span className="text-yellow-500 text-xs sm:text-sm font-medium">AI Powered</span>
            </div>
          </div>
        </div>

        {/* Language Selectors */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex items-center gap-2 sm:gap-3 bg-gray-950 border border-gray-900 rounded-xl px-4 py-3">
            <span className="text-gray-500 text-xs sm:text-sm font-medium whitespace-nowrap">{t.inputLang}:</span>
            <select
              value={inputLang}
              onChange={(e) => setInputLang(e.target.value)}
              className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-500 transition-all"
            >
              {ioLanguages.map((l) => (
                <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 bg-gray-950 border border-gray-900 rounded-xl px-4 py-3">
            <span className="text-gray-500 text-xs sm:text-sm font-medium whitespace-nowrap">{t.outputLang}:</span>
            <select
              value={outputLang}
              onChange={(e) => setOutputLang(e.target.value)}
              className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-500 transition-all"
            >
              {ioLanguages.map((l) => (
                <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Input/Output Grid */}
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          
          {/* Input */}
          <div className="bg-gray-950 border border-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <label className="text-gray-400 font-semibold flex items-center gap-2 text-sm sm:text-base">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                {t.yourText}
              </label>
              {charCount > 0 && (
                <span className="text-xs text-gray-600">
                  {charCount} {t.characters}
                </span>
              )}
            </div>
            
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={toolPlaceholders[selectedTool][lang] || toolPlaceholders[selectedTool].EN}
              className="w-full h-64 sm:h-80 bg-gray-900 border border-gray-800 rounded-xl p-4 text-white text-sm sm:text-base resize-none focus:outline-none focus:border-yellow-500 transition-all placeholder:text-gray-700"
            />
            
            {/* Cost Estimate */}
            {estimatedCost > 0 && (
              <div className="mt-3 sm:mt-4 flex items-center justify-between bg-gray-900 border border-gray-800 rounded-lg px-3 sm:px-4 py-2">
                <span className="text-gray-500 text-xs sm:text-sm flex items-center gap-2">
                  <Info size={14} />
                  {t.estimatedCost}:
                </span>
                <span className="text-yellow-500 font-semibold text-sm">
                  ~{estimatedCost.toLocaleString()}
                </span>
              </div>
            )}
            
            <button
              onClick={handleGenerate}
              disabled={loading || !inputText.trim()}
              className="mt-3 sm:mt-4 w-full bg-yellow-500 text-black font-bold py-3 sm:py-4 rounded-xl hover:bg-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  {t.generating}
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  {t.generate}
                </>
              )}
            </button>
          </div>

          {/* Output */}
          <div className="space-y-4">
            <div className="bg-gray-950 border border-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <label className="text-gray-400 font-semibold flex items-center gap-2 text-sm sm:text-base">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  {t.result}
                </label>
                {outputText && !outputText.startsWith('Error') && !outputText.startsWith('Not enough') && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 sm:gap-2 text-yellow-500 text-xs sm:text-sm hover:text-yellow-400 transition-all bg-yellow-500/10 px-2 sm:px-3 py-1.5 rounded-lg"
                  >
                    {copied ? (
                      <>
                        <Check size={14} />
                        <span className="hidden sm:inline">{t.copied}</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span className="hidden sm:inline">{t.copy}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              
              <div className="w-full h-64 sm:h-80 bg-gray-900 border border-gray-800 rounded-xl p-4 overflow-y-auto custom-scrollbar">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <div className="w-12 sm:w-16 h-12 sm:h-16 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin" />
                        <Sparkles size={20} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-yellow-500 animate-pulse sm:w-6 sm:h-6" />
                      </div>
                      <span className="text-gray-500 text-xs sm:text-sm font-medium">{t.generating}</span>
                    </div>
                  </div>
                ) : outputText ? (
                  <p className="text-white whitespace-pre-wrap leading-relaxed text-sm sm:text-base">{outputText}</p>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-700 text-center text-sm">
                      {t.resultPlaceholder}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Credits Stats Card */}
            {stats && (
              <div className="bg-gray-950 border border-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 text-yellow-500 font-bold mb-4 sm:mb-6">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-500/10 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <TrendingUp size={18} className="sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-base sm:text-lg">{t.creditsUsed}</span>
                </div>
                
                {/* Breakdown */}
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-xs sm:text-sm flex items-center gap-2">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full" />
                      {t.inputProcessing}
                    </span>
                    <span className="text-white font-semibold text-sm sm:text-base">{stats.inputCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-xs sm:text-sm flex items-center gap-2">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full" />
                      {t.outputGeneration}
                    </span>
                    <span className="text-white font-semibold text-sm sm:text-base">{stats.outputCost.toLocaleString()}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 bg-gray-900 rounded-full overflow-hidden mb-4 sm:mb-6">
                  <div 
                    className="h-full bg-yellow-500 transition-all duration-500"
                    style={{ width: `${(stats.actual / stats.estimated) * 100}%` }}
                  />
                </div>

                {/* Total */}
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 mb-3 sm:mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold text-sm sm:text-base">{t.total}</span>
                    <span className="text-yellow-500 font-bold text-lg sm:text-xl">
                      {stats.actual.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Saved */}
                {stats.saved > 0 && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 mb-3 sm:mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-green-400 text-xs sm:text-sm font-medium flex items-center gap-2">
                        <Sparkles size={14} />
                        {t.saved}
                      </span>
                      <span className="text-green-400 font-bold text-base sm:text-lg">
                        {stats.saved.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Balance */}
                <div className="pt-3 sm:pt-4 border-t border-gray-900 flex justify-between items-center">
                  <span className="text-gray-500 text-xs sm:text-sm">{t.yourBalance}</span>
                  <span className="text-white font-bold text-base sm:text-lg">
                    {credits.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

          </div>
        </div>

      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #111111;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1f1f1f;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #2a2a2a;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}