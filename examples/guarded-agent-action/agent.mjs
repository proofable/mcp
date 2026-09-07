import fs from 'node:fs';
import path from 'node:path';

import { evaluateRuntimeAction } from '@proofable/sdk/runtime-mount';

const mountPath = path.resolve(process.cwd(), '.proofable', 'mount.json');
const action = String(process.argv[2] || process.env.PROOFABLE_AGENT_ACTION || '').trim();
const irreversible = process.argv.includes('--irreversible');

if (!action) {
  console.error('Usage: npm start -- <action> [--irreversible]');
  process.exit(1);
}

if (!fs.existsSync(mountPath)) {
  console.error('No current Proofable mount found. Run `proofable mount <agentId> --apply codex` first.');
  process.exit(1);
}

const bundle = JSON.parse(fs.readFileSync(mountPath, 'utf8'));
const result = evaluateRuntimeAction(bundle, action, { irreversible });

console.log(JSON.stringify({
  agentId: bundle.identity?.agentId || null,
  action: result.action,
  decision: result.decision,
  code: result.code,
  message: result.message
}, null, 2));

if (!result.allowed) process.exitCode = 2;
