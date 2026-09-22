import { HealthRecord, PingPongColor, RiskZone } from '../types';
import { GOOGLE_SHEET_EXACT_RECORDS } from './sheetExactData';

export const GOOGLE_SHEET_ID = '1aFmQz6_FkvGbuxfyuBvvYVzI5WrfNgVIlm4lwTPbDEI';
export { GOOGLE_SHEET_EXACT_RECORDS };

export const PINGPONG_COLOR_MAP: Record<PingPongColor, {
  name: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  hex: string;
  category: string;
  criteria: string;
  zone: RiskZone;
}> = {
  'ขาว': {
    name: 'สีขาว (ปกติสมบูรณ์)',
    badgeBg: 'bg-white',
    badgeBorder: 'border-slate-300',
    badgeText: 'text-slate-700',
    hex: '#F8FAFC',
    category: 'กลุ่มปกติ',
    criteria: 'น้ำตาล < 100 mg/dL และ ความดัน < 120/80 mmHg',
    zone: 'เขียว'
  },
  'เขียวอ่อน': {
    name: 'สีเขียวอ่อน (กลุ่มเสี่ยง)',
    badgeBg: 'bg-emerald-100',
    badgeBorder: 'border-emerald-300',
    badgeText: 'text-emerald-800',
    hex: '#86EFAC',
    category: 'กลุ่มเสี่ยงเบาหวาน/ความดัน',
    criteria: 'น้ำตาล 100-125 mg/dL หรือ ความดัน 120-139 / 80-89 mmHg',
    zone: 'เขียว'
  },
  'เขียวเข้ม': {
    name: 'สีเขียวเข้ม (ป่วยคุมได้ดีมาก)',
    badgeBg: 'bg-green-200',
    badgeBorder: 'border-green-400',
    badgeText: 'text-green-900',
    hex: '#22C55E',
    category: 'ผู้ป่วยระดับ 0 (คุมได้ดี)',
    criteria: 'ผู้ป่วยที่คุมน้ำตาล < 125 mg/dL และความดัน < 140/90 mmHg',
    zone: 'เขียว'
  },
  'เหลือง': {
    name: 'สีเหลือง (ป่วยคุมได้ปานกลาง)',
    badgeBg: 'bg-amber-100',
    badgeBorder: 'border-amber-300',
    badgeText: 'text-amber-900',
    hex: '#FDE047',
    category: 'ผู้ป่วยระดับ 1 (เฝ้าระวัง)',
    criteria: 'น้ำตาล 126-154 mg/dL หรือ ความดัน 140-159 / 90-99 mmHg',
    zone: 'ส้ม'
  },
  'ส้ม': {
    name: 'สีส้ม (ป่วยคุมได้ไม่ดี/เสี่ยงสูง)',
    badgeBg: 'bg-orange-100',
    badgeBorder: 'border-orange-300',
    badgeText: 'text-orange-900',
    hex: '#FB923C',
    category: 'ผู้ป่วยระดับ 2 (เสี่ยงสูง)',
    criteria: 'น้ำตาล 155-179 mg/dL หรือ ความดัน 160-179 / 100-109 mmHg',
    zone: 'ส้ม'
  },
  'แดง': {
    name: 'สีแดง (วิกฤต/คุมไม่ได้)',
    badgeBg: 'bg-rose-100',
    badgeBorder: 'border-rose-300',
    badgeText: 'text-rose-900',
    hex: '#F87171',
    category: 'ผู้ป่วยระดับ 3 (อันตราย)',
    criteria: 'น้ำตาล ≥ 180 mg/dL หรือ ความดัน ≥ 180 / ≥ 110 mmHg',
    zone: 'แดง'
  },
  'ดำ': {
    name: 'สีดำ (มีภาวะแทรกซ้อน)',
    badgeBg: 'bg-slate-200',
    badgeBorder: 'border-slate-500',
    badgeText: 'text-slate-900',
    hex: '#475569',
    category: 'ผู้ป่วยมีภาวะแทรกซ้อน (ไต/ตา/หัวใจ)',
    criteria: 'มีโรคแทรกซ้อน ไตวาย อัมพฤกษ์ หลอดเลือด หรือจอประสาทตา',
    zone: 'แดง'
  },
};

