'use client';

import Link from 'next/link';
import {
  Sparkles,
  FileText,
  Shield,
  Wand2,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

const tools = [
  {
    id: 'humanizer',
    name: 'Гуманизатор текста',
    description: 'Преобразуйте ИИ-сгенерированный текст в естественный человеческий стиль. Обходит все популярные AI-детекторы.',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500',
    href: '/tools/humanizer',
    features: [
      'Обход GPTZero, Originality.ai, Turnitin',
      'Сохранение смысла и структуры',
      'Настройка уровня гуманизации',
      'Поддержка длинных текстов',
    ],
    creditsPerUse: '1-5',
  },
  {
    id: 'detector',
    name: 'AI Детектор',
    description: 'Проверьте любой текст на наличие признаков ИИ-генерации. Узнайте процент вероятности перед публикацией.',
    icon: Shield,
    color: 'from-blue-500 to-cyan-500',
    href: '/tools/detector',
    features: [
      'Точность определения 95%+',
      'Детальный анализ по абзацам',
      'Рекомендации по улучшению',
      'История проверок',
    ],
    creditsPerUse: '1-3',
  },
  {
    id: 'rewriter',
    name: 'Рерайтер',
    description: 'Перепишите текст с полным сохранением смысла, но другими словами. Идеально для уникализации контента.',
    icon: FileText,
    color: 'from-green-500 to-emerald-500',
    href: '/tools/rewriter',
    features: [
      '3 режима рерайта',
      'Сохранение ключевых терминов',
      'Контроль уникальности',
      'SEO-оптимизация',
    ],
    creditsPerUse: '1-5',
  },
  {
    id: 'improver',
    name: 'Улучшатель текста',
    description: 'Улучшите стиль, грамматику и читаемость вашего текста. Сделайте контент более профессиональным.',
    icon: Wand2,
    color: 'from-orange-500 to-amber-500',
    href: '/tools/improver',
    features: [
      'Исправление грамматики',
      'Улучшение стиля',
      'Повышение читаемости',
      'Адаптация под аудиторию',
    ],
    creditsPerUse: '1-3',
  },
];

export default function ToolsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          Инструменты AI Humanizer
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Полный набор инструментов для работы с текстом. Гуманизация, проверка, рерайт и улучшение — всё в одном месте.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all group"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-start gap-4">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${tool.color} rounded-xl flex items-center justify-center flex-shrink-0`}
                >
                  <tool.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white mb-2">{tool.name}</h2>
                  <p className="text-gray-400 text-sm">{tool.description}</p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="p-6 border-b border-white/10">
              <ul className="space-y-2">
                {tool.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="p-6 flex items-center justify-between">
              <div className="text-sm text-gray-400">
                <span className="text-white font-medium">{tool.creditsPerUse}</span> кредитов за использование
              </div>
              <Link
                href={tool.href}
                className={`inline-flex items-center gap-2 bg-gradient-to-r ${tool.color} text-white font-medium px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity`}
              >
                Открыть
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}