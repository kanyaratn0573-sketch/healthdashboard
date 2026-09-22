import React from 'react';
import { Search, RotateCcw, Filter, MapPin, Users, Calendar, AlertTriangle } from 'lucide-react';
import { FilterState, PingPongColor, RiskZone } from '../types';

interface FilterControlsProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  areas: string[];
  totalRecords: number;
  filteredRecordsCount: number;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  areas,
  totalRecords,
  filteredRecordsCount,
}) => {
  const isFiltered =
    filters.searchQuery !== '' ||
    filters.gender !== 'all' ||
    filters.ageGroup !== 'all' ||
    filters.area !== 'all' ||
    filters.riskZone !== 'all' ||
    filters.pingpongColor !== 'all' ||
    filters.bmiCategory !== 'all';

  return (
    <div id="filter-controls-container" className="bg-white/95 backdrop-blur-md rounded-3xl border border-pink-100 shadow-sm p-5 sm:p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-pink-100/70 text-pink-700">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 font-['Kanit']">
              ระบบควบคุมและตัวกรองข้อมูล (Filters)
            </h2>
            <p className="text-xs text-slate-500">
              กรองตามเพศ ช่วงอายุ พื้นที่ และระดับความเสี่ยงปิงปองจราจร 7 สี
            </p>
          </div>
        </div>

        {/* Counter & Reset */}
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            แสดง <strong className="text-pink-600 font-bold">{filteredRecordsCount}</strong> จากทั้งหมด {totalRecords} ราย
          </span>

          {isFiltered && (
            <button
              id="btn-reset-filters"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              ล้างตัวกรอง
            </button>
          )}
        </div>
      </div>

      {/* Main Filter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        {/* 1. Search Query */}
        <div className="space-y-1.5">
          <label htmlFor="filter-search-input" className="block text-xs font-semibold text-slate-700">
            ค้นหาชื่อ หรือ รหัสบุคคล
          </label>
          <div className="relative">
            <input
              id="filter-search-input"
              type="text"
              placeholder="ค้นหารหัส HN, พื้นที่..."
              value={filters.searchQuery}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
              className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50/70 focus:bg-white rounded-xl border border-slate-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-hidden text-slate-800 placeholder:text-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* 2. Gender (เพศ) */}
        <div className="space-y-1.5">
          <label htmlFor="filter-gender-select" className="block text-xs font-semibold text-slate-700 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-pink-500" />
            เพศ
          </label>
          <select
            id="filter-gender-select"
            value={filters.gender}
            onChange={(e) => onFilterChange({ gender: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-slate-50/70 focus:bg-white rounded-xl border border-slate-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-hidden text-slate-800 cursor-pointer"
          >
            <option value="all">เพศทั้งหมด</option>
            <option value="ชาย">ชาย</option>
            <option value="หญิง">หญิง</option>
          </select>
        </div>

        {/* 3. Age Group (ช่วงอายุ) */}
        <div className="space-y-1.5">
          <label htmlFor="filter-age-select" className="block text-xs font-semibold text-slate-700 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-sky-500" />
            ช่วงอายุ
          </label>
          <select
            id="filter-age-select"
            value={filters.ageGroup}
            onChange={(e) => onFilterChange({ ageGroup: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-slate-50/70 focus:bg-white rounded-xl border border-slate-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-hidden text-slate-800 cursor-pointer"
          >
            <option value="all">ทุกช่วงอายุ</option>
            <option value="<40">น้อยกว่า 40 ปี (วัยหนุ่มสาว)</option>
            <option value="40-59">40 - 59 ปี (วัยกลางคน)</option>
            <option value="60+">60 ปีขึ้นไป (ผู้สูงอายุ)</option>
          </select>
        </div>

        {/* 4. Area (พื้นที่) */}
        <div className="space-y-1.5">
          <label htmlFor="filter-area-select" className="block text-xs font-semibold text-slate-700 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
            พื้นที่คัดกรอง
          </label>
          <select
            id="filter-area-select"
            value={filters.area}
            onChange={(e) => onFilterChange({ area: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-slate-50/70 focus:bg-white rounded-xl border border-slate-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-hidden text-slate-800 cursor-pointer"
          >
            <option value="all">ทุกพื้นที่ ({areas.length} พื้นที่)</option>
            {areas.map((areaName) => (
              <option key={areaName} value={areaName}>
                {areaName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Secondary Quick Filter Pills: 3 Risk Zones & 7 Ping-pong colors */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-slate-600 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            แถบสีความเสี่ยง:
          </span>

          <button
            id="filter-zone-all"
            type="button"
            onClick={() => onFilterChange({ riskZone: 'all' })}
            className={`px-2.5 py-1 rounded-lg border font-medium transition-all cursor-pointer ${
              filters.riskZone === 'all'
                ? 'bg-slate-800 text-white border-slate-800'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            ทุกโซน
          </button>

          <button
            id="filter-zone-green"
            type="button"
            onClick={() => onFilterChange({ riskZone: 'เขียว' })}
            className={`px-2.5 py-1 rounded-lg border font-medium transition-all cursor-pointer flex items-center gap-1 ${
              filters.riskZone === 'เขียว'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            แถบเขียว (ปกติ/เสี่ยงต่ำ)
          </button>

          <button
            id="filter-zone-orange"
            type="button"
            onClick={() => onFilterChange({ riskZone: 'ส้ม' })}
            className={`px-2.5 py-1 rounded-lg border font-medium transition-all cursor-pointer flex items-center gap-1 ${
              filters.riskZone === 'ส้ม'
                ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            แถบส้ม (เฝ้าระวัง/ปานกลาง)
          </button>

          <button
            id="filter-zone-red"
            type="button"
            onClick={() => onFilterChange({ riskZone: 'แดง' })}
            className={`px-2.5 py-1 rounded-lg border font-medium transition-all cursor-pointer flex items-center gap-1 ${
              filters.riskZone === 'แดง'
                ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            แถบแดง (เสี่ยงสูง/อันตราย)
          </button>
        </div>
      </div>
    </div>
  );
};