export const RISK_ZONE_MAP: Record<RiskZone, {
  name: string;
  subTitle: string;
  badge: string;
  borderClass: string;
  bgRow: string;
  barColor: string;
  accent: string;
}> = {
  'เขียว': {
    name: 'แถบสีเขียว (ปกติ / เสี่ยงต่ำ)',
    subTitle: 'กลุ่มปกติ เสี่ยงต่ำ และผู้ป่วยที่ควบคุมได้ดี',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    borderClass: 'border-l-4 border-l-emerald-500',
    bgRow: 'hover:bg-emerald-50/50',
    barColor: '#10B981',
    accent: '#34D399',
  },
  'ส้ม': {
    name: 'แถบสีส้ม (เฝ้าระวัง / เสี่ยงปานกลาง)',
    subTitle: 'ผู้ป่วยระดับ 1-2 ต้องปรับเปลี่ยนพฤติกรรม',
    badge: 'bg-amber-100 text-amber-800 border-amber-300',
    borderClass: 'border-l-4 border-l-amber-500',
    bgRow: 'hover:bg-amber-50/50',
    barColor: '#F59E0B',
    accent: '#FBBF24',
  },
  'แดง': {
    name: 'แถบสีแดง (อันตราย / เสี่ยงสูงมาก)',
    subTitle: 'ผู้ป่วยระดับ 3 และผู้มีภาวะแทรกซ้อน ต้องพบแพทย์ด่วน',
    badge: 'bg-rose-100 text-rose-800 border-rose-300',
    borderClass: 'border-l-4 border-l-rose-500',
    bgRow: 'hover:bg-rose-50/50',
    barColor: '#EF4444',
    accent: '#F87171',
  },
};

// Calculate BMI category
export function calculateBmiCategory(bmi: number): HealthRecord['bmiCategory'] {
  if (bmi < 18.5) return 'น้ำหนักน้อย';
  if (bmi <= 22.9) return 'ปกติ';
  if (bmi <= 24.9) return 'น้ำหนักเกิน';
  if (bmi <= 29.9) return 'อ้วนระดับ 1';
  return 'อ้วนระดับ 2 (อันตราย)';
}

// Determine Ping Pong Color based on FBS and BP
export function evaluatePingPong(sugar: number, sbp: number, dbp: number, hasComplication: boolean = false): {
  color: PingPongColor;
  zone: RiskZone;
  description: string;
} {
  if (hasComplication) {
    return {
      color: 'ดำ',
      zone: 'แดง',
      description: 'ป่วยมีภาวะแทรกซ้อน (ไต/ตา/หลอดเลือดสมอง)'
    };
  }
  if (sugar >= 180 || sbp >= 180 || dbp >= 110) {
    return {
      color: 'แดง',
      zone: 'แดง',
      description: 'ป่วยระดับ 3 อันตราย ต้องพบแพทย์ด่วน'
    };
  }
  if ((sugar >= 155 && sugar <= 179) || (sbp >= 160 && sbp <= 179) || (dbp >= 100 && dbp <= 109)) {
    return {
      color: 'ส้ม',
      zone: 'ส้ม',
      description: 'ป่วยระดับ 2 เสี่ยงสูง ควบคุมไม่ดี'
    };
  }
  if ((sugar >= 126 && sugar <= 154) || (sbp >= 140 && sbp <= 159) || (dbp >= 90 && dbp <= 99)) {
    return {
      color: 'เหลือง',
      zone: 'ส้ม',
      description: 'ป่วยระดับ 1 เฝ้าระวัง ควบคุมปานกลาง'
    };
  }
  if (sugar >= 100 || sbp >= 120 || dbp >= 80) {
    return {
      color: 'เขียวอ่อน',
      zone: 'เขียว',
      description: 'กลุ่มเสี่ยง ควรปรับอาหารและออกกำลังกาย'
    };
  }
  return {
    color: 'ขาว',
    zone: 'เขียว',
    description: 'ปกติ สุขภาพแข็งแรงดี'
  };
}

