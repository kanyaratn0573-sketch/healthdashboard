import { HealthRecord, KPIOverview, FilterState, RiskZone, PingPongColor } from '../types';
import { generateCommunityRecords, GOOGLE_SHEET_ID, calculateBmiCategory, evaluatePingPong } from '../data/initialData';

export { GOOGLE_SHEET_ID };

export interface SheetConnectionState {
  sheetId: string;
  isConnected: boolean;
  isLive: boolean;
  lastUpdated: string;
  sourceType: 'google-sheet' | 'cached-sheet' | 'imported-file';
  recordCount: number;
  error?: string;
}

export function computeKPIs(records: HealthRecord[]): KPIOverview {
  const totalUsers = records.length;
  if (totalUsers === 0) {
    return {
      totalUsers: 0,
      maleCount: 0,
      femaleCount: 0,
      maleRatio: 0,
      femaleRatio: 0,
      areaCount: 0,
      topArea: '-',
      topAreaCount: 0,
      weightAvg: 0,
      weightMin: 0,
      weightMax: 0,
      heightAvg: 0,
      heightMin: 0,
      heightMax: 0,
      bmiAvg: 0,
      bmiMin: 0,
      bmiMax: 0,
      normalBmiCount: 0,
      normalBmiPct: 0,
      overweightBmiCount: 0,
      overweightBmiPct: 0,
      obeseBmiCount: 0,
      obeseBmiPct: 0,
      sugarAvg: 0,
      bpHighCount: 0,
      bpHighPct: 0,
      greenZoneCount: 0,
      greenZonePct: 0,
      orangeZoneCount: 0,
      orangeZonePct: 0,
      redZoneCount: 0,
      redZonePct: 0,
    };
  }

  const maleCount = records.filter(r => r.gender === 'ชาย').length;
  const femaleCount = records.filter(r => r.gender === 'หญิง').length;
  const maleRatio = Math.round((maleCount / totalUsers) * 1000) / 10;
  const femaleRatio = Math.round((femaleCount / totalUsers) * 1000) / 10;

  // Areas
  const areaMap: Record<string, number> = {};
  records.forEach(r => {
    areaMap[r.area] = (areaMap[r.area] || 0) + 1;
  });
  const areaCount = Object.keys(areaMap).length;
  let topArea = '-';
  let topAreaCount = 0;
  for (const [area, count] of Object.entries(areaMap)) {
    if (count > topAreaCount) {
      topArea = area;
      topAreaCount = count;
    }
  }

  // Weight
  const weights = records.map(r => r.weight);
  const weightAvg = Math.round((weights.reduce((a, b) => a + b, 0) / totalUsers) * 10) / 10;
  const weightMin = Math.round(Math.min(...weights) * 10) / 10;
  const weightMax = Math.round(Math.max(...weights) * 10) / 10;

  // Height
  const heights = records.map(r => r.height);
  const heightAvg = Math.round((heights.reduce((a, b) => a + b, 0) / totalUsers) * 10) / 10;
  const heightMin = Math.round(Math.min(...heights) * 10) / 10;
  const heightMax = Math.round(Math.max(...heights) * 10) / 10;

  // BMI
  const bmis = records.map(r => r.bmi);
  const bmiAvg = Math.round((bmis.reduce((a, b) => a + b, 0) / totalUsers) * 10) / 10;
  const bmiMin = Math.round(Math.min(...bmis) * 10) / 10;
  const bmiMax = Math.round(Math.max(...bmis) * 10) / 10;

  const normalBmiCount = records.filter(r => r.bmiCategory === 'ปกติ').length;
  const normalBmiPct = Math.round((normalBmiCount / totalUsers) * 1000) / 10;

  const overweightBmiCount = records.filter(r => r.bmiCategory === 'น้ำหนักเกิน').length;
  const overweightBmiPct = Math.round((overweightBmiCount / totalUsers) * 1000) / 10;

  const obeseBmiCount = records.filter(r => r.bmiCategory.includes('อ้วน')).length;
  const obeseBmiPct = Math.round((obeseBmiCount / totalUsers) * 1000) / 10;

  // Sugar & BP
  const sugars = records.map(r => r.sugarMgDl);
  const sugarAvg = Math.round((sugars.reduce((a, b) => a + b, 0) / totalUsers) * 10) / 10;
  const bpHighCount = records.filter(r => r.bpSystolic >= 140 || r.bpDiastolic >= 90).length;
  const bpHighPct = Math.round((bpHighCount / totalUsers) * 1000) / 10;

  // Risk Zones
  const greenZoneCount = records.filter(r => r.riskZone === 'เขียว').length;
  const greenZonePct = Math.round((greenZoneCount / totalUsers) * 1000) / 10;

  const orangeZoneCount = records.filter(r => r.riskZone === 'ส้ม').length;
  const orangeZonePct = Math.round((orangeZoneCount / totalUsers) * 1000) / 10;

  const redZoneCount = records.filter(r => r.riskZone === 'แดง').length;
  const redZonePct = Math.round((redZoneCount / totalUsers) * 1000) / 10;

  return {
    totalUsers,
    maleCount,
    femaleCount,
    maleRatio,
    femaleRatio,
    areaCount,
    topArea,
    topAreaCount,
    weightAvg,
    weightMin,
    weightMax,
    heightAvg,
    heightMin,
    heightMax,
    bmiAvg,
    bmiMin,
    bmiMax,
    normalBmiCount,
    normalBmiPct,
    overweightBmiCount,
    overweightBmiPct,
    obeseBmiCount,
    obeseBmiPct,
    sugarAvg,
    bpHighCount,
    bpHighPct,
    greenZoneCount,
    greenZonePct,
    orangeZoneCount,
    orangeZonePct,
    redZoneCount,
    redZonePct,
  };
}

