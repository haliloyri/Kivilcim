import fs from 'node:fs/promises';
import path from 'node:path';
import { SpreadsheetFile, Workbook } from '@oai/artifact-tool';

const runtimeDir = path.dirname(new URL(import.meta.url).pathname);
const outputDir = path.dirname(runtimeDir);
const dataPath = path.join(outputDir, 'all_story_viral_scores.json');
const rows = JSON.parse(await fs.readFile(dataPath, 'utf8'));

if (rows.length !== 750) throw new Error(`Expected 750 rows, got ${rows.length}`);

const NAVY = '#142A4A';
const NAVY_2 = '#2C4A73';
const GOLD = '#E5C27A';
const CREAM = '#FAF8F3';
const PAPER = '#FFFDF9';
const BORDER = '#E7DFD4';
const MUTED = '#6B7280';
const GREEN = '#3A5F3C';
const RED = '#B3261E';
const PALE_GOLD = '#FFF4D6';
const PALE_BLUE = '#D9E2EC';

const workbook = Workbook.create();
const summary = workbook.worksheets.add('Özet');
const scores = workbook.worksheets.add('Tüm Hikâyeler');
const rubric = workbook.worksheets.add('Rubrik');
const source = workbook.worksheets.add('Kaynak Metin');

for (const sheet of [summary, scores, rubric, source]) {
  sheet.showGridLines = false;
}

// ── Rubric and editable assumptions ─────────────────────────────────────────
rubric.mergeCells('A1:C1');
rubric.getRange('A1').values = [['Sosyal Potansiyel Puanlama Rubriği']];
rubric.getRange('A1:C1').format = {
  fill: NAVY,
  font: { bold: true, color: '#FFFFFF', size: 18 },
  rowHeight: 34,
  verticalAlignment: 'center',
};
rubric.mergeCells('A2:C2');
rubric.getRange('A2').values = [[
  'Puanlar editoryal tahmindir; gerçek beğeni, paylaşım, kaydetme ve ses kaydı verisi değildir.',
]];
rubric.getRange('A2:C2').format = { fill: CREAM, font: { color: MUTED, italic: true }, rowHeight: 28 };

rubric.getRange('A4:C4').values = [['Kriter', 'Azami Puan', 'Tam puan ölçütü']];
const rubricRows = [
  ['Dikkat / Hook', 15, 'İlk 2 saniyede anlaşılır; dürüst bir merak veya ters köşe yaratır.'],
  ['Duygusal Bağ / Beğeni', 10, 'Şaşkınlık, umut, empati veya “bu tam ben” hissi oluşturur.'],
  ['Paylaşma Dürtüsü', 15, 'Okur hikâyeyi kime göndereceğini hemen düşünür.'],
  ['Kaydetme Değeri', 15, 'Sonra kullanılacak bir fikir, soru, yöntem veya çerçeve verir.'],
  ['Sesli Not / Sohbet', 10, 'Kullanıcı kendi örneğini 30–60 saniyede anlatabilir.'],
  ['Hikâye Akışı', 10, 'Sahne, gerilim, dönüş ve tatmin edici sonuç içerir.'],
  ['Kısa Video Uygunluğu', 20, '30–45 saniyeye sığar; 3–5 görsel sahne ve net final sunar.'],
  ['Güven / Doğruluk', 5, 'Ana iddia doğrulanabilir, dikkatli ifade edilmiş ve marka güvenlidir.'],
];
rubric.getRange('A5:C12').values = rubricRows;
rubric.getRange('A13:B13').values = [['Toplam', 100]];
rubric.getRange('A13:C13').format = {
  fill: PALE_BLUE,
  font: { bold: true, color: NAVY },
  borders: { preset: 'doubleBottom', style: 'medium', color: NAVY },
};

