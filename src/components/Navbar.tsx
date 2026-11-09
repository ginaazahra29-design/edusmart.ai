import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  HelpCircle,
  BarChart3,
  History,
  User,
  LayoutDashboard,
  Menu,
  X,
  ChevronDown,
  Layers,
  Share2,
  Check,
  FileText,
  Download,
} from 'lucide-react';
import { AppView, useApp } from '../context/AppContext';
import { EducationLevel } from '../types';

export const Navbar: React.FC = () => {
  const { currentView, setCurrentView, profile, updateUserProfile, currentQuizResult } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [levelDropdownOpen, setLevelDropdownOpen] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const sharedUrl = 'https://ais-pre-vdb5ab76a2eb2vv3uobsbr-572611332815.asia-east1.run.app';

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(sharedUrl);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const navItems: Array<{ id: AppView; label: string; icon: React.ReactNode; badge?: string }> = [
    { id: 'home', label: 'Beranda', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'tutor', label: 'AI Tutor', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'summarize', label: 'Rangkuman', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'quiz', label: 'Kuis AI', icon: <Layers className="w-4 h-4" /> },
    {
      id: 'evaluation',
      label: 'Hasil Evaluasi',
      icon: <BarChart3 className="w-4 h-4" />,
      badge: currentQuizResult ? `${currentQuizResult.score}` : undefined,
    },
    { id: 'history', label: 'Riwayat', icon: <History className="w-4 h-4" /> },
    { id: 'profile', label: 'Profil', icon: <User className="w-4 h-4" /> },
    { id: 'report', label: 'Laporan Proyek', icon: <FileText className="w-4 h-4" />, badge: 'DOC' },
  ];

  const educationLevels: EducationLevel[] = ['SMP', 'SMA/SMK', 'Mahasiswa'];

  const handleSelectLevel = (level: EducationLevel) => {
    updateUserProfile({ educationLevel: level });
    setLevelDropdownOpen(false);
  };

  const navigateTo = (view: AppView) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  EduSmart <span className="text-blue-600">AI</span>
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">Platform Pembelajaran Cerdas</p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer relative ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Education Level Selector & Profile Quick Icon */}
          <div className="hidden md:flex items-center gap-3">
            {/* Level Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLevelDropdownOpen(!levelDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                title="Ganti Jenjang Pendidikan"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Jenjang:</span>
                <span className="text-blue-600 font-bold">{profile.educationLevel}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {levelDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Pilih Jenjang Pelajar
                  </div>
                  {educationLevels.map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => handleSelectLevel(lvl)}
                      className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer ${
                        profile.educationLevel === lvl ? 'bg-blue-50/70 text-blue-700 font-bold' : 'text-slate-700'
                      }`}
                    >
                      <span>{lvl}</span>
                      {profile.educationLevel === lvl && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Unduh ZIP Proyek Button */}
            <a
              href="/edusmart-ai-project.zip"
              download="edusmart-ai-project.zip"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
              title="Unduh Seluruh Berkas Kode Proyek (.ZIP)"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Unduh ZIP</span>
            </a>

            {/* Bagikan Link Button */}
            <button
              onClick={handleCopyShareLink}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs ${
                copiedShare
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
              }`}
              title="Salin link publik untuk dibagikan ke teman"
            >
              {copiedShare ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Link Tersalin!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Bagikan Link</span>
                </>
              )}
            </button>

            {/* Quick Profile pill */}
            <button
              onClick={() => navigateTo('profile')}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                {profile.name.charAt(0)}
              </div>
              <span className="max-w-[90px] truncate">{profile.name}</span>
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="text-xs text-slate-500">
              Pelajar: <span className="font-bold text-slate-900">{profile.name}</span>
            </div>
            <div className="flex items-center gap-1">
              {educationLevels.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => handleSelectLevel(lvl)}
                  className={`px-2 py-1 text-xs rounded-md font-medium transition-colors ${
                    profile.educationLevel === lvl
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium text-left transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item.icon}
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-white/20 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2">
            <button
              onClick={handleCopyShareLink}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs ${
                copiedShare ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {copiedShare ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Link Berhasil Disalin ke Clipboard!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Salin Link untuk Dibagikan ke Teman</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