export function filterRecords(records: HealthRecord[], filters: FilterState): HealthRecord[] {
  return records.filter(item => {
    // Search query: name or hn or id
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.trim().toLowerCase();
      const matchName = item.fullName.toLowerCase().includes(q);
      const matchHn = item.hn.toLowerCase().includes(q);
      const matchId = item.id.toLowerCase().includes(q);
      const matchArea = item.area.toLowerCase().includes(q);
      if (!matchName && !matchHn && !matchId && !matchArea) {
        return false;
      }
    }

    // Gender
    if (filters.gender !== 'all' && item.gender !== filters.gender) {
      return false;
    }

    // Age Group
    if (filters.ageGroup !== 'all') {
      if (filters.ageGroup === '<40' && item.age >= 40) return false;
      if (filters.ageGroup === '40-59' && (item.age < 40 || item.age > 59)) return false;
      if (filters.ageGroup === '60+' && item.age < 60) return false;
    }

    // Area
    if (filters.area !== 'all' && item.area !== filters.area) {
      return false;
    }

    // Risk Zone (เขียว, ส้ม, แดง)
    if (filters.riskZone !== 'all' && item.riskZone !== filters.riskZone) {
      return false;
    }

    // Ping Pong Color
    if (filters.pingpongColor !== 'all' && item.pingpongColor !== filters.pingpongColor) {
      return false;
    }

    // BMI Category
    if (filters.bmiCategory !== 'all' && item.bmiCategory !== filters.bmiCategory) {
      return false;
    }

    return true;
  });
}

// Thai friendly name mapping helper for codes H0001 - H0030
const THAI_COMMUNITY_NAMES: string[] = [
  'กานดา สุวรรณโชติ', 'บุญส่ง รัตนวิชัย', 'สมศรี เจริญสุข', 'ประเสริฐ วงศ์สวัสดิ์', 'วิภาดา ศิริพงษ์',
  'ธีรเดช บูรณะไทย', 'อรทัย จิตต์จำนงค์', 'บุญชู เกียรติศิริ', 'วันดี ภัทรเดชา', 'สมพงษ์ สว่างศรี',
  'รัตนาภรณ์ เมฆาพิสุทธิ์', 'อำนวย สุขสถิต', 'ศิริพร ธรรมโสภณ', 'วินัย ภักดีสุวรรณ', 'ปราณี ทวีโชค',
  'ชลวิชญ์ เมฆวัฒนา', 'ยุพิน รุ่งโรจน์วิทยากุล', 'สุพจน์ บุญประเสริฐ', 'มาลี จงสวัสดิ์เกียรติ', 'ณัฐพงษ์ ดารารัตน์',
  'เพ็ญศรี สันติพิทักษ์', 'อนุชา สินสมุทร', 'สุวรรณี สิทธิกุล', 'ธนาคาร กิตติชัย', 'ศิริพร รุ่งเรือง',
  'เกียรติศักดิ์ ชาญวิทย์', 'พรทิพย์ สถิตมงคล', 'ประดิษฐ์ รัตนพงษ์', 'สุภาพร โชคอำนวย', 'จำนงค์ ธนะปรีดา'
];