// 120 Realistic screening records for Thai community health campaign
export const RAW_COMMUNITY_DATA: HealthRecord[] = [
  {
    id: 'P001',
    hn: 'HN67-001',
    fullName: 'นายสมพร ชัยวัฒน์',
    gender: 'ชาย',
    age: 58,
    area: 'หมู่ 1 บ้านดอนแก้ว',
    weight: 78.5,
    height: 165,
    bmi: 28.8,
    bmiCategory: 'อ้วนระดับ 1',
    sugarMgDl: 164,
    bpSystolic: 162,
    bpDiastolic: 102,
    bpString: '162/102',
    pingpongColor: 'ส้ม',
    riskZone: 'ส้ม',
    riskDescription: 'ป่วยระดับ 2 เสี่ยงสูง ควบคุมไม่ดี',
    screeningDate: '2026-09-02',
    smoking: 'สูบเป็นประจำ',
    alcohol: 'ดื่มเป็นประจำ',
    exercise: 'ไม่ออกกำลังกาย',
    hasComplication: false,
    notes: 'พบแพทย์ปรับยาลดความดันและน้ำตาล งดของเค็ม/หวาน'
  },
  {
    id: 'P002',
    hn: 'HN67-002',
    fullName: 'นางมะลิวรรณ พงษ์ศิริ',
    gender: 'หญิง',
    age: 62,
    area: 'หมู่ 2 บ้านหนองผึ้ง',
    weight: 64.0,
    height: 152,
    bmi: 27.7,
    bmiCategory: 'อ้วนระดับ 1',
    sugarMgDl: 188,
    bpSystolic: 175,
    bpDiastolic: 104,
    bpString: '175/104',
    pingpongColor: 'แดง',
    riskZone: 'แดง',
    riskDescription: 'ป่วยระดับ 3 อันตราย ต้องพบแพทย์ด่วน',
    screeningDate: '2026-09-02',
    smoking: 'ไม่สูบ',
    alcohol: 'ไม่ดื่ม',
    exercise: 'ไม่ออกกำลังกาย',
    hasComplication: false,
    notes: 'น้ำตาลสะสมสูง ส่งต่อคลินิก NCD รพ.ทันที'
  },
  {
    id: 'P003',
    hn: 'HN67-003',
    fullName: 'นางสาวกานดา วิเชียร',
    gender: 'หญิง',
    age: 34,
    area: 'หมู่ 1 บ้านดอนแก้ว',
    weight: 52.0,
    height: 158,
    bmi: 20.8,
    bmiCategory: 'ปกติ',
    sugarMgDl: 88,
    bpSystolic: 114,
    bpDiastolic: 74,
    bpString: '114/74',
    pingpongColor: 'ขาว',
    riskZone: 'เขียว',
    riskDescription: 'ปกติ สุขภาพแข็งแรงดี',
    screeningDate: '2026-09-03',
    smoking: 'ไม่สูบ',
    alcohol: 'ไม่ดื่ม',
    exercise: 'ออกกำลังกายสม่ำเสมอ ≥3 วัน/สัปดาห์',
    hasComplication: false,
    notes: 'รักษาสุขภาพอย่างต่อเนื่อง'
  },
  {
    id: 'P004',
    hn: 'HN67-004',
    fullName: 'นายสมศักดิ์ รัตนวิเชียร',
    gender: 'ชาย',
    age: 67,
    area: 'หมู่ 3 บ้านทุ่งสว่าง',
    weight: 71.0,
    height: 168,
    bmi: 25.2,
    bmiCategory: 'อ้วนระดับ 1',
    sugarMgDl: 215,
    bpSystolic: 182,
    bpDiastolic: 112,
    bpString: '182/112',
    pingpongColor: 'ดำ',
    riskZone: 'แดง',
    riskDescription: 'ป่วยมีภาวะแทรกซ้อน (ไต/ตา/หลอดเลือดสมอง)',
    screeningDate: '2026-09-03',
    smoking: 'เคยสูบแต่เลิกแล้ว',
    alcohol: 'ไม่ดื่ม',
    exercise: 'ไม่ออกกำลังกาย',
    hasComplication: true,
    notes: 'มีประวัติจอประสาทตาผิดปกติจากเบาหวาน นัดพบแพทย์เฉพาะทาง'
  },
  {
    id: 'P005',
    hn: 'HN67-005',
    fullName: 'นายประสิทธิ์ บุญมาก',
    gender: 'ชาย',
    age: 46,
    area: 'หมู่ 4 บ้านศรีบุญเรือง',
    weight: 68.0,
    height: 170,
    bmi: 23.5,
    bmiCategory: 'น้ำหนักเกิน',
    sugarMgDl: 112,
    bpSystolic: 126,
    bpDiastolic: 84,
    bpString: '126/84',
    pingpongColor: 'เขียวอ่อน',
    riskZone: 'เขียว',
    riskDescription: 'กลุ่มเสี่ยง ควรปรับอาหารและออกกำลังกาย',
    screeningDate: '2026-09-04',
    smoking: 'ไม่สูบ',
    alcohol: 'ดื่มนานๆ ครั้ง',
    exercise: 'ออกกำลังกาย 1-2 วัน/สัปดาห์',
    hasComplication: false,
    notes: 'แนะนำลดข้าวแป้งและของหวาน นัดตรวจซ้ำ 6 เดือน'
  },
  {
    id: 'P006',
    hn: 'HN67-006',
    fullName: 'นางบัวลอย สิทธิชัย',
    gender: 'หญิง',
    age: 53,
    area: 'หมู่ 2 บ้านหนองผึ้ง',
    weight: 60.5,
    height: 154,
    bmi: 25.5,
    bmiCategory: 'อ้วนระดับ 1',
    sugarMgDl: 138,
    bpSystolic: 144,
    bpDiastolic: 92,
    bpString: '144/92',
    pingpongColor: 'เหลือง',
    riskZone: 'ส้ม',
    riskDescription: 'ป่วยระดับ 1 เฝ้าระวัง ควบคุมปานกลาง',
    screeningDate: '2026-09-04',
    smoking: 'ไม่สูบ',
    alcohol: 'ไม่ดื่ม',
    exercise: 'ออกกำลังกาย 1-2 วัน/สัปดาห์',
    hasComplication: false,
    notes: 'ควบคุมอาหาร แนะนำเดินเร็ววันละ 30 นาที'
  },
  {
    id: 'P007',
    hn: 'HN67-007',
    fullName: 'นายวิชัย สุวรรณโชติ',
    gender: 'ชาย',
    age: 61,
    area: 'หมู่ 5 บ้านสุขสมบูรณ์',
    weight: 82.0,
    height: 167,
    bmi: 29.4,
    bmiCategory: 'อ้วนระดับ 1',
    sugarMgDl: 172,
    bpSystolic: 168,
    bpDiastolic: 104,
    bpString: '168/104',
    pingpongColor: 'ส้ม',
    riskZone: 'ส้ม',
    riskDescription: 'ป่วยระดับ 2 เสี่ยงสูง ควบคุมไม่ดี',
    screeningDate: '2026-09-05',
    smoking: 'สูบเป็นประจำ',
    alcohol: 'ดื่มเป็นประจำ',
    exercise: 'ไม่ออกกำลังกาย',
    hasComplication: false,
    notes: 'แนะนำเลิกบุหรี่และสุรา ติดตามความดันรายสัปดาห์'
  },
  {
    id: 'P008',
    hn: 'HN67-008',
    fullName: 'นางสาวพิมพา พรหมจันทร์',
    gender: 'หญิง',
    age: 28,
    area: 'หมู่ 6 บ้านโนนทัน',
    weight: 48.0,
    height: 160,
    bmi: 18.8,
    bmiCategory: 'ปกติ',
    sugarMgDl: 92,
    bpSystolic: 110,
    bpDiastolic: 70,
    bpString: '110/70',
    pingpongColor: 'ขาว',
    riskZone: 'เขียว',
    riskDescription: 'ปกติ สุขภาพแข็งแรงดี',
    screeningDate: '2026-09-05',
    smoking: 'ไม่สูบ',
    alcohol: 'ไม่ดื่ม',
    exercise: 'ออกกำลังกายสม่ำเสมอ ≥3 วัน/สัปดาห์',
    hasComplication: false,
    notes: 'ผลการคัดกรองปกติ'
  },
  {
    id: 'P009',
    hn: 'HN67-009',
    fullName: 'นายเกรียงไกร มีชัย',
    gender: 'ชาย',
    age: 72,
    area: 'หมู่ 3 บ้านทุ่งสว่าง',
    weight: 59.0,
    height: 162,
    bmi: 22.5,
    bmiCategory: 'ปกติ',
    sugarMgDl: 195,
    bpSystolic: 185,
    bpDiastolic: 98,
    bpString: '185/98',
    pingpongColor: 'แดง',
    riskZone: 'แดง',
    riskDescription: 'ป่วยระดับ 3 อันตราย ต้องพบแพทย์ด่วน',
    screeningDate: '2026-09-06',
    smoking: 'เคยสูบแต่เลิกแล้ว',
    alcohol: 'ไม่ดื่ม',
    exercise: 'ไม่ออกกำลังกาย',
    hasComplication: false,
    notes: 'ความดันและน้ำตาลเกินเกณฑ์วิกฤต ส่งรพ.ชุมชน'
  },
  {
    id: 'P010',
    hn: 'HN67-010',
    fullName: 'นางอรทัย ทรัพย์มั่งคั่ง',
    gender: 'หญิง',
    age: 49,
    area: 'หมู่ 4 บ้านศรีบุญเรือง',
    weight: 65.5,
    height: 156,
    bmi: 26.9,
    bmiCategory: 'อ้วนระดับ 1',
    sugarMgDl: 108,
    bpSystolic: 132,
    bpDiastolic: 86,
    bpString: '132/86',
    pingpongColor: 'เขียวอ่อน',
    riskZone: 'เขียว',
    riskDescription: 'กลุ่มเสี่ยง ควรปรับอาหารและออกกำลังกาย',
    screeningDate: '2026-09-06',
    smoking: 'ไม่สูบ',
    alcohol: 'ดื่มนานๆ ครั้ง',
    exercise: 'ออกกำลังกาย 1-2 วัน/สัปดาห์',
    hasComplication: false,
    notes: 'เน้นลดน้ำหนักอย่างน้อย 5% ใน 3 เดือน'
  },
  {
    id: 'P011',
    hn: 'HN67-011',
    fullName: 'นายธนากร เลิศรัตน์',
    gender: 'ชาย',
    age: 55,
    area: 'หมู่ 7 บ้านโพธิ์ทอง',
    weight: 76.0,
    height: 169,
    bmi: 26.6,
    bmiCategory: 'อ้วนระดับ 1',
    sugarMgDl: 122,
    bpSystolic: 138,
    bpDiastolic: 88,
    bpString: '138/88',
    pingpongColor: 'เขียวอ่อน',
    riskZone: 'เขียว',
    riskDescription: 'กลุ่มเสี่ยง ควรปรับอาหารและออกกำลังกาย',
    screeningDate: '2026-09-07',
    smoking: 'สูบเป็นประจำ',
    alcohol: 'ดื่มนานๆ ครั้ง',
    exercise: 'ไม่ออกกำลังกาย',
    hasComplication: false,
    notes: 'ให้คำปรึกษาคลินิกเลิกบุหรี่'
  },
  {
    id: 'P012',
    hn: 'HN67-012',
    fullName: 'นางดวงใจ แสงเดือน',
    gender: 'หญิง',
    age: 65,
    area: 'หมู่ 8 บ้านหนองหญ้าขาว',
    weight: 54.0,
    height: 150,
    bmi: 24.0,
    bmiCategory: 'น้ำหนักเกิน',
    sugarMgDl: 148,
    bpSystolic: 152,
    bpDiastolic: 94,
    bpString: '152/94',
    pingpongColor: 'เหลือง',
    riskZone: 'ส้ม',
    riskDescription: 'ป่วยระดับ 1 เฝ้าระวัง ควบคุมปานกลาง',
    screeningDate: '2026-09-07',
    smoking: 'ไม่สูบ',
    alcohol: 'ไม่ดื่ม',
    exercise: 'ออกกำลังกาย 1-2 วัน/สัปดาห์',
    hasComplication: false,
    notes: 'รับประทานยาลดความดันสม่ำเสมอ ห้ามขาดยา'
  },
  {
    id: 'P013',
    hn: 'HN67-013',
    fullName: 'นายชูเกียรติ ยิ้มแย้ม',
    gender: 'ชาย',
    age: 42,
    area: 'หมู่ 5 บ้านสุขสมบูรณ์',
    weight: 62.0,
    height: 166,
    bmi: 22.5,
    bmiCategory: 'ปกติ',
    sugarMgDl: 96,
    bpSystolic: 118,
    bpDiastolic: 78,
    bpString: '118/78',
    pingpongColor: 'ขาว',
    riskZone: 'เขียว',
    riskDescription: 'ปกติ สุขภาพแข็งแรงดี',
    screeningDate: '2026-09-08',
    smoking: 'ไม่สูบ',
    alcohol: 'ดื่มนานๆ ครั้ง',
    exercise: 'ออกกำลังกายสม่ำเสมอ ≥3 วัน/สัปดาห์',
    hasComplication: false,
    notes: 'สุขภาพแข็งแรง ผลปกติ'
  },
  {
    id: 'P014',
    hn: 'HN67-014',
    fullName: 'นางสาวจันทร์เพ็ญ เจริญผล',
    gender: 'หญิง',
    age: 57,
    area: 'หมู่ 6 บ้านโนนทัน',
    weight: 73.0,
    height: 155,
    bmi: 30.4,
    bmiCategory: 'อ้วนระดับ 2 (อันตราย)',
    sugarMgDl: 168,
    bpSystolic: 164,
    bpDiastolic: 102,
    bpString: '164/102',
    pingpongColor: 'ส้ม',
    riskZone: 'ส้ม',
    riskDescription: 'ป่วยระดับ 2 เสี่ยงสูง ควบคุมไม่ดี',
    screeningDate: '2026-09-08',
    smoking: 'ไม่สูบ',
    alcohol: 'ไม่ดื่ม',
    exercise: 'ไม่ออกกำลังกาย',
    hasComplication: false,
    notes: 'BMI สูงมาก ส่งเข้ากลุ่มปรับพฤติกรรม 3อ.2ส.'
  },
  {
    id: 'P015',
    hn: 'HN67-015',
    fullName: 'นายอนันต์ รุ่งเรือง',
    gender: 'ชาย',
    age: 69,
    area: 'หมู่ 2 บ้านหนองผึ้ง',
    weight: 66.0,
    height: 164,
    bmi: 24.5,
    bmiCategory: 'น้ำหนักเกิน',
    sugarMgDl: 228,
    bpSystolic: 188,
    bpDiastolic: 114,
    bpString: '188/114',
    pingpongColor: 'แดง',
    riskZone: 'แดง',
    riskDescription: 'ป่วยระดับ 3 อันตราย ต้องพบแพทย์ด่วน',
    screeningDate: '2026-09-09',
    smoking: 'สูบเป็นประจำ',
    alcohol: 'ดื่มเป็นประจำ',
    exercise: 'ไม่ออกกำลังกาย',
    hasComplication: false,
    notes: 'วิกฤตความดันสูงร่วมกับน้ำตาลเกิน 200'
  },
  {
    id: 'P016',
    hn: 'HN67-016',
    fullName: 'นางยุพา วงศ์ษา',
    gender: 'หญิง',
    age: 63,
    area: 'หมู่ 1 บ้านดอนแก้ว',
    weight: 58.0,
    height: 152,
    bmi: 25.1,
    bmiCategory: 'อ้วนระดับ 1',
    sugarMgDl: 118,
    bpSystolic: 136,
    bpDiastolic: 86,
    bpString: '136/86',
    pingpongColor: 'เขียวอ่อน',
    riskZone: 'เขียว',
    riskDescription: 'กลุ่มเสี่ยง ควรปรับอาหารและออกกำลังกาย',
    screeningDate: '2026-09-09',
    smoking: 'ไม่สูบ',
    alcohol: 'ไม่ดื่ม',
    exercise: 'ออกกำลังกาย 1-2 วัน/สัปดาห์',
    hasComplication: false,
    notes: 'ให้ความรู้เรื่องเกลือและโซเดียมแฝง'
  },
  {
    id: 'P017',
    hn: 'HN67-017',
    fullName: 'นายธีระพล อินทร์พรหม',
    gender: 'ชาย',
    age: 51,
    area: 'หมู่ 7 บ้านโพธิ์ทอง',
    weight: 84.0,
    height: 172,
    bmi: 28.4,
    bmiCategory: 'อ้วนระดับ 1',
    sugarMgDl: 152,
    bpSystolic: 148,
    bpDiastolic: 94,
    bpString: '148/94',
    pingpongColor: 'เหลือง',
    riskZone: 'ส้ม',
    riskDescription: 'ป่วยระดับ 1 เฝ้าระวัง ควบคุมปานกลาง',
    screeningDate: '2026-09-10',
    smoking: 'เคยสูบแต่เลิกแล้ว',
    alcohol: 'ดื่มนานๆ ครั้ง',
    exercise: 'ไม่ออกกำลังกาย',
    hasComplication: false,
    notes: 'ตรวจติดตามค่าน้ำตาลสะสม HbA1c'
  },
  {
    id: 'P018',
    hn: 'HN67-018',
    fullName: 'นางประนอม บุญเลิศ',
    gender: 'หญิง',
    age: 76,
    area: 'หมู่ 8 บ้านหนองหญ้าขาว',
    weight: 50.0,
    height: 148,
    bmi: 22.8,
    bmiCategory: 'ปกติ',
    sugarMgDl: 198,
    bpSystolic: 178,
    bpDiastolic: 96,
    bpString: '178/96',
    pingpongColor: 'ดำ',
    riskZone: 'แดง',
    riskDescription: 'ป่วยมีภาวะแทรกซ้อน (ไต/ตา/หลอดเลือดสมอง)',
    screeningDate: '2026-09-10',
    smoking: 'ไม่สูบ',
    alcohol: 'ไม่ดื่ม',
    exercise: 'ไม่ออกกำลังกาย',
    hasComplication: true,
    notes: 'ตรวจพบโปรตีนรั่วในปัสสาวะ (Microalbuminuria) ติดตามโรคไต'
  },
  {
    id: 'P019',
    hn: 'HN67-019',
    fullName: 'นายพงษ์ศักดิ์ คำมี',
    gender: 'ชาย',
    age: 38,
    area: 'หมู่ 3 บ้านทุ่งสว่าง',
    weight: 70.0,
    height: 171,
    bmi: 23.9,
    bmiCategory: 'น้ำหนักเกิน',
    sugarMgDl: 94,
    bpSystolic: 116,
    bpDiastolic: 76,
    bpString: '116/76',
    pingpongColor: 'ขาว',
    riskZone: 'เขียว',
    riskDescription: 'ปกติ สุขภาพแข็งแรงดี',
    screeningDate: '2026-09-11',
    smoking: 'ไม่สูบ',
    alcohol: 'ดื่มนานๆ ครั้ง',
    exercise: 'ออกกำลังกายสม่ำเสมอ ≥3 วัน/สัปดาห์',
    hasComplication: false,
    notes: 'ผลตรวจสุขภาพดีเยี่ยม'
  },
  {
    id: 'P020',
    hn: 'HN67-020',
    fullName: 'นางสาวศิริพร ปัญญาไว',
    gender: 'หญิง',
    age: 44,
    area: 'หมู่ 4 บ้านศรีบุญเรือง',
    weight: 55.0,
    height: 156,
    bmi: 22.6,
    bmiCategory: 'ปกติ',
    sugarMgDl: 104,
    bpSystolic: 124,
    bpDiastolic: 82,
    bpString: '124/82',
    pingpongColor: 'เขียวอ่อน',
    riskZone: 'เขียว',
    riskDescription: 'กลุ่มเสี่ยง ควรปรับอาหารและออกกำลังกาย',
    screeningDate: '2026-09-11',
    smoking: 'ไม่สูบ',
    alcohol: 'ไม่ดื่ม',
    exercise: 'ออกกำลังกาย 1-2 วัน/สัปดาห์',
    hasComplication: false,
    notes: 'เสี่ยงระดับเริ่มต้น แนะนำควบคุมเครื่องดื่มรสหวาน'
  }
];

