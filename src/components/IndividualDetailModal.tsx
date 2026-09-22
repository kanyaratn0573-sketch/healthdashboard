import React from 'react';
import { X, Heart, Activity, AlertCircle, Droplets, Scale, MapPin, Calendar, Cigarette, Wine, Dumbbell } from 'lucide-react';
import { HealthRecord } from '../types';
import { PINGPONG_COLOR_MAP } from '../data/initialData';

interface IndividualDetailModalProps {
  record: HealthRecord | null;
  onClose: () => void;
}

export const IndividualDetailModal: React.FC<IndividualDetailModalProps> = ({ record, onClose }) => {
  if (!record) return null;

  const colorConfig = PINGPONG_COLOR_MAP[record.pingpongColor];
  const isRed = record.riskZone === 'แดง';
  const isOrange = record.riskZone === 'ส้ม';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-pink-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Top Header with Rainbow Gradient Accent */}
        <div className="h-2.5 bg-gradient-to-r from-pink-300 via-amber-200 via-emerald-200 via-sky-300 to-purple-300" />

        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm border border-slate-300"
              style={{ backgroundColor: colorConfig ? colorConfig.hex : '#F8FAFC' }}
            >
              {record.gender === 'ชาย' ? '👨' : '👩'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                  {record.hn}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  record.gender === 'ชาย' ? 'bg-sky-100 text-sky-800' : 'bg-pink-100 text-pink-800'
                }`}>
                  เพศ{record.gender} • {record.age} ปี
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-['Kanit'] mt-1">
                {record.fullName}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Ping Pong 7 Colors Big Status Banner */}
          <div className={`p-4 rounded-2xl border ${
            isRed
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : isOrange
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-4 h-4 rounded-full border border-slate-400 shrink-0"
                  style={{ backgroundColor: colorConfig ? colorConfig.hex : '#94A3B8' }}
                />
                <span className="font-bold text-base font-['Kanit']">
                  ระดับปิงปองจราจร: {colorConfig ? colorConfig.name : record.pingpongColor}
                </span>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                isRed ? 'bg-rose-200 text-rose-900' : isOrange ? 'bg-amber-200 text-amber-900' : 'bg-emerald-200 text-emerald-900'
              }`}>
                แถบสี{record.riskZone}
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed opacity-90">
              {record.riskDescription}
            </p>
          </div>

          {/* Clinical Vital Signs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Blood Sugar (FBS) */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <Droplets className="w-3.5 h-3.5 text-rose-500" />
                <span>น้ำตาล (FBS)</span>
              </div>
              <div className="text-xl font-bold text-slate-900 font-['Kanit']">
                {record.sugarMgDl}
                <span className="text-xs font-normal text-slate-500 ml-1">mg/dL</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {record.sugarMgDl < 100 ? 'ระดับปกติ' : record.sugarMgDl < 126 ? 'กลุ่มเสี่ยง' : 'เบาหวาน'}
              </div>
            </div>

            {/* Blood Pressure (BP) */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                <span>ความดัน (BP)</span>
              </div>
              <div className="text-xl font-bold text-slate-900 font-['Kanit']">
                {record.bpString}
                <span className="text-xs font-normal text-slate-500 ml-1">mmHg</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {record.bpSystolic < 120 ? 'ปกติ' : record.bpSystolic < 140 ? 'เสี่ยง' : 'ความดันสูง'}
              </div>
            </div>

            {/* BMI */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <Scale className="w-3.5 h-3.5 text-purple-500" />
                <span>ค่า BMI</span>
              </div>
              <div className="text-xl font-bold text-slate-900 font-['Kanit']">
                {record.bmi}
                <span className="text-xs font-normal text-slate-500 ml-1">kg/m²</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {record.bmiCategory}
              </div>
            </div>

            {/* Weight / Height */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <Activity className="w-3.5 h-3.5 text-sky-500" />
                <span>น้ำหนัก / สูง</span>
              </div>
              <div className="text-base font-bold text-slate-900 font-['Kanit']">
                {record.weight} กก.
              </div>
              <div className="text-xs text-slate-600 font-medium">
                {record.height} ซม.
              </div>
            </div>
          </div>

          {/* Area & Screening Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2 text-slate-700">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>พื้นที่: <strong>{record.area}</strong></span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2 text-slate-700">
              <Calendar className="w-4 h-4 text-sky-600 shrink-0" />
              <span>วันที่คัดกรอง: <strong>{record.screeningDate}</strong></span>
            </div>
          </div>

          {/* Behaviors */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              พฤติกรรมสุขภาพที่บันทึก
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                <Cigarette className="w-4 h-4 text-slate-500 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">การสูบบุหรี่</span>
                  <span className="font-semibold text-slate-800">{record.smoking}</span>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                <Wine className="w-4 h-4 text-slate-500 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">การดื่มแอลกอฮอล์</span>
                  <span className="font-semibold text-slate-800">{record.alcohol}</span>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-slate-500 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">การออกกำลังกาย</span>
                  <span className="font-semibold text-slate-800">{record.exercise}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Medical Notes & Next Action */}
          <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200/80 text-purple-950">
            <div className="flex items-center gap-1.5 font-bold text-xs mb-1 text-purple-900">
              <AlertCircle className="w-4 h-4 text-purple-600" />
              <span>คำแนะนำการดูแลสุขภาพและแผนการติดตาม:</span>
            </div>
            <p className="text-xs leading-relaxed text-purple-900/90">
              {record.notes || 'ตรวจติดตามสุขภาพประจำปีและควบคุมอาหาร'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs sm:text-sm font-medium bg-slate-800 hover:bg-slate-900 text-white transition-colors cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