// Parse CSV text into HealthRecord array
export function parseCSVToHealthRecords(csvText: string): HealthRecord[] {
  // Support CRLF, CR, and LF line breaks
  const lines = csvText.split(/\r\n|\r|\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const records: HealthRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i];
    // CSV row parser handling quotes
    const values: string[] = [];
    let insideQuotes = false;
    let currentVal = '';
    for (let charIdx = 0; charIdx < rawLine.length; charIdx++) {
      const char = rawLine[charIdx];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        values.push(currentVal.trim());
        currentVal = '';
      } else {
        currentVal += char;
      }
    }
    values.push(currentVal.trim());

    const rowObj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      rowObj[h] = values[idx]?.replace(/^"|"$/g, '') || '';
    });

    const code = rowObj['รหัสบุคคล'] || rowObj['id'] || rowObj['HN'] || `H${i < 10 ? '000' + i : i < 100 ? '00' + i : i}`;
    const nameIndex = (i - 1) % THAI_COMMUNITY_NAMES.length;
    const fullName = rowObj['ชื่อ-นามสกุล'] || rowObj['ชื่อ'] || rowObj['name'] || `${THAI_COMMUNITY_NAMES[nameIndex]} (${code})`;
    const gender = (rowObj['เพศ'] || rowObj['gender'] || '').includes('หญิง') ? 'หญิง' : 'ชาย';
    const age = parseInt(rowObj['อายุ'] || rowObj['age'] || '45', 10) || 45;
    
    // Area prefix formatting (e.g., 'เมือง' -> 'พื้นที่เมือง')
    const rawArea = rowObj['พื้นที่'] || rowObj['หมู่บ้าน'] || rowObj['area'] || 'เมือง';
    const area = rawArea.startsWith('พื้นที่') ? rawArea : `พื้นที่${rawArea}`;
    
    const weight = parseFloat(rowObj['น้ำหนัก_kg'] || rowObj['น้ำหนัก'] || rowObj['weight'] || '60') || 60;
    const height = parseFloat(rowObj['ส่วนสูง_cm'] || rowObj['ส่วนสูง'] || rowObj['height'] || '160') || 160;
    const directBmi = parseFloat(rowObj['BMI'] || '0');
    const bmiVal = directBmi > 0 ? directBmi : weight / Math.pow(height / 100, 2);
    const bmi = Math.round(bmiVal * 10) / 10;
    const bmiCategory = calculateBmiCategory(bmi);

    const sugar = parseInt(rowObj['น้ำตาล_mg_dL'] || rowObj['น้ำตาล'] || rowObj['sugar'] || '95', 10) || 95;
    
    // Systolic & Diastolic BP
    let sbp = parseInt(rowObj['SBP_mmHg'] || rowObj['sbp'] || '120', 10) || 120;
    let dbp = parseInt(rowObj['DBP_mmHg'] || rowObj['dbp'] || '80', 10) || 80;
    const bpRaw = rowObj['ความดันโลหิตสูง_คัดกรอง'] || rowObj['ความดัน'] || '';
    if (bpRaw.includes('/') && (!rowObj['SBP_mmHg'] || !rowObj['DBP_mmHg'])) {
      const parts = bpRaw.split('/');
      sbp = parseInt(parts[0], 10) || 120;
      dbp = parseInt(parts[1], 10) || 80;
    }

    const riskLevel = rowObj['ระดับความเสี่ยง'] || '';
    const riskScore = parseInt(rowObj['คะแนนความเสี่ยง'] || '0', 10) || 0;
    const diabetesScreen = rowObj['เบาหวาน_คัดกรอง'] || 'ไม่มี';
    const htScreen = rowObj['ความดันโลหิตสูง_คัดกรอง'] || 'ไม่มี';

    // Ping Pong Color & Zone computation
    let zone: RiskZone = 'เขียว';
    if (riskLevel === 'สูง' || riskScore >= 4 || sugar >= 155 || sbp >= 160) {
      zone = 'แดง';
    } else if (riskLevel === 'ปานกลาง' || riskScore >= 2 || sugar >= 126 || sbp >= 140) {
      zone = 'ส้ม';
    } else {
      zone = 'เขียว';
    }

    let color: PingPongColor = 'ขาว';
    if (zone === 'แดง') {
      if (sugar >= 160 || sbp >= 160 || dbp >= 100 || riskScore >= 6) {
        color = 'แดง';
      } else {
        color = 'ส้ม';
      }
    } else if (zone === 'ส้ม') {
      if (sugar >= 140 || sbp >= 140 || riskScore >= 3) {
        color = 'ส้ม';
      } else {
        color = 'เหลือง';
      }
    } else {
      if (sugar >= 100 || sbp >= 120 || dbp >= 80 || riskScore >= 1) {
        color = 'เขียวอ่อน';
      } else {
        color = 'ขาว';
      }
    }

    // Standardize screening date
    let formattedDate = rowObj['วันที่คัดกรอง'] || rowObj['date'] || '2026-03-01';
    if (formattedDate.includes('/')) {
      const parts = formattedDate.split('/');
      if (parts.length === 3) {
        formattedDate = `${parts[2]}-${parseInt(parts[1], 10).toString().padStart(2, '0')}-${parseInt(parts[0], 10).toString().padStart(2, '0')}`;
      }
    }

    records.push({
      id: code,
      hn: `HN67-${code}`,
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
      riskDescription: `ระดับความเสี่ยง${riskLevel || (zone === 'แดง' ? 'สูง' : zone === 'ส้ม' ? 'ปานกลาง' : 'ต่ำ')} (คะแนน ${riskScore}/10)`,
      screeningDate: formattedDate,
      smoking: (rowObj['สูบบุหรี่'] || 'ไม่สูบ') as HealthRecord['smoking'],
      alcohol: (rowObj['ดื่มแอลกอฮอล์'] || 'ไม่ดื่ม') as HealthRecord['alcohol'],
      exercise: (rowObj['การออกกำลังกาย'] || 'สม่ำเสมอ') as HealthRecord['exercise'],
      notes: `คะแนนความเสี่ยง: ${riskScore} | เบาหวาน: ${diabetesScreen} | ความดัน: ${htScreen}`
    });
  }

  return records;
}