// Helper to generate a full, realistic 120-person cohort seeded deterministically
const THAI_FIRSTNAMES_MALE = [
  'สมศักดิ์', 'วิชัย', 'เกรียงไกร', 'ธนากร', 'ชูเกียรติ', 'อนันต์', 'ธีระพล', 'พงษ์ศักดิ์',
  'บุญช่วย', 'ประสิทธิ์', 'สุรชัย', 'มนัส', 'อุดม', 'สุนทร', 'วินัย', 'ประเสริฐ', 'ประยงค์',
  'จำลอง', 'วรพจน์', 'นเรศ', 'ชัยรัตน์', 'อภิชาต', 'กิตติศักดิ์', 'ธงชัย', 'ชวลิต', 'เฉลิม'
];

const THAI_FIRSTNAMES_FEMALE = [
  'มะลิวรรณ', 'กานดา', 'บัวลอย', 'พิมพา', 'อรทัย', 'ดวงใจ', 'จันทร์เพ็ญ', 'ยุพา',
  'ประนอม', 'ศิริพร', 'สมศรี', 'วรรณา', 'สายใจ', 'ทองใบ', 'กัญญารัตน์', 'รพีพร', 'วิลาวัลย์',
  'สุภาพร', 'ปราณี', 'จินตนา', 'นุชนาถ', 'เพ็ญศรี', 'อารีย์', 'วันเพ็ญ', 'สุกัญญา', 'พนิดา'
];

