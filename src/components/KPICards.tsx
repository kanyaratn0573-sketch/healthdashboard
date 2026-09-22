import React from 'react';
import { Users, UserCheck, MapPin, Scale, Ruler, Activity, Droplets, ShieldAlert, TrendingUp } from 'lucide-react';
import { KPIOverview } from '../types';

interface KPICardsProps {
  kpis: KPIOverview;
}

export const KPICards: React.FC<KPICardsProps> = ({ kpis }) => {
  return (
    <section id="kpi-summary-cards" className="mb-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-6 rounded-full bg-gradient-to-b from-pink-400 via-amber-300 to-sky-400" />
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 font-['Kanit'] flex items-center gap-2">
            <span>การสรุปข้อมูลสำคัญ (Health Overview KPIs)</span>
            <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700">
              จำนวน • ค่าเฉลี่ย • ค่าต่ำสุด-สูงสุด • สัดส่วน • ร้อยละ
            </span>
          </h2>
        </div>
      </div>

      {/* Grid of 6 Main Pastel Rainbow KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        
        {/* Card 1: จำนวนผู้ใช้ (Pastel Pink) */}
        <div id="kpi-card-total-users" className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-pink-50/90 to-rose-50/50 border border-pink-200/80 p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-pink-700 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">จำนวนผู้ใช้ทั้งหมด</span>
            <div className="p-2 rounded-xl bg-pink-100 text-pink-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 font-['Kanit']">
              {kpis.totalUsers}
              <span className="text-xs font-medium text-slate-500 ml-1.5 font-sans">ราย</span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              ผู้เข้ารับการตรวจคัดกรอง
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-pink-200/60 flex items-center justify-between text-[11px] text-slate-600">
            <span>คิดเป็นสัดส่วน</span>
            <strong className="text-pink-700 font-semibold">100%</strong>
          </div>
        </div>

        {/* Card 2: เพศ & สัดส่วนร้อยละ (Pastel Peach/Orange) */}
        <div id="kpi-card-gender" className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-orange-50/90 to-amber-50/50 border border-orange-200/80 p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-orange-700 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">เพศ & สัดส่วน</span>
            <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-sky-700 font-['Kanit']">
                ชาย {kpis.maleCount}
              </span>
              <span className="text-slate-300 font-light">|</span>
              <span className="text-lg font-bold text-rose-600 font-['Kanit']">
                หญิง {kpis.femaleCount}
              </span>
            </div>
            <div className="w-full bg-slate-200/70 h-2 rounded-full mt-2 overflow-hidden flex">
              <div
                className="bg-sky-400 h-full"
                style={{ width: `${kpis.maleRatio}%` }}
                title={`ชาย: ${kpis.maleRatio}%`}
              />
              <div
                className="bg-pink-400 h-full"
                style={{ width: `${kpis.femaleRatio}%` }}
                title={`หญิง: ${kpis.femaleRatio}%`}
              />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-orange-200/60 flex items-center justify-between text-[11px] text-slate-600">
            <span>ร้อยละ (ชาย : หญิง)</span>
            <strong className="text-orange-800 font-semibold">{kpis.maleRatio}% : {kpis.femaleRatio}%</strong>
          </div>
        </div>

        {/* Card 3: พื้นที่คัดกรอง (Pastel Yellow) */}
        <div id="kpi-card-area" className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-amber-50/90 to-yellow-50/50 border border-amber-200/80 p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-800 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">พื้นที่สำรวจ</span>
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 font-['Kanit']">
              {kpis.areaCount}
              <span className="text-xs font-medium text-slate-500 ml-1.5 font-sans">หมู่บ้าน/เขต</span>
            </div>
            <p className="text-xs text-slate-600 mt-1 truncate" title={kpis.topArea}>
              สูงสุด: <strong className="text-amber-900 font-medium">{kpis.topArea}</strong>
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-amber-200/60 flex items-center justify-between text-[11px] text-slate-600">
            <span>จำนวนในพื้นที่สูงสุด</span>
            <strong className="text-amber-800 font-semibold">
              {kpis.topAreaCount} ราย ({kpis.totalUsers > 0 ? Math.round((kpis.topAreaCount / kpis.totalUsers) * 100) : 0}%)
            </strong>
          </div>
        </div>

        {/* Card 4: น้ำหนัก (Pastel Mint/Emerald) */}
        <div id="kpi-card-weight" className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-emerald-50/90 to-teal-50/50 border border-emerald-200/80 p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-800 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">น้ำหนัก (Weight)</span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 font-['Kanit']">
              {kpis.weightAvg}
              <span className="text-xs font-medium text-slate-500 ml-1.5 font-sans">กก. (เฉลี่ย)</span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              ค่าเฉลี่ยประชากรคัดกรอง
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-emerald-200/60 flex items-center justify-between text-[11px] text-slate-600">
            <span>ต่ำสุด - สูงสุด</span>
            <strong className="text-emerald-800 font-semibold">{kpis.weightMin} - {kpis.weightMax} กก.</strong>
          </div>
        </div>

        {/* Card 5: ส่วนสูง (Pastel Sky Blue) */}
        <div id="kpi-card-height" className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-sky-50/90 to-cyan-50/50 border border-sky-200/80 p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-sky-800 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">ส่วนสูง (Height)</span>
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
              <Ruler className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 font-['Kanit']">
              {kpis.heightAvg}
              <span className="text-xs font-medium text-slate-500 ml-1.5 font-sans">ซม. (เฉลี่ย)</span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              ค่าเฉลี่ยประชากรคัดกรอง
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-sky-200/60 flex items-center justify-between text-[11px] text-slate-600">
            <span>ต่ำสุด - สูงสุด</span>
            <strong className="text-sky-800 font-semibold">{kpis.heightMin} - {kpis.heightMax} ซม.</strong>
          </div>
        </div>

        {/* Card 6: ค่าดัชนีมวลกาย BMI (Pastel Purple/Lavender) */}
        <div id="kpi-card-bmi" className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-purple-50/90 to-violet-50/50 border border-purple-200/80 p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-purple-800 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">ดัชนีมวลกาย (BMI)</span>
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 font-['Kanit']">
              {kpis.bmiAvg}
              <span className="text-xs font-medium text-slate-500 ml-1.5 font-sans">kg/m²</span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              ปกติ {kpis.normalBmiPct}% | ท้วม-อ้วน {Math.round((100 - kpis.normalBmiPct) * 10) / 10}%
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-purple-200/60 flex items-center justify-between text-[11px] text-slate-600">
            <span>ต่ำสุด - สูงสุด</span>
            <strong className="text-purple-800 font-semibold">{kpis.bmiMin} - {kpis.bmiMax}</strong>
          </div>
        </div>

      </div>

      {/* Secondary Highlights: Traffic Light 3-Zone Breakdown & Clinical Alert KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        
        {/* Risk Zone Red Alert Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 via-rose-50/80 to-white border border-rose-200 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500 text-white shadow-2xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-rose-800 uppercase">
                แถบสีแดง (เสี่ยงสูง/อันตราย)
              </div>
              <div className="text-xl font-bold text-rose-900 font-['Kanit']">
                {kpis.redZoneCount} <span className="text-xs font-normal text-slate-600">ราย</span>
                <span className="ml-2 text-sm font-semibold text-rose-600">({kpis.redZonePct}%)</span>
              </div>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-medium">
            สีแดง + สีดำ
          </span>
        </div>

        {/* Risk Zone Orange Alert Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-amber-50/80 to-white border border-amber-200 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow-2xs">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-amber-800 uppercase">
                แถบสีส้ม (เฝ้าระวัง/ปานกลาง)
              </div>
              <div className="text-xl font-bold text-amber-900 font-['Kanit']">
                {kpis.orangeZoneCount} <span className="text-xs font-normal text-slate-600">ราย</span>
                <span className="ml-2 text-sm font-semibold text-amber-600">({kpis.orangeZonePct}%)</span>
              </div>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-medium">
            สีเหลือง + สีส้ม
          </span>
        </div>

        {/* Risk Zone Green Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-emerald-50/80 to-white border border-emerald-200 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500 text-white shadow-2xs">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-emerald-800 uppercase">
                แถบสีเขียว (ปกติ/เสี่ยงต่ำ)
              </div>
              <div className="text-xl font-bold text-emerald-900 font-['Kanit']">
                {kpis.greenZoneCount} <span className="text-xs font-normal text-slate-600">ราย</span>
                <span className="ml-2 text-sm font-semibold text-emerald-600">({kpis.greenZonePct}%)</span>
              </div>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-medium">
            สีขาว + เขียวอ่อน + เขียวเข้ม
          </span>
        </div>

      </div>
    </section>
  );
};
