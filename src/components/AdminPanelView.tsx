import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { User, UserFilters, Announcement } from '../types';
import { filterAndSortUsers } from '../utils/userFilters';
import {
  isValidAdSenseClientId,
  isConfiguredAdUnitSlotId,
  generateAdsTxtContent,
  generateAdSenseHeadSnippet,
} from '../utils/adsense';
import { ProtectedRoute } from './ProtectedRoute';
import { CopyButton } from './CopyButton';
import { 
  ShieldCheck, 
  Users, 
  BookOpen, 
  Bell, 
  BarChart3, 
  Plus, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  AlertTriangle,
  Search,
  X,
  Crown,
  Heart,
  ShieldAlert,
  Bot,
  KeyRound,
  Download,
  RotateCcw,
  Eye,
  SlidersHorizontal,
  Smartphone
} from 'lucide-react';
import { AndroidPlayStoreModal } from './AndroidPlayStoreModal';

interface AdminPanelViewProps {
  onOpenAuthModal?: () => void;
}

const DEFAULT_BAN_REASON_PL = 'Naruszenie zasad uczciwej nauki lub podejrzenie zautomatyzowanego bota.';
const DEFAULT_BAN_REASON_EN = 'Violation of fair-learning policy or suspected automated bot activity.';

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({ onOpenAuthModal }) => {
  const { 
    allUsers,
    allModules,
    language,
    announcements, 
    addAnnouncement, 
    deleteAnnouncement, 
    switchUser,
    deleteUser,
    setUserStatus,
    resetUserPassword,
    verifyUserAntiBot,
    giveProByAdmin,
    refillUserLivesByAdmin,
    securityLogs,
    clearSecurityLogs,
    adSenseConfig,
    updateAdSenseConfig,
  } = useApp();
  const isEn = language === 'en';

  const [adminTab, setAdminTab] = useState<'students' | 'security' | 'announcements' | 'analytics' | 'curriculum' | 'adsense'>('students');
  const [securityFilter, setSecurityFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [isPlayStoreModalOpen, setIsPlayStoreModalOpen] = useState(false);
  const [copiedAdSnippet, setCopiedAdSnippet] = useState<'none' | 'adstxt' | 'head'>('none');

  // Account Filters State
  const [filters, setFilters] = useState<UserFilters>({
    searchQuery: '',
    role: 'all',
    proStatus: 'all',
    status: 'all',
    livesStatus: 'all',
    sortBy: 'created_desc',
  });

  // Action Modals State
  const [selectedUserDetail, setSelectedUserDetail] = useState<User | null>(null);
  const [banModalUser, setBanModalUser] = useState<User | null>(null);
  const [banReasonInput, setBanReasonInput] = useState(isEn ? DEFAULT_BAN_REASON_EN : DEFAULT_BAN_REASON_PL);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    setBanReasonInput((prev) => {
      if (isEn && prev === DEFAULT_BAN_REASON_PL) return DEFAULT_BAN_REASON_EN;
      if (!isEn && prev === DEFAULT_BAN_REASON_EN) return DEFAULT_BAN_REASON_PL;
      return prev;
    });
  }, [isEn]);

  // Announcement form state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<Announcement['category']>('Kurs');

  // Apply Filtering & Sorting
  const { filteredUsers, stats } = useMemo(() => {
    return filterAndSortUsers(allUsers, filters);
  }, [allUsers, filters]);

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      role: 'all',
      proStatus: 'all',
      status: 'all',
      livesStatus: 'all',
      sortBy: 'created_desc',
    });
  };

  const getAnnouncementCatLabel = (cat: Announcement['category']) => {
    if (!isEn) return cat;
    const map: Record<Announcement['category'], string> = {
      Kurs: 'Course',
      Wydarzenie: 'Event',
      Aktualizacja: 'Update',
      Porada: 'Tip',
    };
    return map[cat] || cat;
  };

  const handleExportCSV = () => {
    const headers = isEn
      ? ['ID', 'Name', 'Email', 'Role', 'Status', 'AntiBot', 'PRO', 'XP', 'Streak Days', 'Completed Lessons', 'Created At']
      : ['ID', 'Imię', 'Email', 'Rola', 'Status', 'AntyBot', 'PRO', 'XP', 'Seria Dni', 'Ukończone Lekcje', 'Data Utworzenia'];
    const rows = filteredUsers.map((u) => [
      u.id,
      `"${u.name}"`,
      u.email,
      u.role,
      u.status,
      u.antiBotVerified ? (isEn ? 'Verified' : 'Zweryfikowany') : (isEn ? 'Unverified' : 'Niezweryfikowany'),
      u.isPro ? 'PRO' : 'Free',
      u.xp,
      u.streakDays,
      u.completedLessons.length,
      u.createdAt || '',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `${isEn ? 'students_directory_fullstack' : 'baza_kursantow_fullstack'}_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmBan = () => {
    if (!banModalUser) return;
    setUserStatus(banModalUser.id, 'banned', banReasonInput);
    setBanModalUser(null);
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    deleteUser(userToDelete.id);
    setUserToDelete(null);
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    addAnnouncement(newTitle.trim(), newContent.trim(), newCategory);
    setNewTitle('');
    setNewContent('');
  };

  const totalXP = allUsers.reduce((sum, u) => sum + u.xp, 0);
  const avgXP = Math.round(totalXP / (allUsers.length || 1));
  const totalCompletedLessons = allUsers.reduce((sum, u) => sum + u.completedLessons.length, 0);

  return (
    <ProtectedRoute
      requiredRole="admin"
      allowGuests={false}
      onOpenAuthModal={onOpenAuthModal}
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4" />
            <span>{isEn ? 'Instructor & Admin Console' : 'Panel Instruktora & Administracji'}</span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {isEn ? 'Academy Management, Accounts & Anti-Bot Shield' : 'Zarządzanie Akademią, Kontami i Ochroną Anty-Bot'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {isEn
              ? 'Advanced account filtering, security log inspection, moderation, and cohort progress analytics.'
              : 'Zaawansowana filtracja bazy użytkowników, inspekcja zabezpieczeń, moderacja i analiza postępów.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsPlayStoreModalOpen(true)}
          className="px-4 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-extrabold transition-all shadow-lg shadow-indigo-600/30 shrink-0 flex items-center gap-2 cursor-pointer"
        >
          <Smartphone className="h-4 w-4" />
          <span>{isEn ? 'Google Play Publish (APK / AAB)' : 'Publikacja Google Play (APK / AAB)'}</span>
        </button>
      </div>

      <AndroidPlayStoreModal
        isOpen={isPlayStoreModalOpen}
        onClose={() => setIsPlayStoreModalOpen(false)}
      />

      {/* Quick KPI stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">{isEn ? 'User Accounts' : 'Baza Kont'}</span>
            <Users className="h-4 w-4 text-indigo-400" />
          </div>
          <p className="mt-2 text-2xl font-black text-white">{stats.total}</p>
          <div className="mt-1 flex items-center gap-2 text-[11px]">
            <span className="text-emerald-400 font-bold">{stats.activeCount} {isEn ? 'active' : 'aktywnych'}</span>
            <span className="text-slate-500">•</span>
            <span className="text-rose-400 font-bold">{stats.suspendedCount + stats.bannedCount} {isEn ? 'blocked' : 'zablokowanych'}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">{isEn ? 'PRO Subscriptions' : 'Subskrypcje PRO'}</span>
            <Crown className="h-4 w-4 text-amber-400" />
          </div>
          <p className="mt-2 text-2xl font-black text-amber-300">{stats.proCount}</p>
          <p className="mt-1 text-[11px] text-slate-400">
            {Math.round((stats.proCount / (stats.total || 1)) * 100)}% {isEn ? 'user conversion' : 'konwersji użytkowników'}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">{isEn ? 'Avg XP per Student' : 'Średnie XP na Studenta'}</span>
            <TrendingUp className="h-4 w-4 text-indigo-400" />
          </div>
          <p className="mt-2 text-2xl font-black text-indigo-300">{avgXP} <span className="text-xs font-normal text-slate-400">XP</span></p>
          <p className="mt-1 text-[11px] text-emerald-400">{isEn ? 'Total:' : 'Łącznie:'} {totalXP} XP</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">{isEn ? 'Completed Lessons' : 'Zaliczone Lekcje'}</span>
            <BookOpen className="h-4 w-4 text-cyan-400" />
          </div>
          <p className="mt-2 text-2xl font-black text-white">{totalCompletedLessons}</p>
          <p className="mt-1 text-[11px] text-slate-400">{isEn ? '15 full-stack modules' : '15 modułów full-stack'}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-800 gap-4 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setAdminTab('students')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
            adminTab === 'students'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>{isEn ? `Accounts & Filtering (${allUsers.length})` : `Filtracja i Baza Kont (${allUsers.length})`}</span>
        </button>
        <button
          type="button"
          onClick={() => setAdminTab('announcements')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
            adminTab === 'announcements'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bell className="h-4 w-4" />
          <span>{isEn ? `Announcements (${announcements.length})` : `Ogłoszenia (${announcements.length})`}</span>
        </button>
        <button
          type="button"
          onClick={() => setAdminTab('analytics')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
            adminTab === 'analytics'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          <span>{isEn ? 'Quiz & Difficulty Analytics' : 'Analiza Quizów & Problemów'}</span>
        </button>
        <button
          type="button"
          onClick={() => setAdminTab('curriculum')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
            adminTab === 'curriculum'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>{isEn ? 'Curriculum Overview (15)' : 'Przegląd Programu (15)'}</span>
        </button>
        <button
          type="button"
          onClick={() => setAdminTab('adsense')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
            adminTab === 'adsense'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>{isEn ? 'Google AdSense (Free Tier)' : 'Google AdSense (Free Konta)'}</span>
        </button>
        <button
          type="button"
          onClick={() => setAdminTab('security')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
            adminTab === 'security'
              ? 'border-rose-500 text-rose-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="h-4 w-4" />
          <span>{isEn ? `Security Audit Log (${securityLogs.length})` : `Dziennik Bezpieczeństwa (${securityLogs.length})`}</span>
        </button>
      </div>

      {/* TAB 1: Advanced Account Management & Filtering */}
      {adminTab === 'students' && (
        <div className="space-y-5">
          
          {/* MULTI-FACETED FILTER CONTROL BAR */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
                <SlidersHorizontal className="h-4 w-4" />
                <span>{isEn ? 'Advanced Account Filtering' : 'Zaawansowane Filtrowanie Kont'}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
                  title={isEn ? 'Export filtered list to CSV' : 'Eksportuj przefiltrowaną listę do pliku CSV'}
                >
                  <Download className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{isEn ? 'Export CSV' : 'Eksport CSV'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{isEn ? 'Reset filters' : 'Resetuj filtry'}</span>
                </button>
              </div>
            </div>

            {/* Grid of filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-xs">
              
              {/* Search query input */}
              <div className="lg:col-span-2 relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={filters.searchQuery}
                  onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
                  placeholder={isEn ? 'Search by name, email, or ID...' : 'Szukaj po nazwisku, e-mail lub ID...'}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-8 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {filters.searchQuery && (
                  <button
                    type="button"
                    onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                    className="absolute right-2.5 top-2.5 text-slate-500 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Role filter */}
              <div>
                <select
                  value={filters.role}
                  onChange={(e) => setFilters((prev) => ({ ...prev, role: e.target.value as any }))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">{isEn ? 'Role: All' : 'Rola: Wszyscy'}</option>
                  <option value="student">{isEn ? 'Role: Student' : 'Rola: Kursant'}</option>
                  <option value="admin">{isEn ? 'Role: Instructor / Admin' : 'Rola: Instruktor / Admin'}</option>
                </select>
              </div>

              {/* Status filter */}
              <div>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value as any }))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">{isEn ? 'Status: All' : 'Status: Wszyscy'}</option>
                  <option value="active">{isEn ? 'Status: Active' : 'Status: Aktywne'}</option>
                  <option value="suspended">{isEn ? 'Status: Suspended' : 'Status: Zawieszone'}</option>
                  <option value="pending_verification">{isEn ? 'Status: Verification' : 'Status: Weryfikacja'}</option>
                  <option value="banned">{isEn ? 'Status: Banned' : 'Status: Zablokowane'}</option>
                </select>
              </div>

              {/* PRO status filter */}
              <div>
                <select
                  value={filters.proStatus}
                  onChange={(e) => setFilters((prev) => ({ ...prev, proStatus: e.target.value as any }))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">{isEn ? 'Plan: All' : 'Plan: Wszyscy'}</option>
                  <option value="pro">{isEn ? 'Plan: PRO Only' : 'Plan: Tylko PRO 👑'}</option>
                  <option value="free">{isEn ? 'Plan: Free Only' : 'Plan: Tylko Free'}</option>
                </select>
              </div>

              {/* Sort by */}
              <div>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="created_desc">{isEn ? 'Sort: Newest' : 'Sortuj: Najnowsze'}</option>
                  <option value="xp_desc">{isEn ? 'Sort: Highest XP' : 'Sortuj: Najwięcej XP'}</option>
                  <option value="xp_asc">{isEn ? 'Sort: Lowest XP' : 'Sortuj: Najmniej XP'}</option>
                  <option value="streak_desc">{isEn ? 'Sort: Longest Streak' : 'Sortuj: Najdłuższa seria'}</option>
                  <option value="lessons_desc">{isEn ? 'Sort: Most Lessons' : 'Sortuj: Najwięcej lekcji'}</option>
                  <option value="name_asc">{isEn ? 'Sort: Name A-Z' : 'Sortuj: Alfabetycznie A-Z'}</option>
                </select>
              </div>

            </div>

            {/* Result count & active chips */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs">
              <span className="text-slate-400">
                {isEn ? (
                  <>Showing <strong className="text-white font-bold">{filteredUsers.length}</strong> of {allUsers.length} registered accounts</>
                ) : (
                  <>Wyświetlono <strong className="text-white font-bold">{filteredUsers.length}</strong> z {allUsers.length} zarejestrowanych kont</>
                )}
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {filters.searchQuery && (
                  <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px]">
                    {isEn ? 'Query' : 'Fraza'}: "{filters.searchQuery}"
                  </span>
                )}
                {filters.role !== 'all' && (
                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px]">
                    {isEn ? 'Role' : 'Rola'}: {filters.role}
                  </span>
                )}
                {filters.status !== 'all' && (
                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px]">
                    Status: {filters.status}
                  </span>
                )}
                {filters.proStatus !== 'all' && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px]">
                    Plan: {filters.proStatus}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* USERS TABLE */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold">
                  <tr>
                    <th scope="col" className="p-4">{isEn ? 'User & Profile' : 'Użytkownik & Profil'}</th>
                    <th scope="col" className="p-4">{isEn ? 'Status & Anti-Bot' : 'Status & Anty-Bot'}</th>
                    <th scope="col" className="p-4">{isEn ? 'Plan & Hearts' : 'Plan & Serca'}</th>
                    <th scope="col" className="p-4">{isEn ? 'XP & Level' : 'XP & Poziom'}</th>
                    <th scope="col" className="p-4">{isEn ? 'Streak & Lessons' : 'Seria & Lekcje'}</th>
                    <th scope="col" className="p-4 text-right">{isEn ? 'Account Actions' : 'Zarządzanie kontem'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => {
                      const isSuspended = user.status === 'suspended' || user.status === 'banned';
                      const isPending = user.status === 'pending_verification';

                      return (
                        <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                          
                          {/* User Column */}
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img 
                                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'} 
                                alt={user.name} 
                                className="h-9 w-9 rounded-xl object-cover ring-1 ring-slate-700" 
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-white text-sm">{user.name}</span>
                                  {user.role === 'admin' && (
                                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                      Admin
                                    </span>
                                  )}
                                </div>
                                <span className="text-[11px] text-slate-400 block font-mono">{user.email}</span>
                                <span className="text-[10px] text-slate-500">ID: {user.id}</span>
                              </div>
                            </div>
                          </td>

                          {/* Status & Anti-Bot Column */}
                          <td className="p-4">
                            <div className="space-y-1">
                              {/* Status Badge */}
                              <div>
                                {user.status === 'active' ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                                    <CheckCircle2 className="h-3 w-3" />
                                    {isEn ? 'Active' : 'Aktywne'}
                                  </span>
                                ) : isSuspended ? (
                                  <span 
                                    title={user.banReason || (isEn ? 'No reason specified' : 'Brak opisu')}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 cursor-help"
                                  >
                                    <ShieldAlert className="h-3 w-3" />
                                    {user.status === 'banned'
                                      ? isEn ? 'Banned' : 'Zablokowane'
                                      : isEn ? 'Suspended' : 'Zawieszone'}
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                    <AlertTriangle className="h-3 w-3" />
                                    {isEn ? 'Pending verification' : 'Oczekuje na weryfikację'}
                                  </span>
                                )}
                              </div>

                              {/* Anti-Bot Verification Badge */}
                              <div className="flex items-center gap-1.5 text-[10px]">
                                {user.antiBotVerified ? (
                                  <span className="text-cyan-400 flex items-center gap-1">
                                    <Bot className="h-3 w-3" />
                                    {isEn ? `Human (${user.antiBotScore ?? 100}%)` : `Człowiek (${user.antiBotScore ?? 100}%)`}
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => verifyUserAntiBot(user.id)}
                                    title={isEn ? 'Click to approve as verified human' : 'Kliknij, aby zatwierdzić jako zweryfikowanego człowieka'}
                                    className="text-amber-400 hover:text-amber-300 underline flex items-center gap-1"
                                  >
                                    <Bot className="h-3 w-3" />
                                    {isEn ? 'Verify anti-bot' : 'Zweryfikuj anty-botem'}
                                  </button>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Plan & Hearts Column */}
                          <td className="p-4">
                            <div className="space-y-1">
                              <div>
                                {user.isPro ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-500/20 to-purple-500/20 text-amber-300 border border-amber-500/40">
                                    <Crown className="h-3 w-3 text-amber-400" />
                                    PRO UNLIMITED
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-medium text-slate-400">
                                    {isEn ? 'Free Plan' : 'Plan Free'}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-1 text-[11px] text-rose-400">
                                <Heart className="h-3.5 w-3.5 fill-rose-500" />
                                <span>
                                  {user.isPro
                                    ? isEn ? '∞ (Unlimited)' : '∞ (Nielimitowane)'
                                    : `${user.lives ?? 5}/5 ${isEn ? 'hearts' : 'serc'}`}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* XP Column */}
                          <td className="p-4">
                            <div className="font-mono font-bold text-indigo-300 text-sm">
                              {user.xp} XP
                            </div>
                            <span className="text-[11px] text-slate-400">{isEn ? 'Level' : 'Poziom'} {user.level || 1}</span>
                          </td>

                          {/* Progress Column */}
                          <td className="p-4">
                            <div className="text-amber-400 font-semibold text-xs flex items-center gap-1">
                              <span>🔥 {user.streakDays} {isEn ? 'days' : 'dni'}</span>
                            </div>
                            <span className="text-[11px] text-slate-300">
                              {user.completedLessons.length} {isEn ? 'lessons' : 'lekcji'} • {user.completedProjects.length} {isEn ? 'proj.' : 'proj.'}
                            </span>
                          </td>

                          {/* Admin Actions Column */}
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              
                              {/* Inspect details button */}
                              <button
                                type="button"
                                onClick={() => setSelectedUserDetail(user)}
                                title={isEn ? 'Inspect student card' : 'Podgląd karty kursanta'}
                                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </button>

                              {/* Toggle Status (Ban / Unban) */}
                              {isSuspended ? (
                                <button
                                  type="button"
                                  onClick={() => setUserStatus(user.id, 'active')}
                                  title={isEn ? 'Unban user account' : 'Odblokuj konto użytkownika'}
                                  className="px-2 py-1 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white transition-colors text-[10px] font-bold"
                                >
                                  {isEn ? 'Unban' : 'Odblokuj'}
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setBanModalUser(user)}
                                  title={isEn ? 'Suspend or ban this account' : 'Zawieś lub zablokuj to konto'}
                                  className="px-2 py-1 rounded-lg bg-rose-600/20 text-rose-300 border border-rose-500/30 hover:bg-rose-600 hover:text-white transition-colors text-[10px] font-bold"
                                >
                                  {isEn ? 'Ban' : 'Zablokuj'}
                                </button>
                              )}

                              {/* Toggle PRO */}
                              <button
                                type="button"
                                onClick={() => giveProByAdmin(user.id, !user.isPro)}
                                title={user.isPro ? (isEn ? 'Revoke PRO access' : 'Odbierz uprawnienia PRO') : (isEn ? 'Grant PRO access' : 'Nadaj uprawnienia PRO')}
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                                  user.isPro
                                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500 hover:text-slate-950'
                                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                                }`}
                              >
                                {user.isPro ? 'PRO ✓' : '+PRO'}
                              </button>

                              {/* Refill Hearts */}
                              {!user.isPro && (
                                <button
                                  type="button"
                                  onClick={() => refillUserLivesByAdmin(user.id)}
                                  title={isEn ? 'Refill hearts to 5/5' : 'Uzupełnij serca do 5/5'}
                                  className="px-2 py-1 rounded-lg bg-rose-600/15 text-rose-300 border border-rose-500/20 hover:bg-rose-600 hover:text-white transition-colors text-[10px] font-bold"
                                >
                                  +❤️ 5/5
                                </button>
                              )}

                              {/* Switch to user session */}
                              <button
                                type="button"
                                onClick={() => switchUser(user.id)}
                                title={isEn ? 'Switch to this user account' : 'Zaloguj na profil tego użytkownika'}
                                className="px-2 py-1 rounded-lg bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600 hover:text-white transition-colors text-[10px] font-bold"
                              >
                                {isEn ? 'Switch' : 'Zaloguj'}
                              </button>

                              {/* Delete account */}
                              {user.id !== 'user-admin' && (
                                <button
                                  type="button"
                                  onClick={() => setUserToDelete(user)}
                                  title={isEn ? 'Permanently delete account' : 'Usuń trwale konto'}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        {isEn
                          ? 'No user accounts match the selected filter criteria.'
                          : 'Nie znaleziono żadnych kont spełniających wybrane kryteria filtracji.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Announcements Publisher */}
      {adminTab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <form onSubmit={handleCreateAnnouncement} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="h-4 w-4 text-indigo-400" />
              <span>{isEn ? 'Publish New Announcement' : 'Opublikuj nowe ogłoszenie'}</span>
            </h3>
            
            <div className="space-y-1">
              <label htmlFor="ann-title" className="text-xs font-semibold text-slate-300 block">
                {isEn ? 'Announcement Title:' : 'Tytuł ogłoszenia:'}
              </label>
              <input
                id="ann-title"
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder={isEn ? 'e.g. Live React 19 workshop on Thursday' : 'np. Warsztaty na żywo z React 19 w czwartek'}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="ann-cat" className="text-xs font-semibold text-slate-300 block">
                {isEn ? 'Category:' : 'Kategoria:'}
              </label>
              <select
                id="ann-cat"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Kurs">{isEn ? 'Course' : 'Kurs'}</option>
                <option value="Wydarzenie">{isEn ? 'Event' : 'Wydarzenie'}</option>
                <option value="Aktualizacja">{isEn ? 'Update' : 'Aktualizacja'}</option>
                <option value="Porada">{isEn ? 'Tip' : 'Porada'}</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="ann-content" className="text-xs font-semibold text-slate-300 block">
                {isEn ? 'Message Body:' : 'Treść wiadomości:'}
              </label>
              <textarea
                id="ann-content"
                rows={4}
                required
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder={isEn ? 'Write a message to students...' : 'Wpisz treść komunikatu dla kursantów...'}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 text-xs font-bold transition-all shadow-md shadow-indigo-900/40"
            >
              {isEn ? 'Publish Announcement to All Students' : 'Opublikuj ogłoszenie dla wszystkich'}
            </button>
          </form>

          {/* List of existing */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isEn ? `Published Announcements (${announcements.length}):` : `Opublikowane ogłoszenia (${announcements.length}):`}
            </h3>
            {announcements.map((ann) => (
              <div key={ann.id} className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-indigo-400">{getAnnouncementCatLabel(ann.category)}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500">{ann.date}</span>
                    <button
                      type="button"
                      onClick={() => deleteAnnouncement(ann.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                      title={isEn ? 'Delete announcement' : 'Usuń ogłoszenie'}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <h4 className="text-sm font-bold text-white">{ann.title}</h4>
                <p className="text-xs text-slate-400">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Analytics */}
      {adminTab === 'analytics' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white">
              {isEn ? 'Quiz Scores & Challenging Topics Analysis' : 'Analiza wyników i problematycznych zagadnień'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {isEn
                ? 'Breakdown of average student quiz results across the HTML5 module:'
                : 'Zestawienie średnich wyników testów wiedzy kursantów z modułu HTML5:'}
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">
                  {isEn ? 'Lesson 3: Modern Forms & Native Validation' : 'Lekcja 3: Nowoczesne formularze i walidacja'}
                </span>
                <span className="text-amber-400 font-semibold font-mono">{isEn ? 'Avg Score: 74%' : 'Średni wynik: 74%'}</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '74%' }} />
              </div>
              <p className="text-[11px] text-slate-400">
                {isEn
                  ? 'Most common mistake: Omitting the "for" attribute on <label> tags and relying solely on placeholders.'
                  : 'Najczęstszy błąd: Pomijanie atrybutu "for" w tagu <label> i stosowanie wyłącznie placeholderów.'}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">
                  {isEn ? 'Lesson 5: Accessibility (a11y/WCAG) & SEO' : 'Lekcja 5: Dostępność cyfrowa (a11y/WCAG) i SEO'}
                </span>
                <span className="text-emerald-400 font-semibold font-mono">{isEn ? 'Avg Score: 88%' : 'Średni wynik: 88%'}</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '88%' }} />
              </div>
              <p className="text-[11px] text-slate-400">
                {isEn
                  ? 'High pass rate: Students consistently master POUR principles and aria-label attributes.'
                  : 'Wysoka zdawalność: Kursanci doskonale radzą sobie z zasadą POUR i atrybutami aria-label.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Curriculum Overview */}
      {adminTab === 'curriculum' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <h3 className="text-base font-bold text-white">
            {isEn ? '15-Module Curriculum Architecture' : 'Struktura 15 modułów kursu'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {allModules.map((m) => (
              <div key={m.id} className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 flex items-start gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-300 font-bold font-mono">
                  {m.id}
                </span>
                <div>
                  <h4 className="font-bold text-white">{m.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{m.durationHours}h • {m.totalXp} XP • {m.displayCategory || m.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: Google AdSense Monetization for Free Accounts */}
      {adminTab === 'adsense' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/80 p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                  <Sparkles className="h-4 w-4" />
                  <span>{isEn ? 'Free-Tier Monetization • Google AdSense' : 'Monetyzacja Darmowych Kont • Google AdSense'}</span>
                </div>
                <h3 className="mt-1 text-lg font-extrabold text-white">
                  {isEn ? 'AdSense Publisher & Ad Slot Configuration' : 'Konfiguracja Wydawcy AdSense i Jednostek Reklamowych'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isEn
                    ? 'Ads are displayed only to signed-in Free-tier students. PRO and Administrator accounts remain 100% ad-free.'
                    : 'Reklamy wyświetlają się wyłącznie zalogowanym kursantom na planie darmowym (Free). Konta PRO oraz Administrator są w 100% wolne od reklam.'}
                </p>
              </div>

              <label className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={adSenseConfig.enabled}
                  onChange={(e) => updateAdSenseConfig({ enabled: e.target.checked })}
                  className="h-4 w-4 accent-emerald-500 rounded"
                />
                <span className="text-xs font-bold text-white">
                  {adSenseConfig.enabled
                    ? isEn ? 'AdSense Enabled (Free)' : 'AdSense Aktywne (Free)'
                    : isEn ? 'AdSense Disabled' : 'AdSense Wyłączone'}
                </span>
              </label>
            </div>

            {/* Publisher Client ID & Limits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  {isEn ? 'Publisher Client ID:' : 'Identyfikator Wydawcy (Publisher Client ID):'}
                </label>
                <input
                  type="text"
                  value={adSenseConfig.clientId}
                  onChange={(e) => updateAdSenseConfig({ clientId: e.target.value })}
                  placeholder="ca-pub-7482910384756192"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[11px] text-slate-400">
                  {isValidAdSenseClientId(adSenseConfig.clientId) ? (
                    <span className="text-emerald-400">{isEn ? '✓ Valid ca-pub publisher format' : '✓ Poprawny format identyfikatora ca-pub'}</span>
                  ) : (
                    <span className="text-amber-400">{isEn ? 'Expected format: ca-pub-XXXXXXXXXXXXXXXX' : 'Wymagany format: ca-pub-XXXXXXXXXXXXXXXX'}</span>
                  )}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  {isEn ? 'Daily Rewarded Ad Limit (+1 ❤️):' : 'Dzienny limit reklam z nagrodą (+1 ❤️):'}
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={adSenseConfig.maxDailyRewardedAds}
                  onChange={(e) => updateAdSenseConfig({ maxDailyRewardedAds: Number(e.target.value) || 5 })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[11px] text-slate-400">
                  {isEn ? 'Max hearts earnable per day via ad views.' : 'Maksymalna liczba serc za obejrzenie reklamy dziennie.'}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  {isEn ? 'Cooldown Between Rewarded Ads (seconds):' : 'Odstęp czasowy między reklamami (sekundy):'}
                </label>
                <input
                  type="number"
                  min={5}
                  max={600}
                  value={adSenseConfig.rewardedCooldownSeconds}
                  onChange={(e) => updateAdSenseConfig({ rewardedCooldownSeconds: Number(e.target.value) || 45 })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[11px] text-slate-400">
                  {isEn ? 'Cooldown protecting against click abuse.' : 'Cooldown chroniący przed nadużyciami kliknięć.'}
                </p>
              </div>
            </div>

            {/* Individual Ad Slots & Toggles */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {isEn ? 'Ad Slots & Placement Toggles' : 'Jednostki reklamowe (Ad Slots) i miejsca wyświetlania'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {(
                  [
                    { key: 'dashboard', label: isEn ? 'Main Dashboard (Banner)' : 'Panel Główny (Dashboard Banner)' },
                    { key: 'modules', label: isEn ? 'Course Modules (In-Feed Banner)' : 'Moduły Kursowe (In-Feed Banner)' },
                    { key: 'lesson', label: isEn ? 'Lesson View (Pre-Quiz Banner)' : 'Widok Lekcji (Pod teorią / przed quizem)' },
                    { key: 'sidebar', label: isEn ? 'Sidebar Compact Slot' : 'Pasek Boczny (Sidebar Compact)' },
                    { key: 'rewarded', label: isEn ? 'Optional Extra Placement' : 'Jednostka Dodatkowa (Opcjonalna)' },
                  ] as const
                ).map((item) => {
                  const isRealUnit = isConfiguredAdUnitSlotId(adSenseConfig.slots[item.key]);
                  return (
                    <div
                      key={item.key}
                      className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/80 space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-white">{item.label}</span>
                        <input
                          type="checkbox"
                          checked={adSenseConfig.placements[item.key]}
                          onChange={(e) =>
                            updateAdSenseConfig({
                              placements: {
                                ...adSenseConfig.placements,
                                [item.key]: e.target.checked,
                              },
                            })
                          }
                          className="h-4 w-4 accent-emerald-500 rounded cursor-pointer"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] text-slate-400">Ad Slot ID (data-ad-slot):</span>
                          <span
                            className={`text-[10px] font-mono font-semibold ${
                              isRealUnit ? 'text-emerald-400' : 'text-amber-300'
                            }`}
                          >
                            {isRealUnit ? (isEn ? 'Active Slot' : 'Aktywny Slot') : (isEn ? 'Auto Ads (Default)' : 'Auto Ads (Domyślny)')}
                          </span>
                        </div>
                        <input
                          type="text"
                          value={adSenseConfig.slots[item.key]}
                          onChange={(e) =>
                            updateAdSenseConfig({
                              slots: {
                                ...adSenseConfig.slots,
                                [item.key]: e.target.value,
                              },
                            })
                          }
                          className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs font-mono text-emerald-300"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ads.txt & Head Snippet Export */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-3 border-t border-slate-800">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">
                    {isEn ? 'Verification File /public/ads.txt' : 'Plik weryfikacyjny /public/ads.txt'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(generateAdsTxtContent(adSenseConfig.clientId));
                      setCopiedAdSnippet('adstxt');
                      setTimeout(() => setCopiedAdSnippet('none'), 2000);
                    }}
                    className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer"
                  >
                    {copiedAdSnippet === 'adstxt'
                      ? isEn ? 'Copied!' : 'Skopiowano!'
                      : isEn ? 'Copy ads.txt' : 'Kopiuj ads.txt'}
                  </button>
                </div>
                <div className="relative">
                  <CopyButton
                    text={generateAdsTxtContent(adSenseConfig.clientId)}
                    className="absolute top-2 right-2 z-10"
                  />
                  <pre className="p-2.5 pr-24 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto">
                    {generateAdsTxtContent(adSenseConfig.clientId)}
                  </pre>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">
                    {isEn ? 'Google AdSense Script Snippet (<head>)' : 'Kod skryptu Google AdSense (<head>)'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(generateAdSenseHeadSnippet(adSenseConfig.clientId));
                      setCopiedAdSnippet('head');
                      setTimeout(() => setCopiedAdSnippet('none'), 2000);
                    }}
                    className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer"
                  >
                    {copiedAdSnippet === 'head'
                      ? isEn ? 'Copied!' : 'Skopiowano!'
                      : isEn ? 'Copy HTML snippet' : 'Kopiuj kod HTML'}
                  </button>
                </div>
                <div className="relative">
                  <CopyButton
                    text={generateAdSenseHeadSnippet(adSenseConfig.clientId)}
                    className="absolute top-2 right-2 z-10"
                  />
                  <pre className="p-2.5 pr-24 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto">
                    {generateAdSenseHeadSnippet(adSenseConfig.clientId)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Security Audit Log */}
      {adminTab === 'security' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-rose-400" />
                <span>{isEn ? 'Security Audit Log (ProtectedRoute & Anti-Bot)' : 'Rejestr Zdarzeń Bezpieczeństwa (ProtectedRoute & Anty-Bot Audit Log)'}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEn
                  ? 'Automatic trace of blocked ProtectedRoute access attempts, rejected logins, and anti-bot checks.'
                  : 'Automatyczny zapis zablokowanych prób wejścia przez ProtectedRoute, odrzuconych logowań oraz weryfikacji anty-botowych.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {(['all', 'critical', 'warning', 'info'] as const).map((sev) => (
                <button
                  key={sev}
                  type="button"
                  onClick={() => setSecurityFilter(sev)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    securityFilter === sev
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {sev === 'all' ? (isEn ? 'All' : 'Wszystkie') : sev.toUpperCase()}
                </button>
              ))}
              {securityLogs.length > 0 && (
                <button
                  type="button"
                  onClick={clearSecurityLogs}
                  className="px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-colors"
                >
                  {isEn ? 'Clear logs' : 'Wyczyść logi'}
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2.5 max-h-96 overflow-y-auto">
            {securityLogs
              .filter((e) => securityFilter === 'all' || e.severity === securityFilter)
              .map((event) => (
                <div
                  key={event.id}
                  className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`font-bold uppercase tracking-wider text-[10px] ${
                          event.severity === 'critical'
                            ? 'text-rose-400'
                            : event.severity === 'warning'
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        [{event.severity}]
                      </span>
                      <span className="font-bold text-white">{event.action}</span>
                      <span className="text-slate-500">·</span>
                      <span className="font-mono text-[11px] text-slate-300">{event.actorEmail}</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-[11px] text-slate-400">{isEn ? 'Role:' : 'Rola:'} {event.actorRole}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{event.details}</p>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400 shrink-0">{event.timestamp}</span>
                </div>
              ))}
            {securityLogs.filter((e) => securityFilter === 'all' || e.severity === securityFilter).length === 0 && (
              <p className="py-8 text-center text-xs text-slate-400">
                {isEn ? 'No security events match the selected filter.' : 'Brak zdarzeń bezpieczeństwa spełniających wybrane kryteria.'}
              </p>
            )}
          </div>
        </div>
      )}

      {/* MODAL 1: Ban / Suspend Dialog */}
      {banModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-5">
            <div className="flex items-center gap-3 text-rose-400">
              <ShieldAlert className="h-6 w-6" />
              <h3 className="text-base font-bold text-white">{isEn ? 'Ban Student Account' : 'Blokada konta kursanta'}</h3>
            </div>
            
            <p className="text-xs text-slate-300">
              {isEn ? (
                <>You are about to ban <strong className="text-white">{banModalUser.name}</strong> ({banModalUser.email}). They will no longer be able to sign in.</>
              ) : (
                <>Zamierzasz zablokować konto użytkownika <strong className="text-white">{banModalUser.name}</strong> ({banModalUser.email}). Użytkownik nie będzie mógł się zalogować.</>
              )}
            </p>

            <div className="space-y-1.5">
              <label htmlFor="ban-reason" className="text-xs font-semibold text-slate-400 block">
                {isEn ? 'Ban Reason:' : 'Powód blokady konta:'}
              </label>
              <textarea
                id="ban-reason"
                rows={3}
                value={banReasonInput}
                onChange={(e) => setBanReasonInput(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setBanModalUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                {isEn ? 'Cancel' : 'Anuluj'}
              </button>
              <button
                type="button"
                onClick={handleConfirmBan}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                {isEn ? 'Confirm Ban' : 'Potwierdź blokadę'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Delete User Confirmation */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-5">
            <div className="flex items-center gap-3 text-rose-400">
              <Trash2 className="h-6 w-6" />
              <h3 className="text-base font-bold text-white">{isEn ? 'Delete Account' : 'Usuwanie konta'}</h3>
            </div>
            
            <p className="text-xs text-slate-300">
              {isEn ? (
                <>Are you sure you want to permanently delete <strong className="text-white">{userToDelete.name}</strong>? All learning progress and quiz history will be erased.</>
              ) : (
                <>Czy na pewno chcesz bezpowrotnie usunąć konto <strong className="text-white">{userToDelete.name}</strong>? Wszystkie dane postępów i testów zostaną skasowane.</>
              )}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                {isEn ? 'Cancel' : 'Anuluj'}
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                {isEn ? 'Yes, delete account' : 'Tak, usuń konto'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Detailed User Profile Card */}
      {selectedUserDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <img 
                  src={selectedUserDetail.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'} 
                  alt={selectedUserDetail.name} 
                  className="h-12 w-12 rounded-2xl object-cover ring-2 ring-indigo-500/50" 
                />
                <div>
                  <h3 className="text-base font-bold text-white">{selectedUserDetail.name}</h3>
                  <span className="text-xs text-slate-400">{selectedUserDetail.email}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUserDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* User Meta Information */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase">{isEn ? 'Role & Status:' : 'Rola i status:'}</span>
                <span className="font-bold text-white mt-0.5 block">{selectedUserDetail.role} ({selectedUserDetail.status})</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase">{isEn ? 'Subscription Plan:' : 'Plan subskrypcji:'}</span>
                <span className="font-bold text-amber-300 mt-0.5 block">{selectedUserDetail.isPro ? 'Full Stack PRO' : (isEn ? 'Free Tier' : 'Darmowy (Free)')}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase">{isEn ? 'Points & Level:' : 'Punkty i poziom:'}</span>
                <span className="font-bold text-indigo-300 mt-0.5 block">{selectedUserDetail.xp} XP • {isEn ? 'Level' : 'Poziom'} {selectedUserDetail.level}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase">{isEn ? 'Anti-Bot Check:' : 'Weryfikacja Anty-Bot:'}</span>
                <span className={`font-bold mt-0.5 block ${selectedUserDetail.antiBotVerified ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {selectedUserDetail.antiBotVerified
                    ? isEn ? `Passed (${selectedUserDetail.antiBotScore ?? 100}%)` : `Pozytywna (${selectedUserDetail.antiBotScore ?? 100}%)`
                    : isEn ? 'Unverified' : 'Niezweryfikowano'}
                </span>
              </div>
            </div>

            {/* Quiz performance history */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {isEn ? 'Student Quiz History:' : 'Wyniki quizów kursanta:'}
              </h4>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5 max-h-36 overflow-y-auto">
                {Object.keys(selectedUserDetail.quizScores || {}).length > 0 ? (
                  Object.entries(selectedUserDetail.quizScores).map(([lessonId, score]) => (
                    <div key={lessonId} className="flex items-center justify-between">
                      <span className="text-slate-300 font-mono">{lessonId}</span>
                      <span className={`font-bold ${score >= 80 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {score}%
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="text-slate-500 text-[11px]">{isEn ? 'No completed quizzes yet.' : 'Brak rozwiązanych quizów.'}</span>
                )}
              </div>
            </div>

            {/* Quick Actions in Detail Modal */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  resetUserPassword(selectedUserDetail.email);
                  setSelectedUserDetail(null);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-medium"
              >
                <KeyRound className="h-3.5 w-3.5 text-amber-400" />
                <span>{isEn ? 'Reset password' : 'Resetuj hasło'}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedUserDetail(null)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
              >
                {isEn ? 'Close preview' : 'Zamknij podgląd'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
    </ProtectedRoute>
  );
};
