import React from 'react';
import { RefreshCw, UserCheck, HeartPulse, Sparkles } from 'lucide-react';
import { SheetConnectionState } from '../services/sheetService';

interface HeaderProps {
  connection: SheetConnectionState;
  onRefresh: () => void;
  onOpenSheetModal: () => void;
  onOpenGuideModal: () => void;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  connection,
  onRefresh,
  onOpenGuideModal,
  isRefreshing,
}) => {
  return (
    <header id="dashboard-header" className="relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-md border border-pink-100 shadow-sm p-6 sm:p-8 mb-6">
      {/* Decorative Pastel Rainbow Gradient Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-300 via-amber-200 via-emerald-200 via-sky-300 to-purple-300" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Titles & Description */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 border border-pink-200 shadow-2xs">
              <HeartPulse className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
              ระบบคัดกรองสุขภาพชุมชน
            </span>

            {/* 7 Color Mini Dots */}
            <div className="flex items-center gap-1 px-2.5 py-1 bg-slate-50 border border-slate-200/80 rounded-full" title="ปิงปองจราจร 7 สี">
              <span className="w-2.5 h-2.5 rounded-full bg-white border border-slate-400" title="ขาว - ปกติ" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 border border-emerald-500" title="เขียวอ่อน - กลุ่มเสี่ยง" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-600 border border-green-700" title="เขียวเข้ม - ป่วยคุมได้ดี" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 border border-yellow-500" title="เหลือง - ป่วยคุมปานกลาง" />
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 border border-orange-600" title="ส้ม - ป่วยเสี่ยงสูง" />
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 border border-red-600" title="แดง - อันตรายวิกฤต" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-900" title="ดำ - มีภาวะแทรกซ้อน" />
            </div>

            <button
              id="btn-guide-modal"
              onClick={onOpenGuideModal}
              className="text-xs text-purple-600 hover:text-purple-800 underline underline-offset-2 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              คู่มือเกณฑ์ 7 สี
            </button>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 font-['Kanit'] flex items-center gap-3">
              <span>คัดกรองสุขภาพปิงปองจราจร 7 สี</span>
              <span className="text-xs sm:text-sm font-normal px-2.5 py-0.5 rounded-lg bg-sky-100 text-sky-800 border border-sky-200">
                เบาหวาน & ความดันโลหิตสูง
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-3xl leading-relaxed">
              แดชบอร์ดติดตามและวิเคราะห์ความเสี่ยงสุขภาพชุมชน จำแนกตามโมเดลปิงปองจราจร 7 สี กรมควบคุมโรค กระทรวงสาธารณสุข
              เชื่อมโยงฐานข้อมูลเพื่อการเฝ้าระวังและปรับเปลี่ยนพฤติกรรมเชิงรุก
            </p>
          </div>

          {/* Author Badge & Date Info */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-1 text-xs sm:text-sm text-slate-600">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50 text-purple-800 border border-purple-200/80 font-medium">
              <UserCheck className="w-4 h-4 text-purple-600" />
              <span>ชื่อผู้จัดทำ: </span>
              <strong className="text-purple-900 font-semibold font-['Kanit']">กันยารัตน์  ศรีธาตุ</strong>
            </div>

            <div className="flex items-center gap-1.5 text-slate-500">
              <span>อัปเดตล่าสุด:</span>
              <span className="font-medium text-slate-700">{connection.lastUpdated || 'กำลังโหลด...'}</span>
            </div>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            id="btn-refresh-data"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer disabled:opacity-50"
            title="รีเฟรชข้อมูล"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'กำลังซิงค์...' : 'รีเฟรชข้อมูล'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
