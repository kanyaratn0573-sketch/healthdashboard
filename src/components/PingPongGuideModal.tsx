import React from 'react';
import { X, HelpCircle, ShieldCheck } from 'lucide-react';
import { PINGPONG_COLOR_MAP } from '../data/initialData';
import { PingPongColor } from '../types';

interface PingPongGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PingPongGuideModal: React.FC<PingPongGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const colors: PingPongColor[] = ['ขาว', 'เขียวอ่อน', 'เขียวเข้ม', 'เหลือง', 'ส้ม', 'แดง', 'ดำ'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-pink-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Top Rainbow Bar */}
        <div className="h-2.5 bg-gradient-to-r from-pink-300 via-amber-200 via-emerald-200 via-sky-300 to-purple-300" />

        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-pink-100 text-pink-700">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-['Kanit']">
                คู่มือเกณฑ์คัดกรองปิงปองจราจร 7 สี
              </h3>
              <p className="text-xs text-slate-500">
                มาตรฐานกรมควบคุมโรค กระทรวงสาธารณสุข สำหรับเบาหวานและความดันโลหิตสูง
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

        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Overview of 3 Zones */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950">
              <span className="font-bold block text-sm font-['Kanit'] text-emerald-800">
                🟢 แถบสีเขียว (ปกติ / เสี่ยงต่ำ)
              </span>
              <p className="text-xs text-emerald-900/80 mt-1">
                ประกอบด้วย สีขาว, สีเขียวอ่อน, สีเขียวเข้ม (สุขภาพดีหรือคุมได้ดี)
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950">
              <span className="font-bold block text-sm font-['Kanit'] text-amber-800">
                🟠 แถบสีส้ม (เฝ้าระวัง / เสี่ยงปานกลาง)
              </span>
              <p className="text-xs text-amber-900/80 mt-1">
                ประกอบด้วย สีเหลือง, สีส้ม (ควบคุมไม่ดี ต้องปรับเปลี่ยนพฤติกรรม)
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950">
              <span className="font-bold block text-sm font-['Kanit'] text-rose-800">
                🔴 แถบสีแดง (อันตราย / วิกฤต)
              </span>
              <p className="text-xs text-rose-900/80 mt-1">
                ประกอบด้วย สีแดง, สีดำ (คุมไม่ได้ หรือมีภาวะแทรกซ้อน ต้องพบแพทย์ด่วน)
              </p>
            </div>
          </div>

          {/* List of 7 Colors */}
          <div className="space-y-2.5">
            {colors.map((color) => {
              const info = PINGPONG_COLOR_MAP[color];
              return (
                <div
                  key={color}
                  className="p-3 rounded-2xl border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-7 h-7 rounded-xl border border-slate-300 shrink-0 shadow-2xs flex items-center justify-center font-bold text-xs"
                      style={{ backgroundColor: info.hex }}
                    />
                    <div>
                      <div className="font-bold text-slate-800 font-['Kanit'] text-sm">
                        {info.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {info.category}
                      </div>
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <span className="text-xs font-medium text-slate-700 block">
                      เกณฑ์: {info.criteria}
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                      info.zone === 'แดง'
                        ? 'bg-rose-100 text-rose-800'
                        : info.zone === 'ส้ม'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      แถบสี{info.zone}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              อ้างอิง: คู่มือแนวทางการดำเนินงานคลินิก NCD คุณภาพ กรมควบคุมโรค กระทรวงสาธารณสุข
            </span>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs sm:text-sm font-medium bg-slate-800 hover:bg-slate-900 text-white transition-colors cursor-pointer"
          >
            เข้าใจแล้ว
          </button>
        </div>
      </div>
    </div>
  );
};