rubric.getRange('A16:B16').values = [['Karar Eşiği', 'Alt Sınır']];
rubric.getRange('A17:B21').values = [
  ['Öncelikli video', 90],
  ['Video kuyruğu', 85],
  ['Revize et', 78],
  ['Kartla test', 70],
  ['Düşük öncelik', 0],
];
rubric.getRange('B17:B21').format = { fill: PALE_GOLD, font: { color: NAVY, bold: true }, numberFormat: '0' };
rubric.getRange('A24:C28').values = [
  ['Yöntem Notları', '', ''],
  ['Kapsam', '750', 'Türkçe hikâyenin tamamı; story_id 1059–1808.'],
  ['Hazırlık', '117 zengin', 'Hook, punchline, 30 saniye, soru ve karşıtlık alanları tam.'],
  ['Sıralama', 'Tahmini', 'Toplam puana; eşitlikte video ve paylaşım puanına göre.'],
  ['Doğrulama', 'Zorunlu', 'Video üretiminden önce ana iddia ve görsel hakları kontrol edilmelidir.'],
];
rubric.getRange('A24:C24').format = { fill: GOLD, font: { bold: true, color: NAVY } };
rubric.getRange('A29:C29').values = [['Veri Kaynağı', 'Yerel katalog', 'assets/kivilcim.db — 18 Temmuz 2026 tarihli çalışma kopyası.']];

for (const range of ['A4:C4', 'A16:B16']) {
  rubric.getRange(range).format = {
    fill: NAVY_2,
    font: { bold: true, color: '#FFFFFF' },
    rowHeight: 26,
  };
}
rubric.getRange('A4:C29').format.borders = {
  insideHorizontal: { style: 'thin', color: BORDER },
  bottom: { style: 'thin', color: BORDER },
};
rubric.getRange('A1:A29').format.columnWidth = 26;
rubric.getRange('B1:B29').format.columnWidth = 14;
rubric.getRange('C1:C29').format.columnWidth = 78;
rubric.getRange('C2:C29').format.wrapText = true;
rubric.freezePanes.freezeRows(4);

// ── Source data ──────────────────────────────────────────────────────────────
const sourceHeaders = [
  'Story ID', 'Versiyon', 'Ana Kategori', 'Alt Kategori', 'Kaynak Kitap', 'Yazar', 'Yayın Yılı',
  'Başlık', 'Açıklama', 'Gövde', 'Hook', 'Punchline', '30 Saniye', 'Soru', 'Ana Karşıtlık',
];
source.getRange('A1:O1').values = [sourceHeaders];
source.getRange(`A2:O${rows.length + 1}`).values = rows
  .slice()
  .sort((a, b) => a.story_id - b.story_id)
  .map((row) => [
    row.story_id, row.version, row.main_category, row.subcategory, row.book_title, row.author,
    row.publish_year, row.title, row.description, row.content, row.hook_text, row.punchline,
    row.thirty_sec, row.question, row.key_contrast,
  ]);
source.getRange('A1:O1').format = {
  fill: NAVY,
  font: { bold: true, color: '#FFFFFF' },
  rowHeight: 30,
  wrapText: true,
  verticalAlignment: 'center',
};
source.getRange(`A2:G${rows.length + 1}`).format.rowHeight = 20;
source.getRange(`A2:A${rows.length + 1}`).format.numberFormat = '0';
source.getRange(`A1:O${rows.length + 1}`).format.borders = {
  insideHorizontal: { style: 'thin', color: '#F0ECE5' },
};
const sourceWidths = [10, 10, 16, 24, 32, 24, 10, 42, 60, 80, 44, 44, 60, 44, 42];
sourceWidths.forEach((width, index) => {
  source.getRangeByIndexes(0, index, rows.length + 1, 1).format.columnWidth = width;
});
source.getRange(`H2:O${rows.length + 1}`).format.wrapText = false;
source.freezePanes.freezeRows(1);
source.freezePanes.freezeColumns(2);
const sourceTable = source.tables.add(`A1:O${rows.length + 1}`, true, 'SourceStoriesTable');
sourceTable.style = 'TableStyleMedium2';

