import { createReadStream, createWriteStream } from "node:fs";
import { createInterface } from "node:readline";

const [inputPath, outputPath] = process.argv.slice(2);

if (!inputPath || !outputPath) {
  throw new Error("Usage: node build-dax40-2025.mjs INPUT.csv OUTPUT.json");
}

const FIVE_MINUTES_MS = 5 * 60 * 1000;
const FIXED_EST_TO_UTC_MS = 5 * 60 * 60 * 1000;
const requestedStartMs = Date.UTC(2025, 0, 1);
const requestedEndMs = Date.UTC(2026, 0, 1);

let inputRows = 0;
let uniqueInputRows = 0;
let invalidRows = 0;
let duplicateInputTimestamps = 0;
let outOfOrderInputTimestamps = 0;
let previousInputTimestamp = null;
const seenInputTimestamps = new Set();
let currentBar = null;
let outputBars = 0;
let completeBars = 0;
let partialBars = 0;
let firstBarTimestamp = null;
let lastBarTimestamp = null;
const minuteCountDistribution = {};

const output = createWriteStream(outputPath, { encoding: "utf8" });
output.write("{\n");
output.write('  "schema_version": "1.0",\n');
output.write('  "instrument": {\n');
output.write('    "requested": "DAX40",\n');
output.write('    "source_symbol": "GRX/EUR",\n');
output.write('    "source_description": "German equity-index bid-quote proxy; not the official Deutsche Boerse cash DAX and not a futures contract",\n');
output.write('    "asset_type": "index_cfd_proxy",\n');
output.write('    "currency": "EUR",\n');
output.write('    "price_side": "bid"\n');
output.write("  },\n");
output.write('  "timeframe": "5m",\n');
output.write('  "requested_period": {"from": "2025-01-01", "to": "2025-12-31"},\n');
output.write('  "timestamp": {"field": "timestamp_utc", "timezone": "UTC", "source_timezone": "fixed EST (UTC-05:00), no daylight-saving adjustment"},\n');
output.write('  "volume": {"available": false, "stored_value": null, "reason": "The source volume column is always zero and is not centralized traded volume."},\n');
output.write('  "aggregation": {"input_timeframe": "1m", "method": "first open, maximum high, minimum low, last close", "gap_policy": "no synthetic bars and no forward-fill", "quality_field": "source_minute_count"},\n');
output.write('  "source": {"provider": "HistData.com", "dataset": "HISTDATA_COM_ASCII_GRXEUR_M1_2025.zip", "download_page": "https://www.histdata.com/download-free-forex-data/", "format_specification": "https://www.histdata.com/f-a-q/data-files-detailed-specification/"},\n');
output.write('  "bars": [\n');

function writeBar(bar) {
  if (!bar) return;

  const payload = {
    timestamp_utc: new Date(bar.timestampMs).toISOString(),
    open: bar.open,
    high: bar.high,
    low: bar.low,
    close: bar.close,
    volume: null,
    source_minute_count: bar.sourceMinuteCount,
  };

  if (outputBars > 0) output.write(",\n");
  output.write(`    ${JSON.stringify(payload)}`);

  outputBars += 1;
  if (bar.sourceMinuteCount === 5) completeBars += 1;
  else partialBars += 1;
  minuteCountDistribution[bar.sourceMinuteCount] =
    (minuteCountDistribution[bar.sourceMinuteCount] ?? 0) + 1;
  firstBarTimestamp ??= payload.timestamp_utc;
  lastBarTimestamp = payload.timestamp_utc;
}

function parseTimestampToUtcMs(raw) {
  const match = /^(\d{4})(\d{2})(\d{2}) (\d{2})(\d{2})(\d{2})$/.exec(raw);
  if (!match) return null;

  const [, year, month, day, hour, minute, second] = match;
  return (
    Date.UTC(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second),
    ) + FIXED_EST_TO_UTC_MS
  );
}

const lines = createInterface({
  input: createReadStream(inputPath, { encoding: "utf8" }),
  crlfDelay: Infinity,
});

for await (const line of lines) {
  if (!line.trim()) continue;

  const [rawTimestamp, rawOpen, rawHigh, rawLow, rawClose] = line.split(";");
  const timestampMs = parseTimestampToUtcMs(rawTimestamp);
  const open = Number(rawOpen);
  const high = Number(rawHigh);
  const low = Number(rawLow);
  const close = Number(rawClose);

  if (
    timestampMs === null ||
    timestampMs < requestedStartMs ||
    timestampMs >= requestedEndMs ||
    ![open, high, low, close].every(Number.isFinite) ||
    low > high
  ) {
    invalidRows += 1;
    continue;
  }

  inputRows += 1;
  if (seenInputTimestamps.has(timestampMs)) {
    duplicateInputTimestamps += 1;
    continue;
  }
  seenInputTimestamps.add(timestampMs);
  uniqueInputRows += 1;

  if (previousInputTimestamp !== null && timestampMs < previousInputTimestamp) {
    outOfOrderInputTimestamps += 1;
  }
  previousInputTimestamp = timestampMs;

  const bucketTimestampMs = Math.floor(timestampMs / FIVE_MINUTES_MS) * FIVE_MINUTES_MS;

  if (!currentBar || currentBar.timestampMs !== bucketTimestampMs) {
    writeBar(currentBar);
    currentBar = {
      timestampMs: bucketTimestampMs,
      open,
      high,
      low,
      close,
      sourceMinuteCount: 1,
    };
    continue;
  }

  currentBar.high = Math.max(currentBar.high, high);
  currentBar.low = Math.min(currentBar.low, low);
  currentBar.close = close;
  currentBar.sourceMinuteCount += 1;
}

writeBar(currentBar);

const quality = {
  input_rows_read: inputRows,
  input_rows_used: uniqueInputRows,
  invalid_or_out_of_period_input_rows: invalidRows,
  output_bars: outputBars,
  complete_5_minute_bars: completeBars,
  partial_5_minute_bars: partialBars,
  source_minute_count_distribution: Object.fromEntries(
    Object.entries(minuteCountDistribution).sort(
      ([left], [right]) => Number(left) - Number(right),
    ),
  ),
  duplicate_input_timestamps: duplicateInputTimestamps,
  out_of_order_input_timestamps: outOfOrderInputTimestamps,
  first_bar_timestamp_utc: firstBarTimestamp,
  last_bar_timestamp_utc: lastBarTimestamp,
};

output.write("\n  ],\n");
output.write(`  "quality": ${JSON.stringify(quality, null, 2).replaceAll("\n", "\n  ")}\n`);
output.write("}\n");
output.end();

await new Promise((resolve, reject) => {
  output.on("finish", resolve);
  output.on("error", reject);
});

console.log(JSON.stringify(quality, null, 2));
