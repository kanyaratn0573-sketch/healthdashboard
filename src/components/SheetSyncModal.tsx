import React, { useState } from 'react';
import { X, RefreshCw, FileSpreadsheet, Upload, CheckCircle2, AlertCircle, Link as LinkIcon, Info } from 'lucide-react';
import { SheetConnectionState, parseCSVToHealthRecords } from '../services/sheetService';
import { HealthRecord } from '../types';

interface SheetSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  connection: SheetConnectionState;
  onSyncSheet: (sheetId: string) => Promise<void>;
  onImportCustomData: (records: HealthRecord[], sourceLabel: string) => void;
  isRefreshing: boolean;
}

export const SheetSyncModal: React.FC<SheetSyncModalProps> = ({
  isOpen,
  onClose,
  connection,
  onSyncSheet,
  onImportCustomData,
  isRefreshing,
}) => {
  const [sheetIdInput, setSheetIdInput] = useState(connection.sheetId);
  const [csvTextInput, setCsvTextInput] = useState('');
  const [activeTab, setActiveTab] = useState<'sheet' | 'csv' | 'help'>('sheet');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const parsed = parseCSVToHealthRecords(text);
        if (parsed.length > 0) {
          onImportCustomData(parsed, file.name);
          setImportStatus(`นำเข้าข้อมูลสำเร็จ ${parsed.length} รายการจากไฟล์ ${file.name}`);
        } else {
          setImportStatus('ไม่สามารถอ่านข้อมูลจากไฟล์ CSV ได้ กรุณาตรวจสอบหัวตาราง');
        }
      }
    };
    reader.readAsText(file, 'utf-8');
  };

  const handleManualCsvImport = () => {
    if (!csvTextInput.trim()) return;
    const parsed = parseCSVToHealthRecords(csvTextInput);
    if (parsed.length > 0) {
      onImportCustomData(parsed, 'วางข้อมูล CSV โดยตรง');
      setImportStatus(`นำเข้าสำเร็จ ${parsed.length} รายการ`);
      setCsvTextInput('');
    } else {
      setImportStatus('รูปแบบข้อมูลไม่ถูกต้อง กรุณาตรวจสอบข้อมูล CSV');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-pink-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Top Gradient */}
        <div className="h-2.5 bg-gradient-to-r from-emerald-300 via-teal-200 via-sky-300 to-indigo-300" />

        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-700">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-['Kanit']">
                การเชื่อมต่อ Google Sheet & ข้อมูล
              </h3>
              <p className="text-xs text-slate-500">
                จัดการ Sheet ID, ทดสอบการซิงค์ หรือนำเข้าไฟล์ข้อมูลสำรวจ
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-100 text-xs">
          <button
            onClick={() => setActiveTab('sheet')}
            className={`pb-3 font-semibold transition-all border-b-2 cursor-pointer ${
              activeTab === 'sheet'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Google Sheet ID
          </button>
          <button
            onClick={() => setActiveTab('csv')}
            className={`pb-3 font-semibold transition-all border-b-2 cursor-pointer ${
              activeTab === 'csv'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            นำเข้าไฟล์ CSV / วางข้อมูล
          </button>
          <button
            onClick={() => setActiveTab('help')}
            className={`pb-3 font-semibold transition-all border-b-2 cursor-pointer ${
              activeTab === 'help'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            วิธีเปิดสิทธิ์ Sheet ให้เข้าถึงได้
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {importStatus && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{importStatus}</span>
            </div>
          )}

          {activeTab === 'sheet' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">สถานะการเชื่อมต่อปัจจุบัน:</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                    connection.isConnected
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {connection.isConnected ? 'พร้อมใช้งาน' : 'รอการเชื่อมต่อ'}
                  </span>
                </div>
                <div className="text-xs text-slate-600">
                  จำนวนข้อมูลในระบบ: <strong className="text-slate-900">{connection.recordCount} ราย</strong>
                </div>
                <div className="text-xs text-slate-600">
                  อัปเดตล่าสุด: <span className="font-medium text-slate-800">{connection.lastUpdated}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Google Sheet ID ที่เชื่อมโยง
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={sheetIdInput}
                    onChange={(e) => setSheetIdInput(e.target.value)}
                    placeholder="1aFmQz6_FkvGbuxfyuBvvYVzI5WrfNgVIlm4lwTPbDEI"
                    className="flex-1 px-3 py-2 text-xs sm:text-sm font-mono bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-emerald-500 outline-hidden"
                  />
                  <button
                    onClick={() => onSyncSheet(sheetIdInput)}
                    disabled={isRefreshing}
                    className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span>{isRefreshing ? 'กำลังซิงค์...' : 'ซิงค์ข้อมูล'}</span>
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-sky-900 text-xs flex items-start gap-2">
                <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  ระบบเชื่อมต่อกับ <strong>Sheet ID: {connection.sheetId}</strong> โดยอัตโนมัติ 
                  เมื่อแชร์เป็นสาธารณะหรือ Publish to Web แล้ว การกดปุ่มซิงค์จะดึงข้อมูลจริงจากชีตทันที
                </div>
              </div>
            </div>
          )}

          {activeTab === 'csv' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  1. อัปโหลดไฟล์ .CSV จากเครื่อง
                </label>
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-2xl bg-slate-50/50 hover:bg-emerald-50/30 transition-all cursor-pointer">
                  <Upload className="w-8 h-8 text-emerald-600 mb-2" />
                  <span className="text-xs font-semibold text-slate-700">คลิกเพื่อเลือกไฟล์ หรือลากไฟล์ CSV มาวางที่นี่</span>
                  <span className="text-[11px] text-slate-400 mt-1">รองรับไฟล์ CSV ส่งออกจาก Google Sheet หรือ Excel</span>
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  2. หรือ วางข้อความ CSV โดยตรง
                </label>
                <textarea
                  rows={4}
                  placeholder={`ชื่อ-นามสกุล,เพศ,อายุ,พื้นที่,น้ำหนัก,ส่วนสูง,น้ำตาล_mg_dL,ความดันโลหิตสูง_คัดกรอง,วันที่คัดกรอง\nนายสมพร ชัยวัฒน์,ชาย,58,หมู่ 1,78,165,164,162/102,2026-09-02`}
                  value={csvTextInput}
                  onChange={(e) => setCsvTextInput(e.target.value)}
                  className="w-full p-3 font-mono text-xs bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-emerald-500 outline-hidden"
                />
                <button
                  onClick={handleManualCsvImport}
                  className="mt-2 px-4 py-2 rounded-xl text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
                >
                  ประมวลผลข้อมูล CSV ที่วาง
                </button>
              </div>
            </div>
          )}

          {activeTab === 'help' && (
            <div className="space-y-3 text-slate-700">
              <h4 className="font-bold text-slate-900 font-['Kanit'] text-sm">
                วิธีตั้งค่าให้ Google Sheet เชื่อมโยงได้ 100%:
              </h4>
              <ol className="list-decimal pl-5 space-y-2 text-xs leading-relaxed">
                <li>
                  เปิด Google Sheet: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">1aFmQz6_FkvGbuxfyuBvvYVzI5WrfNgVIlm4lwTPbDEI</code>
                </li>
                <li>
                  คลิกปุ่ม <strong>แชร์ (Share)</strong> ที่มุมขวาบน
                </li>
                <li>
                  ตรง <em>การเข้าถึงทั่วไป (General access)</em> ให้เปลี่ยนเป็น <strong>ทุกคนที่มีลิงก์ (Anyone with the link)</strong> มีสิทธิ์อ่าน (Viewer)
                </li>
                <li>
                  หรือไปที่เมนู <strong>ไฟล์ (File) &gt; แชร์ (Share) &gt; เผยแพร่ทางเว็บ (Publish to web)</strong> เลือกเผยแพร่เป็น <strong>CSV</strong>
                </li>
                <li>
                  กลับมาที่หน้านี้แล้วกดปุ่ม <strong>"ซิงค์ข้อมูล"</strong> ได้ทันที!
                </li>
              </ol>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs sm:text-sm font-medium bg-slate-800 hover:bg-slate-900 text-white transition-colors cursor-pointer"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};