// ── Scored output ────────────────────────────────────────────────────────────
const scoreHeaders = [
  'Sıra', 'Story ID', 'Başlık', 'Ana Kategori', 'Alt Kategori', 'Kaynak Kitap', 'Yazar', 'Versiyon',
  'Hazırlık', 'Dikkat /15', 'Duygu /10', 'Paylaşım /15', 'Kaydetme /15', 'Sesli Not /10',
  'Akış /10', 'Video /20', 'Güven /5', 'Toplam /100', 'Karar', 'Önerilen Format',
  'Kısa Değerlendirme', 'Doğruluk Notu',
];
scores.getRange('A1:V1').values = [scoreHeaders];
scores.getRange(`B2:Q${rows.length + 1}`).values = rows.map((row) => [
  row.story_id, row.title, row.main_category, row.subcategory, row.book_title, row.author, row.version,
  row.readiness, row.hook, row.emotion, row.share, row.save, row.voice, row.arc, row.video, row.trust,
]);
scores.getRange(`U2:U${rows.length + 1}`).values = rows.map((row) => [row.reason]);

scores.getRange('A2').formulas = [['=COUNTIF($R$2:$R$751,">"&R2)+COUNTIF($R$2:R2,R2)']];
scores.getRange(`A2:A${rows.length + 1}`).fillDown();
scores.getRange('R2').formulas = [['=SUM(J2:Q2)']];
scores.getRange(`R2:R${rows.length + 1}`).fillDown();
scores.getRange('S2').formulas = [[
  '=IF(R2>=\'Rubrik\'!$B$17,"Öncelikli video",IF(R2>=\'Rubrik\'!$B$18,"Video kuyruğu",IF(R2>=\'Rubrik\'!$B$19,"Revize et",IF(R2>=\'Rubrik\'!$B$20,"Kartla test","Düşük öncelik"))))',
]];
scores.getRange(`S2:S${rows.length + 1}`).fillDown();
scores.getRange('T2').formulas = [[
  '=IF(AND(R2>=85,P2>=16,M2>=12,L2>=12),"Reel + Carousel",IF(AND(R2>=85,P2>=16,N2>=8),"Soru odaklı Reel",IF(AND(R2>=85,P2>=16),"Reel / Short",IF(M2>=11,"Carousel","Kart testi"))))',
]];
scores.getRange(`T2:T${rows.length + 1}`).fillDown();
scores.getRange('V2').formulas = [['=IF(Q2<=3,"Kaynak kontrolü şart",IF(Q2=4,"Kaynak kontrolü önerilir","Standart doğrulama"))']];
scores.getRange(`V2:V${rows.length + 1}`).fillDown();

scores.getRange('A1:V1').format = {
  fill: NAVY,
  font: { bold: true, color: '#FFFFFF' },
  rowHeight: 34,
  wrapText: true,
  verticalAlignment: 'center',
};
scores.getRange(`A2:V${rows.length + 1}`).format.rowHeight = 24;
scores.getRange(`A2:B${rows.length + 1}`).format.numberFormat = '0';
scores.getRange(`J2:R${rows.length + 1}`).format.numberFormat = '0';
scores.getRange(`J2:Q${rows.length + 1}`).format.fill = PALE_GOLD;
scores.getRange(`R2:R${rows.length + 1}`).format = { fill: PALE_BLUE, font: { bold: true, color: NAVY }, numberFormat: '0' };
scores.getRange(`A1:V${rows.length + 1}`).format.borders = {
  insideHorizontal: { style: 'thin', color: '#F0ECE5' },
};
scores.getRange(`C2:C${rows.length + 1}`).format.wrapText = true;
scores.getRange(`U2:V${rows.length + 1}`).format.wrapText = true;
scores.getRange(`A2:B${rows.length + 1}`).format.horizontalAlignment = 'center';
scores.getRange(`H2:T${rows.length + 1}`).format.horizontalAlignment = 'center';

