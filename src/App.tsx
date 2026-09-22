import React, { useState, useEffect, useMemo } from 'react';
import {
  fetchGoogleSheetData,
  computeKPIs,
  filterRecords,
  SheetConnectionState,
  GOOGLE_SHEET_ID
} from './services/sheetService';
import { HealthRecord, FilterState } from './types';
import { Header } from './components/Header';
import { FilterControls } from './components/FilterControls';
import { KPICards } from './components/KPICards';
import { Visualizations } from './components/Visualizations';
import { DataTable } from './components/DataTable';
import { IndividualDetailModal } from './components/IndividualDetailModal';
import { PingPongGuideModal } from './components/PingPongGuideModal';
import { SheetSyncModal } from './components/SheetSyncModal';
import {
  LayoutDashboard,
  BarChart3,
  Table as TableIcon,
  HelpCircle,
  ExternalLink,
  Heart
} from 'lucide-react';

const initialFilters: FilterState = {
  searchQuery: '',
  gender: 'all',
  ageGroup: 'all',
  area: 'all',
  riskZone: 'all',
  pingpongColor: 'all',
  bmiCategory: 'all',
};

export default function App() {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [connection, setConnection] = useState<SheetConnectionState>({
    sheetId: GOOGLE_SHEET_ID,
    isConnected: true,
    isLive: false,
    lastUpdated: '',
    sourceType: 'cached-sheet',
    recordCount: 0,
  });
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<'all' | 'kpi' | 'charts' | 'table'>('all');

  // Load data on startup
  useEffect(() => {
    loadData(GOOGLE_SHEET_ID);
  }, []);

  const loadData = async (sheetId: string) => {
    setIsRefreshing(true);
    try {
      const res = await fetchGoogleSheetData(sheetId);
      setRecords(res.records);
      setConnection(res.connection);
    } catch {
      // Fallback handled in service
    } finally {
      setIsRefreshing(false);
    }
  };

  // Distinct areas for filter dropdown
  const areas = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => set.add(r.area));
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'th'));
  }, [records]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return filterRecords(records, filters);
  }, [records, filters]);

  // KPIs
  const kpis = useMemo(() => {
    return computeKPIs(filteredRecords);
  }, [filteredRecords]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  const handleImportCustomData = (importedRecords: HealthRecord[], sourceLabel: string) => {
    setRecords(importedRecords);
    setConnection({
      sheetId: connection.sheetId,
      isConnected: true,
      isLive: true,
      lastUpdated: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      sourceType: 'imported-file',
      recordCount: importedRecords.length,
      error: undefined,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/50 via-purple-50/30 via-sky-50/40 to-amber-50/40 text-slate-800 flex flex-col font-['Sarabun',sans-serif]">
      {/* Top Floating App Bar */}
      <div className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-pink-100 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-pink-500 animate-pulse" />
            <span className="font-bold text-slate-900 font-['Kanit'] text-sm sm:text-base tracking-tight truncate">
              คัดกรองสุขภาพปิงปองจราจร 7 สี
            </span>
            <span className="hidden md:inline-flex text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
              ผู้จัดทำ: กันยารัตน์ ศรีธาตุ
            </span>
          </div>

          {/* Quick Navigation Tabs (Requirement 5) */}
          <nav className="flex items-center gap-1 sm:gap-1.5 text-xs">
            <button
              onClick={() => setActiveNav('all')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1 ${
                activeNav === 'all'
                  ? 'bg-slate-800 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">มุมมอง</span>ทั้งหมด
            </button>

            <button
              onClick={() => {
                setActiveNav('kpi');
                document.getElementById('kpi-summary-cards')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1 ${
                activeNav === 'kpi'
                  ? 'bg-pink-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>KPIs</span>
            </button>

            <button
              onClick={() => {
                setActiveNav('charts');
                document.getElementById('visualizations-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1 ${
                activeNav === 'charts'
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>กราฟวิเคราะห์</span>
            </button>

            <button
              onClick={() => {
                setActiveNav('table');
                document.getElementById('data-detail-table-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1 ${
                activeNav === 'table'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>ตาราง 7 สี</span>
            </button>

            <button
              onClick={() => setIsGuideModalOpen(true)}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-all cursor-pointer flex items-center gap-1"
              title="คู่มือเกณฑ์ 7 สี"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden md:inline">เกณฑ์ 7 สี</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 1. ส่วนหัวและระบบควบคุม (Header & Controls) */}
        <Header
          connection={connection}
          onRefresh={() => loadData(connection.sheetId)}
          onOpenSheetModal={() => setIsSheetModalOpen(true)}
          onOpenGuideModal={() => setIsGuideModalOpen(true)}
          isRefreshing={isRefreshing}
        />

        {/* 1.1 Filters Control Bar */}
        <FilterControls
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          areas={areas}
          totalRecords={records.length}
          filteredRecordsCount={filteredRecords.length}
        />

        {/* 2. การสรุปข้อมูลสำคัญ (KPI Cards / Summary Cards) */}
        {(activeNav === 'all' || activeNav === 'kpi') && (
          <KPICards kpis={kpis} />
        )}

        {/* 3. ส่วนการวิเคราะห์ด้วยภาพ (Visualizations / Charts) */}
        {(activeNav === 'all' || activeNav === 'charts') && (
          <Visualizations records={filteredRecords} />
        )}

        {/* 4. ส่วนรายละเอียดเชิงลึก (Data Table / Detail View) & 5. ระบบนำทาง */}
        {(activeNav === 'all' || activeNav === 'table') && (
          <DataTable
            records={filteredRecords}
            onSelectRecord={(rec) => setSelectedRecord(rec)}
          />
        )}
      </main>

      {/* Modals */}
      <IndividualDetailModal
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />

      <PingPongGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      <SheetSyncModal
        isOpen={isSheetModalOpen}
        onClose={() => setIsSheetModalOpen(false)}
        connection={connection}
        onSyncSheet={loadData}
        onImportCustomData={handleImportCustomData}
        isRefreshing={isRefreshing}
      />

      {/* Modern Footer */}
      <footer className="bg-white/80 border-t border-pink-100 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>
              ระบบคัดกรองสุขภาพปิงปองจราจร 7 สี • พัฒนาโดย{' '}
              <strong className="text-slate-800 font-semibold font-['Kanit']">กันยารัตน์  ศรีธาตุ</strong>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-slate-600 hover:text-emerald-700 transition-colors"
            >
              <span>เปิด Google Sheet</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-300">|</span>
            <span>มาตรฐานกรมควบคุมโรค กระทรวงสาธารณสุข</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
