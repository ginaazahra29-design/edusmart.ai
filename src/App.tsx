/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ApiKeyBanner } from './components/ApiKeyBanner';
import { HomeView } from './views/HomeView';
import { DashboardView } from './views/DashboardView';
import { TutorView } from './views/TutorView';
import { SummarizeView } from './views/SummarizeView';
import { QuizView } from './views/QuizView';
import { EvaluationView } from './views/EvaluationView';
import { HistoryView } from './views/HistoryView';
import { ProfileView } from './views/ProfileView';
import { ReportView } from './views/ReportView';

const MainContent: React.FC = () => {
  const { currentView } = useApp();

  return (
    <main className="flex-1">
      {currentView === 'home' && <HomeView />}
      {currentView === 'dashboard' && <DashboardView />}
      {currentView === 'tutor' && <TutorView />}
      {currentView === 'summarize' && <SummarizeView />}
      {currentView === 'quiz' && <QuizView />}
      {currentView === 'evaluation' && <EvaluationView />}
      {currentView === 'history' && <HistoryView />}
      {currentView === 'profile' && <ProfileView />}
      {currentView === 'report' && <ReportView />}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <ApiKeyBanner />
        <Navbar />
        <MainContent />
        <Footer />
      </div>
    </AppProvider>
  );
}