const scoreWidths = [8, 10, 44, 16, 22, 30, 22, 10, 12, 11, 11, 12, 12, 13, 10, 10, 10, 12, 18, 20, 62, 24];
scoreWidths.forEach((width, index) => {
  scores.getRangeByIndexes(0, index, rows.length + 1, 1).format.columnWidth = width;
});

scores.getRange(`R2:R${rows.length + 1}`).conditionalFormats.add('colorScale', {
  criteria: [
    { type: 'lowestValue', color: '#F8D7DA' },
    { type: 'percentile', value: 50, color: '#FFF4D6' },
    { type: 'highestValue', color: '#DDEED8' },
  ],
});
scores.getRange(`S2:S${rows.length + 1}`).conditionalFormats.add('containsText', {
  text: 'Öncelikli video',
  format: { fill: '#DDEED8', font: { bold: true, color: GREEN } },
});
scores.getRange(`S2:S${rows.length + 1}`).conditionalFormats.add('containsText', {
  text: 'Düşük öncelik',
  format: { fill: '#F8D7DA', font: { color: RED } },
});
scores.freezePanes.freezeRows(1);
scores.freezePanes.freezeColumns(3);
const scoreTable = scores.tables.add(`A1:V${rows.length + 1}`, true, 'StoryScoresTable');
scoreTable.style = 'TableStyleMedium2';

// ── Summary ──────────────────────────────────────────────────────────────────
summary.mergeCells('A1:J1');
summary.getRange('A1').values = [['Hikâye Sosyal Potansiyel Puanlaması']];
summary.getRange('A1:J1').format = {
  fill: NAVY,
  font: { bold: true, color: '#FFFFFF', size: 20 },
  rowHeight: 38,
  verticalAlignment: 'center',
};
summary.mergeCells('A2:J2');
summary.getRange('A2').values = [[
  'Amaç: en çok dikkat çekecek, paylaşılacak, kaydedilecek ve sesli anlatılacak hikâyeleri video üretimi için önceliklendirmek.',
]];
summary.getRange('A2:J2').format = { fill: CREAM, font: { color: MUTED, italic: true }, rowHeight: 30 };

const kpiLabels = [['Toplam Hikâye', '', 'Ortalama Puan', '', '90+ Aday', '', '85+ Aday', '', 'Zengin İçerik', '']];
summary.getRange('A4:J4').values = kpiLabels;
summary.getRange('A4:J4').format = { fill: PALE_BLUE, font: { bold: true, color: NAVY }, horizontalAlignment: 'center' };
for (const pair of ['A4:B4', 'C4:D4', 'E4:F4', 'G4:H4', 'I4:J4']) summary.mergeCells(pair);
summary.getRange('A5').formulas = [[`=COUNTA('Tüm Hikâyeler'!$B$2:$B$751)`]];
summary.getRange('C5').formulas = [[`=AVERAGE('Tüm Hikâyeler'!$R$2:$R$751)`]];
summary.getRange('E5').formulas = [[`=COUNTIF('Tüm Hikâyeler'!$R$2:$R$751,">=90")`]];
summary.getRange('G5').formulas = [[`=COUNTIF('Tüm Hikâyeler'!$R$2:$R$751,">=85")`]];
summary.getRange('I5').formulas = [[`=COUNTIF('Tüm Hikâyeler'!$I$2:$I$751,"Zengin")`]];
for (const cell of ['A5', 'C5', 'E5', 'G5', 'I5']) {
  summary.mergeCells(`${cell}:${String.fromCharCode(cell.charCodeAt(0) + 1)}5`);
  summary.getRange(cell).format = {
    fill: PAPER,
    font: { bold: true, color: NAVY, size: 18 },
    horizontalAlignment: 'center',
    verticalAlignment: 'center',
    rowHeight: 34,
    borders: { preset: 'outside', style: 'thin', color: BORDER },
  };
}
summary.getRange('C5:D5').format.numberFormat = '0.0';