const THAI_LASTNAMES = [
  'ศรีธาตุ', 'ชัยวัฒน์', 'พงษ์ศิริ', 'วิเชียร', 'รัตนวิเชียร', 'บุญมาก', 'สิทธิชัย', 'สุวรรณโชติ',
  'พรหมจันทร์', 'มีชัย', 'ทรัพย์มั่งคั่ง', 'เลิศรัตน์', 'แสงเดือน', 'ยิ้มแย้ม', 'เจริญผล',
  'รุ่งเรือง', 'วงศ์ษา', 'อินทร์พรหม', 'คำมี', 'ปัญญาไว', 'ทองดี', 'แสงสุวรรณ', 'คงเจริญ',
  'สุขสวัสดิ์', 'จันทรักษ์', 'บุญยืน', 'แก้ววิเชียร', 'ชื่นอารมณ์', 'มั่นคง', 'นาคีรักษ์'
];

const AREAS = [
  'หมู่ 1 บ้านดอนแก้ว',
  'หมู่ 2 บ้านหนองผึ้ง',
  'หมู่ 3 บ้านทุ่งสว่าง',
  'หมู่ 4 บ้านศรีบุญเรือง',
  'หมู่ 5 บ้านสุขสมบูรณ์',
  'หมู่ 6 บ้านโนนทัน',
  'หมู่ 7 บ้านโพธิ์ทอง',
  'หมู่ 8 บ้านหนองหญ้าขาว'
];

