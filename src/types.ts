export type PingPongColor = 'ขาว' | 'เขียวอ่อน' | 'เขียวเข้ม' | 'เหลือง' | 'ส้ม' | 'แดง' | 'ดำ';

export type RiskZone = 'เขียว' | 'ส้ม' | 'แดง';

export type Gender = 'ชาย' | 'หญิง';

export type SmokingHabit = 'ไม่สูบ' | 'สูบ' | 'เคยสูบแต่เลิกแล้ว' | 'สูบเป็นประจำ' | string;

export type AlcoholHabit = 'ไม่ดื่ม' | 'ดื่ม' | 'ดื่มนานๆ ครั้ง' | 'ดื่มเป็นประจำ' | string;

export type ExerciseHabit = 'ไม่ออกกำลังกาย' | 'สม่ำเสมอ' | 'บางครั้ง' | 'ออกกำลังกาย 1-2 วัน/สัปดาห์' | 'ออกกำลังกายสม่ำเสมอ ≥3 วัน/สัปดาห์' | string;

export interface HealthRecord {
  id: string;
  hn: string;
  fullName: string;
  gender: Gender;
  age: number;
  area: string;
  weight: number; // kg
  height: number; // cm
  bmi: number;
  bmiCategory: 'น้ำหนักน้อย' | 'ปกติ' | 'น้ำหนักเกิน' | 'อ้วนระดับ 1' | 'อ้วนระดับ 2 (อันตราย)';
  sugarMgDl: number; // น้ำตาล_mg_dL (FBS)
  bpSystolic: number; // ความดันตัวบน
  bpDiastolic: number; // ความดันตัวล่าง
  bpString: string; // e.g. "128/82"
  pingpongColor: PingPongColor;
  riskZone: RiskZone; // แดง ส้ม เขียว
  riskDescription: string;
  screeningDate: string; // YYYY-MM-DD
  smoking: SmokingHabit;
  alcohol: AlcoholHabit;
  exercise: ExerciseHabit;
  hasComplication?: boolean;
  notes?: string;
}

export interface FilterState {
  searchQuery: string;
  gender: string; // 'all' | 'ชาย' | 'หญิง'
  ageGroup: string; // 'all' | '<40' | '40-59' | '60+'
  area: string; // 'all' | string
  riskZone: string; // 'all' | 'เขียว' | 'ส้ม' | 'แดง'
  pingpongColor: string; // 'all' | PingPongColor
  bmiCategory: string; // 'all' | ...
}

export interface KPIOverview {
  totalUsers: number;
  maleCount: number;
  femaleCount: number;
  maleRatio: number;
  femaleRatio: number;
  areaCount: number;
  topArea: string;
  topAreaCount: number;
  
  // Weight stats
  weightAvg: number;
  weightMin: number;
  weightMax: number;
  
  // Height stats
  heightAvg: number;
  heightMin: number;
  heightMax: number;
  
  // BMI stats
  bmiAvg: number;
  bmiMin: number;
  bmiMax: number;
  normalBmiCount: number;
  normalBmiPct: number;
  overweightBmiCount: number;
  overweightBmiPct: number;
  obeseBmiCount: number;
  obeseBmiPct: number;
  
  // Sugar & BP stats
  sugarAvg: number;
  bpHighCount: number;
  bpHighPct: number;
  
  // Risk zone stats
  greenZoneCount: number;
  greenZonePct: number;
  orangeZoneCount: number;
  orangeZonePct: number;
  redZoneCount: number;
  redZonePct: number;
}