summary.mergeCells('A7:G7');
summary.getRange('A7').values = [['İlk 20 Video Adayı']];
summary.getRange('A7:G7').format = { fill: GOLD, font: { bold: true, color: NAVY }, rowHeight: 28 };
summary.getRange('A8:G8').values = [['Sıra', 'Story ID', 'Başlık', 'Kategori', 'Puan', 'Karar', 'Format']];
summary.getRange('A8:G8').format = { fill: NAVY_2, font: { bold: true, color: '#FFFFFF' }, rowHeight: 26 };
for (let index = 0; index < 20; index += 1) {
  const targetRow = 9 + index;
  const sourceRow = 2 + index;
  summary.getRange(`A${targetRow}:G${targetRow}`).formulas = [[
    `='Tüm Hikâyeler'!A${sourceRow}`,
    `='Tüm Hikâyeler'!B${sourceRow}`,
    `='Tüm Hikâyeler'!C${sourceRow}`,
    `='Tüm Hikâyeler'!D${sourceRow}`,
    `='Tüm Hikâyeler'!R${sourceRow}`,
    `='Tüm Hikâyeler'!S${sourceRow}`,
    `='Tüm Hikâyeler'!T${sourceRow}`,
  ]];
}
summary.getRange('A8:G28').format.borders = {
  insideHorizontal: { style: 'thin', color: BORDER },
  bottom: { style: 'thin', color: BORDER },
};
summary.getRange('C9:C28').format.wrapText = true;
summary.getRange('A9:B28').format.horizontalAlignment = 'center';
summary.getRange('E9:G28').format.horizontalAlignment = 'center';
summary.getRange('E9:E28').format = { fill: PALE_BLUE, font: { bold: true, color: NAVY }, numberFormat: '0' };
summary.getRange('A9:G28').format.rowHeight = 28;

const categories = [...new Set(rows.map((row) => row.main_category))].sort((a, b) => a.localeCompare(b, 'tr'));
summary.mergeCells('A31:E31');
summary.getRange('A31').values = [['Kategori Özeti']];
summary.getRange('A31:E31').format = { fill: GOLD, font: { bold: true, color: NAVY }, rowHeight: 28 };
summary.getRange('A32:E32').values = [['Kategori', 'Hikâye', 'Ort. Puan', '85+ Aday', '90+ Aday']];
summary.getRange('A32:E32').format = { fill: NAVY_2, font: { bold: true, color: '#FFFFFF' }, rowHeight: 26 };
summary.getRange(`A33:A${32 + categories.length}`).values = categories.map((category) => [category]);
for (let index = 0; index < categories.length; index += 1) {
  const row = 33 + index;
  summary.getRange(`B${row}:E${row}`).formulas = [[
    `=COUNTIF('Tüm Hikâyeler'!$D$2:$D$751,A${row})`,
    `=IFERROR(AVERAGEIF('Tüm Hikâyeler'!$D$2:$D$751,A${row},'Tüm Hikâyeler'!$R$2:$R$751),0)`,
    `=COUNTIFS('Tüm Hikâyeler'!$D$2:$D$751,A${row},'Tüm Hikâyeler'!$R$2:$R$751,">=85")`,
    `=COUNTIFS('Tüm Hikâyeler'!$D$2:$D$751,A${row},'Tüm Hikâyeler'!$R$2:$R$751,">=90")`,
  ]];
}
summary.getRange(`A32:E${32 + categories.length}`).format.borders = {
  insideHorizontal: { style: 'thin', color: BORDER },
  bottom: { style: 'thin', color: BORDER },
};
summary.getRange(`B33:E${32 + categories.length}`).format.horizontalAlignment = 'center';
summary.getRange(`C33:C${32 + categories.length}`).format.numberFormat = '0.0';

