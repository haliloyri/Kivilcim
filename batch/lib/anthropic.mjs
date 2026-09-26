// Thin wrapper around the Anthropic Message Batches API.
// No SDK dependency — Node 22's built-in fetch is enough.
//
// Requires ANTHROPIC_API_KEY in the environment (see batch/README.md for
// where to get one and how to set it).

const API_BASE = 'https://api.anthropic.com/v1';
const ANTHROPIC_VERSION = '2023-06-01';

const apiKey = () => {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error(
      'ANTHROPIC_API_KEY is not set. See batch/README.md — "API anahtarını nereden alırım?".'
    );
  }
  return key;
};

const headers = () => ({
  'x-api-key': apiKey(),
  'anthropic-version': ANTHROPIC_VERSION,
  'content-type': 'application/json',
});

const asJson = async (res, label) => {
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`${label} failed: HTTP ${res.status}\n${text}`);
  }
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

/**
 * Submit a batch of message requests.
 * @param {{customId: string, model: string, maxTokens: number, system?: string, messages: object[]}[]} requests
 */
export const submitBatch = async (requests) => {
  const body = {
    requests: requests.map((r) => ({
      custom_id: r.customId,
      params: {
        model: r.model,
        max_tokens: r.maxTokens,
        ...(r.system ? { system: r.system } : {}),
        messages: r.messages,
      },
    })),
  };
  const res = await fetch(`${API_BASE}/messages/batches`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  });
  return asJson(res, 'submitBatch');
};

/** Get a batch's current status. */
export const getBatch = async (batchId) => {
  const res = await fetch(`${API_BASE}/messages/batches/${batchId}`, {
    headers: headers(),
  });
  return asJson(res, 'getBatch');
};

/**
 * Download and parse a finished batch's results (JSONL).
 * @returns {Promise<{customId: string, status: string, text?: string, error?: string}[]>}
 */
export const fetchBatchResults = async (batch) => {
  if (!batch.results_url) {
    throw new Error('Batch has no results_url yet — it has not finished. Run 03-check-batch.mjs until ended_at is set.');
  }
  const res = await fetch(batch.results_url, { headers: headers() });
  if (!res.ok) {
    throw new Error(`fetchBatchResults failed: HTTP ${res.status}\n${await res.text()}`);
  }
  const text = await res.text();
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const row = JSON.parse(line);
      const customId = row.custom_id;
      const result = row.result;
      if (result?.type === 'succeeded') {
        const content = result.message?.content || [];
        const text = content.map((c) => c.text || '').join('\n').trim();
        return { customId, status: 'succeeded', text };
      }
      return { customId, status: result?.type || 'unknown', error: JSON.stringify(result?.error || result) };
    });
};

export const MODEL_PRICES_USD_PER_MTOK = Object.freeze({
  // [input, output] — Batch API price (half the standard rate).
  'claude-opus-5-5': [2, 10],
  'claude-sonnet-5': [1, 5],
  'claude-fable-5-1': [5, 25],
  'claude-haiku-4-5-20251001': [0.5, 2.5],
});