// Pseudo-random deterministic generator for consistent high-quality community data
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function generateCommunityRecords(): HealthRecord[] {
  const records: HealthRecord[] = [...RAW_COMMUNITY_DATA];
  
  for (let i = 21; i <= 120; i++) {
    const seed = i * 137;
    const isMale = seededRandom(seed) > 0.48;
    const gender: 'ชาย' | 'หญิง' = isMale ? 'ชาย' : 'หญิง';
    const firstNames = isMale ? THAI_FIRSTNAMES_MALE : THAI_FIRSTNAMES_FEMALE;
    const prefix = isMale ? 'นาย' : (seededRandom(seed + 1) > 0.6 ? 'นาง' : 'นางสาว');
    const fName = firstNames[Math.floor(seededRandom(seed + 2) * firstNames.length)];
    const lName = THAI_LASTNAMES[Math.floor(seededRandom(seed + 3) * THAI_LASTNAMES.length)];
    const fullName = `${prefix}${fName} ${lName}`;
    const area = AREAS[Math.floor(seededRandom(seed + 4) * AREAS.length)];
    
    // Age distribution centered around middle age to elderly (health screening demographic)
    const age = Math.floor(25 + seededRandom(seed + 5) * 58);
    
    // Weight & Height
    const height = isMale 
      ? Math.round((160 + seededRandom(seed + 6) * 22) * 10) / 10
      : Math.round((148 + seededRandom(seed + 6) * 18) * 10) / 10;
    
    const bmiTarget = 18.5 + seededRandom(seed + 7) * 14.5;
    const weight = Math.round((bmiTarget * Math.pow(height / 100, 2)) * 10) / 10;
    const bmi = Math.round((weight / Math.pow(height / 100, 2)) * 10) / 10;
    const bmiCategory = calculateBmiCategory(bmi);
    
    // Health markers correlate with age, BMI, and lifestyle habits
    const lifestyleRisk = (bmi > 25 ? 0.3 : 0) + (age > 55 ? 0.35 : 0.1);
    const rnd = seededRandom(seed + 8);
    
    // Habits
    const smokingRnd = seededRandom(seed + 9);
    const smoking = isMale 
      ? (smokingRnd > 0.6 ? 'สูบเป็นประจำ' : (smokingRnd > 0.35 ? 'เคยสูบแต่เลิกแล้ว' : 'ไม่สูบ'))
      : (smokingRnd > 0.92 ? 'สูบเป็นประจำ' : 'ไม่สูบ');
    
    const alcoholRnd = seededRandom(seed + 10);
    const alcohol = alcoholRnd > 0.65 ? 'ดื่มเป็นประจำ' : (alcoholRnd > 0.3 ? 'ดื่มนานๆ ครั้ง' : 'ไม่ดื่ม');
    
    const exerciseRnd = seededRandom(seed + 11);
    const exercise = exerciseRnd > 0.55 ? 'ไม่ออกกำลังกาย' : (exerciseRnd > 0.25 ? 'ออกกำลังกาย 1-2 วัน/สัปดาห์' : 'ออกกำลังกายสม่ำเสมอ ≥3 วัน/สัปดาห์');
    
    // Glucose (FBS) and Blood Pressure
    let sugar: number;
    let sbp: number;
    let dbp: number;
    let hasComplication = false;

    if (rnd + lifestyleRisk > 1.25) {
      // High risk / Red / Black zone
      sugar = Math.floor(175 + seededRandom(seed + 12) * 95);
      sbp = Math.floor(165 + seededRandom(seed + 13) * 35);
      dbp = Math.floor(100 + seededRandom(seed + 14) * 20);
      hasComplication = seededRandom(seed + 15) > 0.75;
    } else if (rnd + lifestyleRisk > 0.85) {
      // Orange / Yellow zone
      sugar = Math.floor(128 + seededRandom(seed + 12) * 45);
      sbp = Math.floor(142 + seededRandom(seed + 13) * 24);
      dbp = Math.floor(88 + seededRandom(seed + 14) * 16);
    } else if (rnd + lifestyleRisk > 0.45) {
      // Light Green zone (At risk)
      sugar = Math.floor(100 + seededRandom(seed + 12) * 24);
      sbp = Math.floor(122 + seededRandom(seed + 13) * 16);
      dbp = Math.floor(80 + seededRandom(seed + 14) * 8);
    } else {
      // Normal White zone
      sugar = Math.floor(76 + seededRandom(seed + 12) * 23);
      sbp = Math.floor(106 + seededRandom(seed + 13) * 13);
      dbp = Math.floor(68 + seededRandom(seed + 14) * 10);
    }

    const { color, zone, description } = evaluatePingPong(sugar, sbp, dbp, hasComplication);
    
    // Date between 2026-09-01 and 2026-09-20
    const day = Math.min(20, Math.max(1, Math.floor(1 + seededRandom(seed + 16) * 19)));
    const screeningDate = `2026-09-${day < 10 ? '0' + day : day}`;
    
    const hnNum = i < 100 ? (i < 10 ? `00${i}` : `0${i}`) : `${i}`;
    
    records.push({
      id: `P${hnNum}`,
      hn: `HN67-${hnNum}`,
      fullName,
      gender,
      age,
      area,
      weight,
      height,
      bmi,
      bmiCategory,
      sugarMgDl: sugar,
      bpSystolic: sbp,
      bpDiastolic: dbp,
      bpString: `${sbp}/${dbp}`,
      pingpongColor: color,
      riskZone: zone,
      riskDescription: description,
      screeningDate,
      smoking,
      alcohol,
      exercise,
      hasComplication,
      notes: zone === 'แดง' 
        ? 'ต้องส่งต่อพบแพทย์เฉพาะทาง ติดตามค่าความดันและน้ำตาลเข้มงวด'
        : zone === 'ส้ม' 
        ? 'ปรับเปลี่ยนพฤติกรรม อาหารรสหวานมันเค็ม นัดตรวจซ้ำ 1-3 เดือน'
        : 'สุขภาพอยู่ในเกณฑ์ดี/เสี่ยงต่ำ แนะนำตรวจประจำปี'
    });
  }

  // Primary dataset matches exactly the 30 rows from Sheet ID 1aFmQz6_FkvGbuxfyuBvvYVzI5WrfNgVIlm4lwTPbDEI
  return GOOGLE_SHEET_EXACT_RECORDS.length > 0 ? GOOGLE_SHEET_EXACT_RECORDS : records;
}
