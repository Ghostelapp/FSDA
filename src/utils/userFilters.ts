import { User, UserFilters } from '../types';

export interface FilterStats {
  total: number;
  filteredCount: number;
  activeCount: number;
  suspendedCount: number;
  bannedCount: number;
  proCount: number;
  studentsCount: number;
  adminsCount: number;
}

export function filterAndSortUsers(users: User[], filters: UserFilters): { filteredUsers: User[]; stats: FilterStats } {
  const query = filters.searchQuery.trim().toLowerCase();

  const filteredUsers = users.filter((u) => {
    // 1. Search Query
    if (query) {
      const matchName = (u.name || '').toLowerCase().includes(query);
      const matchEmail = (u.email || '').toLowerCase().includes(query);
      const matchId = (u.id || '').toLowerCase().includes(query);
      if (!matchName && !matchEmail && !matchId) {
        return false;
      }
    }

    // 2. Role Filter
    if (filters.role !== 'all' && u.role !== filters.role) {
      return false;
    }

    // 3. PRO Status Filter
    if (filters.proStatus === 'pro' && !u.isPro) {
      return false;
    }
    if (filters.proStatus === 'free' && u.isPro) {
      return false;
    }

    // 4. Status Filter (active / suspended / pending_verification / banned)
    if (filters.status !== 'all' && u.status !== filters.status) {
      return false;
    }

    // 5. Lives Filter
    if (filters.livesStatus === 'zero') {
      const lives = u.isPro ? 5 : (u.lives ?? 5);
      if (lives > 0) return false;
    } else if (filters.livesStatus === 'partial') {
      const lives = u.isPro ? 5 : (u.lives ?? 5);
      if (lives === 5 || lives === 0) return false;
    } else if (filters.livesStatus === 'full') {
      const lives = u.isPro ? 5 : (u.lives ?? 5);
      if (lives < 5) return false;
    }

    return true;
  });

  // Sort
  filteredUsers.sort((a, b) => {
    switch (filters.sortBy) {
      case 'xp_desc':
        return (b.xp ?? 0) - (a.xp ?? 0);
      case 'xp_asc':
        return (a.xp ?? 0) - (b.xp ?? 0);
      case 'streak_desc':
        return (b.streakDays ?? 0) - (a.streakDays ?? 0);
      case 'lessons_desc':
        return (b.completedLessons?.length ?? 0) - (a.completedLessons?.length ?? 0);
      case 'name_asc':
        return (a.name || '').localeCompare(b.name || '', 'pl');
      case 'created_desc':
      default:
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    }
  });

  const stats: FilterStats = {
    total: users.length,
    filteredCount: filteredUsers.length,
    activeCount: users.filter((u) => u.status === 'active').length,
    suspendedCount: users.filter((u) => u.status === 'suspended').length,
    bannedCount: users.filter((u) => u.status === 'banned').length,
    proCount: users.filter((u) => u.isPro).length,
    studentsCount: users.filter((u) => u.role === 'student').length,
    adminsCount: users.filter((u) => u.role === 'admin').length,
  };

  return { filteredUsers, stats };
}

const CSV_FORMULA_PREFIX_RE = /^[\t\r ]*[=+\-@]/;

/**
 * Escapes a single CSV cell according to RFC 4180 and neutralizes spreadsheet formula prefixes
 * (=, +, -, @, tab, CR) so exported CSV files cannot execute formulas in Excel/Sheets.
 */
export function escapeCsvCell(value: unknown): string {
  const raw = value === null || value === undefined ? '' : String(value);
  const neutralized = CSV_FORMULA_PREFIX_RE.test(raw) ? `'${raw}` : raw;
  const needsQuotes =
    neutralized.includes(',') ||
    neutralized.includes('"') ||
    neutralized.includes('\n') ||
    neutralized.includes('\r') ||
    neutralized.startsWith("'");
  if (!needsQuotes) return neutralized;
  return `"${neutralized.replace(/"/g, '""')}"`;
}
