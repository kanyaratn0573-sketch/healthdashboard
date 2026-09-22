import React, { useState, useMemo } from 'react';
import {
  Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Eye, Download, ShieldAlert, AlertTriangle, CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { HealthRecord, RiskZone, PingPongColor } from '../types';
import { PINGPONG_COLOR_MAP } from '../data/initialData';

interface DataTableProps {
  records: HealthRecord[];
  onSelectRecord: (record: HealthRecord) => void;
}

export const DataTable: React.FC<DataTableProps> = ({ records, onSelectRecord }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState<RiskZone | 'all'>('all');
  const [selectedColor, setSelectedColor] = useState<PingPongColor | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<keyof HealthRecord>('id');
  const [sortAsc, setSortAsc] = useState(true);

  // Filter records specifically inside the table view
  const filteredList = useMemo(() => {
    return records.filter((item) => {
      // Search by name, HN, or Area
      if (searchTerm.trim()) {
        const q = searchTerm.trim().toLowerCase();
        const mName = item.fullName.toLowerCase().includes(q);
        const mHn = item.hn.toLowerCase().includes(q);
        const mArea = item.area.toLowerCase().includes(q);
        if (!mName && !mHn && !mArea) return false;
      }
      // Zone filter
      if (selectedZone !== 'all' && item.riskZone !== selectedZone) {
        return false;
      }
      // Pingpong color filter
      if (selectedColor !== 'all' && item.pingpongColor !== selectedColor) {
        return false;
      }
      return true;
    });
  }, [records, searchTerm, selectedZone, selectedColor]);

  // Sort
  const sortedList = useMemo(() => {
    return [...filteredList].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortAsc ? aVal.localeCompare(bVal, 'th') : bVal.localeCompare(aVal, 'th');
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortAsc ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [filteredList, sortField, sortAsc]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(sortedList.length / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const pageItems = sortedList.slice(startIndex, startIndex + pageSize);

  const handleSort = (field: keyof HealthRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'รหัส HN',
      'ชื่อ-นามสกุล',
      'เพศ',
      'อายุ',
      'พื้นที่',
      'น้ำหนัก (kg)',
      'ส่วนสูง (cm)',
      'BMI',
      'เกณฑ์ BMI',
      'น้ำตาล_mg_dL',
      'ความดัน_คัดกรอง',
      'ระดับปิงปอง 7 สี',
      'แถบความเสี่ยง',
      'สูบบุหรี่',
      'ดื่มแอลกอฮอล์',
      'การออกกำลังกาย',
      'วันที่คัดกรอง',
    ];

    const rows = sortedList.map((r) => [
      r.hn,
      `"${r.fullName}"`,
      r.gender,
      r.age,
      `"${r.area}"`,
      r.weight,
      r.height,
      r.bmi,
      `"${r.bmiCategory}"`,
      r.sugarMgDl,
      r.bpString,
      `"${r.pingpongColor}"`,
      `"${r.riskZone}"`,
      `"${r.smoking}"`,
      `"${r.alcohol}"`,
      `"${r.exercise}"`,
      r.screeningDate,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `pingpong_7color_health_screening_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="data-detail-table-section" className="bg-white/95 backdrop-blur-md rounded-3xl border border-pink-100 shadow-sm p-5 sm:p-6 mb-8">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-2xs">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800 font-['Kanit']">
                ส่วนรายละเอียดเชิงลึก (Data Table / Detail View)
              </h2>
              <p className="text-xs text-slate-500">
                ตารางแสดงรายละเอียดข้อมูลโดยแบ่งแถบสีตามระดับความเสี่ยง แดง • ส้ม • เขียว
              </p>
            </div>
          </div>
        </div>

        {/* Search & Export */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[240px] flex-1 sm:flex-initial">
            <input
              id="table-person-search"
              type="text"
              placeholder="ค้นหารหัส HN หรือ พื้นที่คัดกรอง..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-hidden text-slate-800 placeholder:text-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <button
            id="btn-export-csv"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
            title="ดาวน์โหลดเป็นไฟล์ CSV สำหรับ Excel"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>ส่งออก CSV</span>
          </button>
        </div>
      </div>

      {/* Risk Zone Quick Filters & Row Counter */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 pb-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-slate-600">แถบสีความเสี่ยง:</span>

          <button
            id="table-zone-filter-all"
            onClick={() => { setSelectedZone('all'); setCurrentPage(1); }}
            className={`px-3 py-1 rounded-xl border font-medium transition-all cursor-pointer ${
              selectedZone === 'all'
                ? 'bg-slate-800 text-white border-slate-800 shadow-2xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            ทั้งหมด ({records.length})
          </button>

          <button
            id="table-zone-filter-red"
            onClick={() => { setSelectedZone('แดง'); setCurrentPage(1); }}
            className={`px-3 py-1 rounded-xl border font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedZone === 'แดง'
                ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
            <span>แถบสีแดง (เสี่ยงสูง/อันตราย)</span>
          </button>

          <button
            id="table-zone-filter-orange"
            onClick={() => { setSelectedZone('ส้ม'); setCurrentPage(1); }}
            className={`px-3 py-1 rounded-xl border font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedZone === 'ส้ม'
                ? 'bg-amber-500 text-white border-amber-500 shadow-2xs'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>แถบสีส้ม (เฝ้าระวัง)</span>
          </button>

          <button
            id="table-zone-filter-green"
            onClick={() => { setSelectedZone('เขียว'); setCurrentPage(1); }}
            className={`px-3 py-1 rounded-xl border font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedZone === 'เขียว'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>แถบสีเขียว (ปกติ/เสี่ยงต่ำ)</span>
          </button>
        </div>

        {/* Page Size Selector */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>แสดงแถว:</span>
          <select
            id="table-page-size-select"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 outline-hidden cursor-pointer"
          >
            <option value={10}>10 รายการ</option>
            <option value={25}>25 รายการ</option>
            <option value={50}>50 รายการ</option>
            <option value={100}>100 รายการ</option>
          </select>
        </div>
      </div>

      {/* Main Responsive Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200/90 shadow-2xs">
        <table id="health-records-table" className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-slate-100 via-pink-50/40 to-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <th className="py-3 px-3 w-16 text-center">แถบสี</th>
              <th
                onClick={() => handleSort('hn')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-200/50 transition-colors"
              >
                รหัส HN
              </th>
              <th
                onClick={() => handleSort('gender')}
                className="py-3 px-2.5 cursor-pointer hover:bg-slate-200/50 transition-colors text-center"
              >
                เพศ
              </th>
              <th
                onClick={() => handleSort('age')}
                className="py-3 px-2.5 cursor-pointer hover:bg-slate-200/50 transition-colors text-center"
              >
                อายุ
              </th>
              <th
                onClick={() => handleSort('area')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-200/50 transition-colors"
              >
                พื้นที่คัดกรอง
              </th>
              <th
                onClick={() => handleSort('bmi')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-200/50 transition-colors text-center"
              >
                BMI (กก./ม.²)
              </th>
              <th
                onClick={() => handleSort('sugarMgDl')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-200/50 transition-colors text-center"
              >
                น้ำตาล (FBS)
              </th>
              <th
                onClick={() => handleSort('bpSystolic')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-200/50 transition-colors text-center"
              >
                ความดัน (BP)
              </th>
              <th className="py-3 px-3 text-center">
                ปิงปอง 7 สี
              </th>
              <th className="py-3 px-3 text-center">
                แถบความเสี่ยง
              </th>
              <th className="py-3 px-3 text-center">
                วันที่
              </th>
              <th className="py-3 px-3 text-center">
                จัดการ
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pageItems.length === 0 ? (
              <tr>
                <td colSpan={12} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Search className="w-8 h-8 text-slate-300" />
                    <p className="text-sm font-medium">ไม่พบรายชื่อหรือข้อมูลที่ตรงกับเงื่อนไขการค้นหา</p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedZone('all');
                        setSelectedColor('all');
                      }}
                      className="text-xs text-pink-600 underline cursor-pointer"
                    >
                      ล้างการค้นหา
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              pageItems.map((item) => {
                const colorConfig = PINGPONG_COLOR_MAP[item.pingpongColor];
                
                // Color stripes and row styling according to requirement 4 (Red, Orange, Green)
                const isRed = item.riskZone === 'แดง';
                const isOrange = item.riskZone === 'ส้ม';
                const isGreen = item.riskZone === 'เขียว';

                const rowBg = isRed
                  ? 'bg-rose-50/40 hover:bg-rose-50/80 transition-colors'
                  : isOrange
                  ? 'bg-amber-50/40 hover:bg-amber-50/80 transition-colors'
                  : 'bg-emerald-50/30 hover:bg-emerald-50/70 transition-colors';

                const stripeColor = isRed
                  ? 'bg-rose-500'
                  : isOrange
                  ? 'bg-amber-500'
                  : 'bg-emerald-500';

                return (
                  <tr key={item.id} className={rowBg}>
                    {/* Visual Risk Stripe */}
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center">
                        <span
                          className={`w-3.5 h-7 rounded-sm ${stripeColor} shadow-2xs`}
                          title={`แถบสี${item.riskZone}`}
                        />
                      </div>
                    </td>

                    {/* HN */}
                    <td className="py-3 px-3 font-mono font-medium text-slate-700">
                      {item.hn}
                    </td>

                    {/* Gender */}
                    <td className="py-3 px-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                        item.gender === 'ชาย' ? 'bg-sky-100 text-sky-800' : 'bg-pink-100 text-pink-800'
                      }`}>
                        {item.gender}
                      </span>
                    </td>

                    {/* Age */}
                    <td className="py-3 px-2.5 text-center font-medium text-slate-700">
                      {item.age}
                    </td>

                    {/* Area */}
                    <td className="py-3 px-3 text-slate-600 max-w-[140px] truncate" title={item.area}>
                      {item.area}
                    </td>

                    {/* BMI */}
                    <td className="py-3 px-3 text-center">
                      <div className="font-semibold text-slate-800">{item.bmi}</div>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                        item.bmiCategory === 'ปกติ'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.bmiCategory.includes('อ้วน')
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.bmiCategory}
                      </span>
                    </td>

                    {/* Sugar (FBS) */}
                    <td className="py-3 px-3 text-center">
                      <span className={`font-semibold ${
                        item.sugarMgDl >= 180
                          ? 'text-rose-600'
                          : item.sugarMgDl >= 126
                          ? 'text-amber-600'
                          : 'text-slate-800'
                      }`}>
                        {item.sugarMgDl}
                      </span>
                      <span className="text-[10px] text-slate-500 block">mg/dL</span>
                    </td>

                    {/* BP */}
                    <td className="py-3 px-3 text-center">
                      <span className={`font-semibold ${
                        item.bpSystolic >= 160 || item.bpDiastolic >= 100
                          ? 'text-rose-600'
                          : item.bpSystolic >= 140 || item.bpDiastolic >= 90
                          ? 'text-amber-600'
                          : 'text-slate-800'
                      }`}>
                        {item.bpString}
                      </span>
                      <span className="text-[10px] text-slate-500 block">mmHg</span>
                    </td>

                    {/* Ping Pong 7 Colors Badge */}
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${colorConfig ? colorConfig.badgeBg + ' ' + colorConfig.badgeBorder + ' ' + colorConfig.badgeText : 'bg-slate-100 text-slate-800'}`}>
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-slate-400"
                          style={{ backgroundColor: colorConfig ? colorConfig.hex : '#94A3B8' }}
                        />
                        <span>สี{item.pingpongColor}</span>
                      </span>
                    </td>

                    {/* Risk Zone Badge (Red, Orange, Green) */}
                    <td className="py-3 px-3 text-center">
                      {isRed && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
                          <ShieldAlert className="w-3 h-3 text-rose-600" />
                          แถบแดง
                        </span>
                      )}
                      {isOrange && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          แถบส้ม
                        </span>
                      )}
                      {isGreen && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          แถบเขียว
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-3 px-3 text-center text-xs text-slate-500 whitespace-nowrap">
                      {item.screeningDate}
                    </td>

                    {/* View Button */}
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => onSelectRecord(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-pink-700 bg-pink-50 hover:bg-pink-100 border border-pink-200 transition-colors cursor-pointer"
                        title="ดูรายละเอียดสุขภาพรายบุคคล"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>เปิดดู</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls (Requirement 5: ระบบนำทาง ทำปุ่มกดเปลี่ยนหน้า) */}
      <div id="table-pagination-controls" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 mt-2 border-t border-slate-100 text-xs sm:text-sm text-slate-600">
        <div>
          แสดง <strong>{sortedList.length === 0 ? 0 : startIndex + 1}</strong> ถึง{' '}
          <strong>{Math.min(startIndex + pageSize, sortedList.length)}</strong> จากทั้งหมด{' '}
          <strong>{sortedList.length}</strong> รายการ
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            id="btn-pagination-first"
            onClick={() => setCurrentPage(1)}
            disabled={validCurrentPage === 1}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
            title="หน้าแรก"
          >
            <ChevronsLeft className="w-4 h-4 text-slate-600" />
          </button>

          <button
            id="btn-pagination-prev"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={validCurrentPage === 1}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
            title="หน้าก่อนหน้า"
          >
            <ChevronLeft className="w-4 h-4 text-slate-600" />
          </button>

          <span className="px-3 py-1.5 font-medium text-slate-800 bg-slate-100 rounded-xl">
            หน้า {validCurrentPage} / {totalPages}
          </span>

          <button
            id="btn-pagination-next"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={validCurrentPage >= totalPages}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
            title="หน้าถัดไป"
          >
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </button>

          <button
            id="btn-pagination-last"
            onClick={() => setCurrentPage(totalPages)}
            disabled={validCurrentPage >= totalPages}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
            title="หน้าสุดท้าย"
          >
            <ChevronsRight className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>
    </section>
  );
};