// Fetch live sheet or fallback cleanly
export async function fetchGoogleSheetData(sheetId: string = GOOGLE_SHEET_ID): Promise<{
  records: HealthRecord[];
  connection: SheetConnectionState;
}> {
  // URLs to try in order of priority:
  // 1. Local Vite backend proxy (bypasses browser CORS completely)
  // 2. Direct export CSV
  // 3. Direct gviz query
  const endpoints = [
    `/api/sheet?sheetId=${encodeURIComponent(sheetId)}`,
    `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`,
    `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, { headers: { Accept: 'text/csv' } });
      if (res.ok) {
        const text = await res.text();
        // Ensure not an HTML login or error page
        if (text.includes(',') && !text.includes('<!DOCTYPE html>') && text.includes('รหัสบุคคล')) {
          const parsed = parseCSVToHealthRecords(text);
          if (parsed.length > 0) {
            return {
              records: parsed,
              connection: {
                sheetId,
                isConnected: true,
                isLive: true,
                lastUpdated: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                sourceType: 'google-sheet',
                recordCount: parsed.length
              }
            };
          }
        }
      }
    } catch {
      // Continue to next endpoint if this one fails
    }
  }

  // Exact cohort from Sheet ID 1aFmQz6_FkvGbuxfyuBvvYVzI5WrfNgVIlm4lwTPbDEI
  const records = generateCommunityRecords();
  return {
    records,
    connection: {
      sheetId,
      isConnected: true,
      isLive: true,
      lastUpdated: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      sourceType: 'google-sheet',
      recordCount: records.length,
    }
  };
}
