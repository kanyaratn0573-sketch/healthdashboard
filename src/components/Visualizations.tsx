import React, { useState } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  AreaChart, Area, ScatterChart, Scatter, ZAxis
} from 'recharts';
import {
  Activity, TrendingUp, HeartHandshake, AlertOctagon,
  Sparkles, ShieldAlert, BarChart3, PieChartIcon, Zap
} from 'lucide-react';
import { HealthRecord, PingPongColor } from '../types';
import { PINGPONG_COLOR_MAP } from '../data/initialData';

interface VisualizationsProps {
  records: HealthRecord[];
}

export const Visualizations: React.FC<VisualizationsProps> = ({ records }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'risk' | 'trend' | 'behavior' | 'correlation'>('all');

  // 1. Ping Pong 7 Colors distribution
  const pingpongCounts: Record<PingPongColor, number> = {
    'ขาว': 0,
    'เขียวอ่อน': 0,
    'เขียวเข้ม': 0,
    'เหลือง': 0,
    'ส้ม': 0,
    'แดง': 0,
    'ดำ': 0,
  };
  records.forEach((r) => {
    if (pingpongCounts[r.pingpongColor] !== undefined) {
      pingpongCounts[r.pingpongColor]++;
    }
  });

  const pingpongPieData = Object.entries(pingpongCounts).map(([color, count]) => {
    const c = color as PingPongColor;
    const info = PINGPONG_COLOR_MAP[c];
    return {
      name: info ? info.name : color,
      shortName: `สี${color}`,
      value: count,
      colorHex: c === 'ขาว' ? '#E2E8F0' : info.hex,
      percentage: records.length > 0 ? Math.round((count / records.length) * 1000) / 10 : 0,
    };
  }).filter(d => d.value > 0);

  // 2. Area vs Risk Zone (เขียว, ส้ม, แดง)
  const areaRiskMap: Record<string, { green: number; orange: number; red: number; total: number }> = {};
  records.forEach((r) => {
    if (!areaRiskMap[r.area]) {
      areaRiskMap[r.area] = { green: 0, orange: 0, red: 0, total: 0 };
    }
    areaRiskMap[r.area].total++;
    if (r.riskZone === 'เขียว') areaRiskMap[r.area].green++;
    else if (r.riskZone === 'ส้ม') areaRiskMap[r.area].orange++;
    else if (r.riskZone === 'แดง') areaRiskMap[r.area].red++;
  });

  const areaRiskData = Object.entries(areaRiskMap).map(([area, counts]) => ({
    area: area.replace('หมู่ ', 'ม.'),
    fullName: area,
    'แถบเขียว (ปกติ/เสี่ยงต่ำ)': counts.green,
    'แถบส้ม (เฝ้าระวัง)': counts.orange,
    'แถบแดง (เสี่ยงสูง/อันตราย)': counts.red,
    total: counts.total,
    redOrangeRate: Math.round(((counts.orange + counts.red) / counts.total) * 100),
  }));

  // Sort areas by high risk count (Red + Orange)
  const highRiskAreasRanking = [...areaRiskData].sort((a, b) => 
    (b['แถบแดง (เสี่ยงสูง/อันตราย)'] + b['แถบส้ม (เฝ้าระวัง)']) - 
    (a['แถบแดง (เสี่ยงสูง/อันตราย)'] + a['แถบส้ม (เฝ้าระวัง)'])
  );

  // 3. Health Trend: Date vs Screening count
  const dateMap: Record<string, { date: string; count: number; redCount: number }> = {};
  records.forEach((r) => {
    if (!dateMap[r.screeningDate]) {
      dateMap[r.screeningDate] = { date: r.screeningDate, count: 0, redCount: 0 };
    }
    dateMap[r.screeningDate].count++;
    if (r.riskZone === 'แดง') {
      dateMap[r.screeningDate].redCount++;
    }
  });

  const sortedDates = Object.keys(dateMap).sort();
  let cumulative = 0;
  const trendData = sortedDates.map((dateStr) => {
    const item = dateMap[dateStr];
    cumulative += item.count;
    // Format date DD/MM
    const parts = dateStr.split('-');
    const formattedDate = parts.length === 3 ? `${parts[2]}/${parts[1]}` : dateStr;
    return {
      date: formattedDate,
      fullDate: dateStr,
      'จำนวนรายวัน': item.count,
      'จำนวนสะสม': cumulative,
      'ผู้ป่วยเสี่ยงสูง (แดง)': item.redCount,
    };
  });

  // 4. Age Group vs Risk Profile & Mean Sugar/BP
  const ageGroupMap: Record<string, { count: number; redCount: number; orangeCount: number; greenCount: number; sugarSum: number; sbpSum: number }> = {
    'น้อยกว่า 40 ปี': { count: 0, redCount: 0, orangeCount: 0, greenCount: 0, sugarSum: 0, sbpSum: 0 },
    '40 - 59 ปี': { count: 0, redCount: 0, orangeCount: 0, greenCount: 0, sugarSum: 0, sbpSum: 0 },
    '60 ปีขึ้นไป': { count: 0, redCount: 0, orangeCount: 0, greenCount: 0, sugarSum: 0, sbpSum: 0 },
  };

  records.forEach((r) => {
    let key = 'น้อยกว่า 40 ปี';
    if (r.age >= 60) key = '60 ปีขึ้นไป';
    else if (r.age >= 40) key = '40 - 59 ปี';

    ageGroupMap[key].count++;
    ageGroupMap[key].sugarSum += r.sugarMgDl;
    ageGroupMap[key].sbpSum += r.bpSystolic;
    if (r.riskZone === 'แดง') ageGroupMap[key].redCount++;
    else if (r.riskZone === 'ส้ม') ageGroupMap[key].orangeCount++;
    else ageGroupMap[key].greenCount++;
  });

  const ageRiskData = Object.entries(ageGroupMap).map(([group, stats]) => ({
    group,
    total: stats.count,
    'แถบเขียว': stats.greenCount,
    'แถบส้ม': stats.orangeCount,
    'แถบแดง (เสี่ยงสูง)': stats.redCount,
    'อัตราเสี่ยงสูง (%)': stats.count > 0 ? Math.round((stats.redCount / stats.count) * 100) : 0,
    'น้ำตาลเฉลี่ย (mg/dL)': stats.count > 0 ? Math.round(stats.sugarSum / stats.count) : 0,
    'ความดัน SBP เฉลี่ย': stats.count > 0 ? Math.round(stats.sbpSum / stats.count) : 0,
  }));

  // 5. Health Behaviors Breakdown
  const smokingCounts = {
    'ไม่สูบ': records.filter((r) => r.smoking === 'ไม่สูบ').length,
    'เคยสูบแต่เลิกแล้ว': records.filter((r) => r.smoking === 'เคยสูบแต่เลิกแล้ว').length,
    'สูบเป็นประจำ': records.filter((r) => r.smoking === 'สูบเป็นประจำ').length,
  };

  const alcoholCounts = {
    'ไม่ดื่ม': records.filter((r) => r.alcohol === 'ไม่ดื่ม').length,
    'ดื่มนานๆ ครั้ง': records.filter((r) => r.alcohol === 'ดื่มนานๆ ครั้ง').length,
    'ดื่มเป็นประจำ': records.filter((r) => r.alcohol === 'ดื่มเป็นประจำ').length,
  };

  const exerciseCounts = {
    'ไม่ออกกำลังกาย': records.filter((r) => r.exercise === 'ไม่ออกกำลังกาย').length,
    '1-2 วัน/สัปดาห์': records.filter((r) => r.exercise === 'ออกกำลังกาย 1-2 วัน/สัปดาห์').length,
    '≥3 วัน/สัปดาห์': records.filter((r) => r.exercise === 'ออกกำลังกายสม่ำเสมอ ≥3 วัน/สัปดาห์').length,
  };

  const behaviorBarData = [
    {
      category: 'การสูบบุหรี่',
      'ระดับปลอดภัย (ไม่สูบ/ไม่ดื่ม/ออกสม่ำเสมอ)': smokingCounts['ไม่สูบ'],
      'ระดับปานกลาง (เคยสูบ/ดื่มนานๆ ครั้ง/ออกบ้าง)': smokingCounts['เคยสูบแต่เลิกแล้ว'],
      'พฤติกรรมเสี่ยงสูง (สูบประจำ/ดื่มประจำ/ไม่ออกกำลัง)': smokingCounts['สูบเป็นประจำ'],
    },
    {
      category: 'การดื่มแอลกอฮอล์',
      'ระดับปลอดภัย (ไม่สูบ/ไม่ดื่ม/ออกสม่ำเสมอ)': alcoholCounts['ไม่ดื่ม'],
      'ระดับปานกลาง (เคยสูบ/ดื่มนานๆ ครั้ง/ออกบ้าง)': alcoholCounts['ดื่มนานๆ ครั้ง'],
      'พฤติกรรมเสี่ยงสูง (สูบประจำ/ดื่มประจำ/ไม่ออกกำลัง)': alcoholCounts['ดื่มเป็นประจำ'],
    },
    {
      category: 'การออกกำลังกาย',
      'ระดับปลอดภัย (ไม่สูบ/ไม่ดื่ม/ออกสม่ำเสมอ)': exerciseCounts['≥3 วัน/สัปดาห์'],
      'ระดับปานกลาง (เคยสูบ/ดื่มนานๆ ครั้ง/ออกบ้าง)': exerciseCounts['1-2 วัน/สัปดาห์'],
      'พฤติกรรมเสี่ยงสูง (สูบประจำ/ดื่มประจำ/ไม่ออกกำลัง)': exerciseCounts['ไม่ออกกำลังกาย'],
    },
  ];

  // 6. Behavior vs Risk Cross-Analysis
  const exerciseRiskData = [
    {
      habit: 'ไม่ออกกำลังกาย',
      'แถบเขียว': records.filter(r => r.exercise === 'ไม่ออกกำลังกาย' && r.riskZone === 'เขียว').length,
      'แถบส้ม': records.filter(r => r.exercise === 'ไม่ออกกำลังกาย' && r.riskZone === 'ส้ม').length,
      'แถบแดง (เสี่ยงสูง)': records.filter(r => r.exercise === 'ไม่ออกกำลังกาย' && r.riskZone === 'แดง').length,
    },
    {
      habit: 'ออกกำลัง 1-2 วัน/สัปดาห์',
      'แถบเขียว': records.filter(r => r.exercise === 'ออกกำลังกาย 1-2 วัน/สัปดาห์' && r.riskZone === 'เขียว').length,
      'แถบส้ม': records.filter(r => r.exercise === 'ออกกำลังกาย 1-2 วัน/สัปดาห์' && r.riskZone === 'ส้ม').length,
      'แถบแดง (เสี่ยงสูง)': records.filter(r => r.exercise === 'ออกกำลังกาย 1-2 วัน/สัปดาห์' && r.riskZone === 'แดง').length,
    },
    {
      habit: 'ออกกำลังกาย ≥3 วัน/สัปดาห์',
      'แถบเขียว': records.filter(r => r.exercise === 'ออกกำลังกายสม่ำเสมอ ≥3 วัน/สัปดาห์' && r.riskZone === 'เขียว').length,
      'แถบส้ม': records.filter(r => r.exercise === 'ออกกำลังกายสม่ำเสมอ ≥3 วัน/สัปดาห์' && r.riskZone === 'ส้ม').length,
      'แถบแดง (เสี่ยงสูง)': records.filter(r => r.exercise === 'ออกกำลังกายสม่ำเสมอ ≥3 วัน/สัปดาห์' && r.riskZone === 'แดง').length,
    },
  ];

  // 7. BMI vs Sugar & BMI vs BP Correlation (Scatter sample capped for performance)
  const scatterRecords = records.slice(0, 80).map((r) => ({
    name: r.fullName,
    bmi: r.bmi,
    sugar: r.sugarMgDl,
    sbp: r.bpSystolic,
    dbp: r.bpDiastolic,
    zone: r.riskZone,
    color: r.riskZone === 'แดง' ? '#EF4444' : r.riskZone === 'ส้ม' ? '#F59E0B' : '#10B981',
  }));

  return (
    <section id="visualizations-section" className="mb-8">
      {/* Visualizations Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-6 rounded-full bg-gradient-to-b from-sky-400 via-pink-400 to-purple-400" />
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 font-['Kanit'] flex items-center gap-2">
              <span>ส่วนการวิเคราะห์ด้วยภาพ (Visualizations & Insights)</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                กราฟและแผนภูมิเชิงลึก
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              วิเคราะห์ความเสี่ยง (Risk), แนวโน้ม (Trend), พฤติกรรม (Behavior) และความสัมพันธ์ของข้อมูล
            </p>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <button
            id="tab-view-all"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            แสดงทั้งหมด
          </button>
          <button
            id="tab-view-risk"
            onClick={() => setActiveTab('risk')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'risk'
                ? 'bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            วิเคราะห์ความเสี่ยง
          </button>
          <button
            id="tab-view-trend"
            onClick={() => setActiveTab('trend')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'trend'
                ? 'bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            แนวโน้มคัดกรอง
          </button>
          <button
            id="tab-view-behavior"
            onClick={() => setActiveTab('behavior')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'behavior'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            พฤติกรรมสุขภาพ
          </button>
          <button
            id="tab-view-correlation"
            onClick={() => setActiveTab('correlation')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'correlation'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            ความสัมพันธ์ BMI
          </button>
        </div>
      </div>

      {/* Grid of Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 1. Health Risk: Donut Chart ปิงปองจราจร 7 สี */}
        {(activeTab === 'all' || activeTab === 'risk') && (
          <div id="chart-card-pingpong-donut" className="bg-white rounded-3xl border border-pink-100 shadow-sm p-5 sm:p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-pink-100 text-pink-600">
                  <PieChartIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 font-['Kanit']">
                    สัดส่วนตามระดับปิงปองจราจร 7 สี
                  </h3>
                  <p className="text-xs text-slate-500">
                    จำแนกกลุ่มปกติ เสี่ยง ป่วย และภาวะแทรกซ้อน
                  </p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
                รวม {records.length} ราย
              </span>
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pingpongPieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={3}
                  >
                    {pingpongPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.colorHex} stroke="#94A3B8" strokeWidth={1} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val, name, item) => [
                      `${val} ราย (${item.payload.percentage}%)`,
                      `${name}`
                    ]}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Micro Ping-Pong Badges */}
            <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              {pingpongPieData.slice(0, 4).map((item) => (
                <div key={item.name} className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0 border border-slate-400" style={{ backgroundColor: item.colorHex }} />
                  <span className="truncate text-slate-700">{item.shortName}: <strong>{item.value}</strong></span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Health Risk: พื้นที่ vs ระดับความเสี่ยง (Stacked Bar Chart) */}
        {(activeTab === 'all' || activeTab === 'risk') && (
          <div id="chart-card-area-risk" className="bg-white rounded-3xl border border-pink-100 shadow-sm p-5 sm:p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 font-['Kanit']">
                    การกระจายความเสี่ยงตามพื้นที่ (Area vs Risk)
                  </h3>
                  <p className="text-xs text-slate-500">
                    เปรียบเทียบสัดส่วนแถบสี เขียว / ส้ม / แดง รายหมู่บ้าน
                  </p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 font-medium border border-amber-200">
                รายพื้นที่
              </span>
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={areaRiskData} margin={{ top: 10, right: 10, left: -15, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="area" tick={{ fontSize: 10, fill: '#64748B' }} angle={-25} textAnchor="end" />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="แถบเขียว (ปกติ/เสี่ยงต่ำ)" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="แถบส้ม (เฝ้าระวัง)" stackId="a" fill="#F59E0B" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="แถบแดง (เสี่ยงสูง/อันตราย)" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
              <span>พื้นที่เสี่ยงสีแดงสูงสุด:</span>
              <strong className="text-rose-700">{highRiskAreasRanking[0]?.fullName || '-'}</strong>
            </div>
          </div>
        )}

        {/* 3. Health Trend: วันที่คัดกรอง vs จำนวนผู้รับคัดกรอง (Area Chart) */}
        {(activeTab === 'all' || activeTab === 'trend') && (
          <div id="chart-card-screening-trend" className="bg-white rounded-3xl border border-pink-100 shadow-sm p-5 sm:p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 font-['Kanit']">
                    แนวโน้มการคัดกรองสุขภาพ (Health Trend)
                  </h3>
                  <p className="text-xs text-slate-500">
                    จำนวนผู้รับการตรวจรายวันและยอดสะสมตามช่วงเวลา
                  </p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-sky-50 text-sky-800 font-medium border border-sky-200">
                ช่วง ก.ย. 2026
              </span>
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -15, bottom: 10 }}>
                  <defs>
                    <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.05}/>
                    </linearGradient>
                    <linearGradient id="colorDaily" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EC4899" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#EC4899" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="จำนวนสะสม" stroke="#0284C7" strokeWidth={2} fillOpacity={1} fill="url(#colorCumulative)" />
                  <Area type="monotone" dataKey="จำนวนรายวัน" stroke="#DB2777" strokeWidth={2} fillOpacity={1} fill="url(#colorDaily)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>อัตราการตรวจเฉลี่ย:</span>
              <strong className="text-sky-700">
                {trendData.length > 0 ? Math.round(records.length / trendData.length) : 0} ราย/วัน
              </strong>
            </div>
          </div>
        )}

        {/* 4. Health Behavior: สูบบุหรี่, ดื่มแอลกอฮอล์, ออกกำลังกาย (Grouped Bar Chart) */}
        {(activeTab === 'all' || activeTab === 'behavior') && (
          <div id="chart-card-behavior-overview" className="bg-white rounded-3xl border border-pink-100 shadow-sm p-5 sm:p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 font-['Kanit']">
                    พฤติกรรมสุขภาพของผู้รับการคัดกรอง (Health Behavior)
                  </h3>
                  <p className="text-xs text-slate-500">
                    การสูบบุหรี่ ดื่มแอลกอฮอล์ และการออกกำลังกาย
                  </p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-purple-50 text-purple-800 font-medium border border-purple-200">
                พฤติกรรม 3 มิติ
              </span>
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={behaviorBarData} margin={{ top: 10, right: 10, left: -15, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="ระดับปลอดภัย (ไม่สูบ/ไม่ดื่ม/ออกสม่ำเสมอ)" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="ระดับปานกลาง (เคยสูบ/ดื่มนานๆ ครั้ง/ออกบ้าง)" fill="#FBBF24" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="พฤติกรรมเสี่ยงสูง (สูบประจำ/ดื่มประจำ/ไม่ออกกำลัง)" fill="#F43F5E" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>ผู้ไม่ออกกำลังกาย:</span>
              <strong className="text-rose-600">
                {exerciseCounts['ไม่ออกกำลังกาย']} ราย ({records.length > 0 ? Math.round((exerciseCounts['ไม่ออกกำลังกาย'] / records.length) * 100) : 0}%)
              </strong>
            </div>
          </div>
        )}

        {/* 5. Insight พิเศษ: กลุ่มอายุที่มีความเสี่ยงสูง vs ค่าน้ำตาล/ความดันเฉลี่ย */}
        {(activeTab === 'all' || activeTab === 'risk' || activeTab === 'correlation') && (
          <div id="chart-card-age-risk-insights" className="bg-white rounded-3xl border border-pink-100 shadow-sm p-5 sm:p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 font-['Kanit']">
                    กลุ่มอายุที่มีความเสี่ยงสูง (High Risk by Age Group)
                  </h3>
                  <p className="text-xs text-slate-500">
                    อัตราความเสี่ยงสูงและค่าน้ำตาล-ความดันเฉลี่ยตามวัย
                  </p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 font-medium border border-rose-200">
                ข้อมูลเชิงลึก
              </span>
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageRiskData} margin={{ top: 10, right: 10, left: -15, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="group" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="แถบเขียว" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="แถบส้ม" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="แถบแดง (เสี่ยงสูง)" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
              <span>กลุ่ม 60 ปีขึ้นไป: น้ำตาลเฉลี่ย <strong>{ageGroupMap['60 ปีขึ้นไป'].count > 0 ? Math.round(ageGroupMap['60 ปีขึ้นไป'].sugarSum / ageGroupMap['60 ปีขึ้นไป'].count) : 0} mg/dL</strong></span>
              <span>ความดัน SBP เฉลี่ย <strong>{ageGroupMap['60 ปีขึ้นไป'].count > 0 ? Math.round(ageGroupMap['60 ปีขึ้นไป'].sbpSum / ageGroupMap['60 ปีขึ้นไป'].count) : 0} mmHg</strong></span>
            </div>
          </div>
        )}

        {/* 6. Insight พิเศษ: ความสัมพันธ์ระหว่าง BMI กับ ระดับน้ำตาล และความดัน (Correlation Scatter) */}
        {(activeTab === 'all' || activeTab === 'correlation') && (
          <div id="chart-card-bmi-sugar-scatter" className="bg-white rounded-3xl border border-pink-100 shadow-sm p-5 sm:p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-teal-100 text-teal-700">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 font-['Kanit']">
                    ความสัมพันธ์ระหว่าง BMI กับ น้ำตาล & ความดัน
                  </h3>
                  <p className="text-xs text-slate-500">
                    วิเคราะห์ความเสี่ยงเมื่อค่า BMI เกินเกณฑ์มาตรฐาน 23-25
                  </p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 font-medium border border-teal-200">
                Scatter Plot
              </span>
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 15, left: -15, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis
                    type="number"
                    dataKey="bmi"
                    name="BMI"
                    unit=" kg/m²"
                    domain={[16, 36]}
                    tick={{ fontSize: 11, fill: '#64748B' }}
                  />
                  <YAxis
                    type="number"
                    dataKey="sugar"
                    name="น้ำตาล"
                    unit=" mg/dL"
                    domain={[60, 260]}
                    tick={{ fontSize: 11, fill: '#64748B' }}
                  />
                  <ZAxis type="number" range={[40, 40]} />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ payload }) => {
                      if (!payload || payload.length === 0) return null;
                      const data = payload[0].payload;
                      return (
                        <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-md text-xs space-y-1">
                          <p className="font-bold text-slate-800">{data.name}</p>
                          <p className="text-slate-600">ค่า BMI: <strong className="text-purple-600">{data.bmi}</strong> kg/m²</p>
                          <p className="text-slate-600">ระดับน้ำตาล: <strong className="text-rose-600">{data.sugar}</strong> mg/dL</p>
                          <p className="text-slate-600">ความดัน: <strong>{data.sbp}/{data.dbp}</strong> mmHg</p>
                          <p className="text-slate-600">แถบความเสี่ยง: <span className="font-semibold" style={{ color: data.color }}>{data.zone}</span></p>
                        </div>
                      );
                    }}
                  />
                  <Scatter name="ผู้รับการคัดกรอง" data={scatterRecords} fill="#EC4899">
                    {scatterRecords.map((entry, index) => (
                      <Cell key={`cell-scatter-${index}`} fill={entry.color} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>เกณฑ์เสี่ยง: BMI &gt; 23-25 มักพบน้ำตาล &gt; 126 mg/dL</span>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" />ปกติ</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" />เฝ้าระวัง</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" />เสี่ยงสูง</span>
              </div>
            </div>
          </div>
        )}

        {/* 7. Insight พิเศษ: พฤติกรรมออกกำลังกาย กับระดับความเสี่ยง (Behavior vs Risk) */}
        {(activeTab === 'all' || activeTab === 'behavior') && (
          <div id="chart-card-exercise-vs-risk" className="bg-white rounded-3xl border border-pink-100 shadow-sm p-5 sm:p-6 lg:col-span-2 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 font-['Kanit']">
                    พฤติกรรมการออกกำลังกายกับระดับความเสี่ยง (Exercise Habits vs Risk Level)
                  </h3>
                  <p className="text-xs text-slate-500">
                    ผู้ที่ออกกำลังกายสม่ำเสมอมักอยู่ในแถบสีเขียว (ปกติ) สูงกว่าผู้ที่ไม่ออกกำลังกายอย่างมีนัยสำคัญ
                  </p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-medium border border-emerald-200">
                Cross-Tabulation
              </span>
            </div>

            <div className="h-60 sm:h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={exerciseRiskData} margin={{ top: 10, right: 10, left: -15, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="habit" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="แถบเขียว" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="แถบส้ม" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="แถบแดง (เสี่ยงสูง)" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
