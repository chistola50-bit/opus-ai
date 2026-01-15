'use client';

import { translations } from '@/lib/translations';
import { 
  MessageSquare, 
  CheckCircle, 
  RefreshCw, 
  FileText, 
  User, 
  AlignLeft, 
  Video, 
  Lightbulb 
} from 'lucide-react';

export default function Tools({ currentLang }: { currentLang: string }) {
  const t = translations[currentLang as keyof typeof translations];

  const tools = [
    { icon: MessageSquare, key: 'reply', color: 'text-blue-400' },
    { icon: CheckCircle, key: 'fix', color: 'text-green-400' },
    { icon: RefreshCw, key: 'rewrite', color: 'text-purple-400' },
    { icon: FileText, key: 'proposal', color: 'text-yellow-400' },
    { icon: User, key: 'cv', color: 'text-pink-400' },
    { icon: AlignLeft, key: 'summarize', color: 'text-cyan-400' },
    { icon: Video, key: 'video', color: 'text-red-400' },
    { icon: Lightbulb, key: 'ideas', color: 'text-orange-400' }
  ];

  return (
    <section id="tools" className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            {t.tools.title}
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {t.tools.subtitle}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <div
                key={tool.key}
                className="group bg-gray-900/50 border border-yellow-500/20 rounded-xl p-6 hover:border-yellow-500/60 hover:bg-gray-900/80 transition-all duration-300 cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${tool.color}`}>
                  <IconComponent size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {(t.tools as any)[tool.key].title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {(t.tools as any)[tool.key].text}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}