summary.mergeCells('G31:J31');
summary.getRange('G31').values = [['Okuma Anahtarı']];
summary.getRange('G31:J31').format = { fill: GOLD, font: { bold: true, color: NAVY }, rowHeight: 28 };
summary.getRange('G32:J38').values = [
  ['90–100', 'Öncelikli video', '', 'Doğruluk kontrolü sonrası üret'],
  ['85–89', 'Video kuyruğu', '', '2–3 hook ile test et'],
  ['78–84', 'Revize et', '', 'Zayıf alt puanı güçlendir'],
  ['70–77', 'Kartla test', '', 'Carousel/kart verisi topla'],
  ['0–69', 'Düşük öncelik', '', 'Şimdilik bütçe ayırma'],
  ['Zengin', 'Sosyal alanlar hazır', '', 'Hook + 30 sn + soru mevcut'],
  ['Temel', 'İçerik puanlandı', '', 'Video metni ayrıca hazırlanmalı'],
];
summary.getRange('G32:J38').format.borders = { insideHorizontal: { style: 'thin', color: BORDER } };
summary.getRange('G32:G36').format = { fill: PALE_GOLD, font: { bold: true, color: NAVY }, horizontalAlignment: 'center' };
summary.getRange('A44:J44').merge();
summary.getRange('A44').values = [[
  'Not: Ham adetler yerine paylaşım/okuma, kaydetme/okuma ve ses kaydı/okuma oranları geldikçe bu tahmini puanlar davranış verisiyle güncellenmelidir.',
]];
summary.getRange('A44:J44').format = { fill: CREAM, font: { color: MUTED, italic: true }, wrapText: true, rowHeight: 34 };

const summaryWidths = [10, 12, 46, 18, 12, 20, 18, 18, 18, 34];
summaryWidths.forEach((width, index) => {
  summary.getRangeByIndexes(0, index, 45, 1).format.columnWidth = width;
});
summary.freezePanes.freezeRows(2);

// ── Compact verification and previews ───────────────────────────────────────
const inspections = [];
for (const spec of [
  { sheetId: 'Özet', range: 'A1:J44' },
  { sheetId: 'Tüm Hikâyeler', range: 'A1:V12' },
  { sheetId: 'Rubrik', range: 'A1:C29' },
  { sheetId: 'Kaynak Metin', range: 'A1:O8' },
]) {
  const check = await workbook.inspect({ kind: 'table', ...spec, include: 'values,formulas', tableMaxRows: 12, tableMaxCols: 22, maxChars: 7000 });
  inspections.push(check.ndjson);
}
await fs.writeFile(path.join(runtimeDir, 'inspection.ndjson'), inspections.join('\n'));

const errorScan = await workbook.inspect({
  kind: 'match',
  searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A',
  options: { useRegex: true, maxResults: 300 },
  summary: 'final formula error scan',
});
await fs.writeFile(path.join(runtimeDir, 'formula_errors.ndjson'), errorScan.ndjson);

for (const preview of [
  ['Özet', 'A1:J44', 'preview_summary.png'],
  ['Tüm Hikâyeler', 'A1:V22', 'preview_scores.png'],
  ['Rubrik', 'A1:C29', 'preview_rubric.png'],
  ['Kaynak Metin', 'A1:O10', 'preview_source.png'],
]) {
  const blob = await workbook.render({ sheetName: preview[0], range: preview[1], scale: 1.25, format: 'png' });
  await fs.writeFile(path.join(runtimeDir, preview[2]), new Uint8Array(await blob.arrayBuffer()));
}

const exported = await SpreadsheetFile.exportXlsx(workbook);
await exported.save(path.join(outputDir, 'Hikaye_Viral_Puanlari.xlsx'));
console.log(JSON.stringify({ output: path.join(outputDir, 'Hikaye_Viral_Puanlari.xlsx'), rows: rows.length }, null, 2));
