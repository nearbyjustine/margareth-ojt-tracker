import type { APIRoute } from 'astro';
import { getOjtData, resetToSeedData } from '../../lib/db';
import { buildOjtComputation } from '../../lib/ojt-engine';

export const POST: APIRoute = async ({ locals }) => {
  await resetToSeedData(locals);
  const { settings, logs, storageEngine } = await getOjtData(locals);
  const summary = buildOjtComputation(settings, logs);
  return new Response(JSON.stringify({ ok: true, storageEngine, summary }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
