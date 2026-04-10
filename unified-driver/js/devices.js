/**
 * Razer & Logitech device database.
 * Maps PID to device info, features, and quirks.
 *
 * pollingReversed: Newer Razer mice use bit-reversed polling rate masks.
 *   Standard:  125=0x01, 250=0x02, 500=0x04, 1000=0x08, 2000=0x10, 4000=0x20, 8000=0x40
 *   Reversed:  125=0x40, 250=0x20, 500=0x10, 1000=0x08, 2000=0x04, 4000=0x02, 8000=0x01
 *   (1000Hz / 0x08 is the center bit and works correctly in both mappings)
 *
 * Default for unknown devices: pollingReversed = true (newer mice all use reversed)
 */

export const RAZER_DEVICES = {
  // ── Viper series ──
  0x00C0: { name: 'Viper V3 Pro',          type: 'wired',    txId: 0x1F, pollingReversed: true },
  0x00C1: { name: 'Viper V3 Pro',          type: 'wireless', txId: 0x1F, pollingReversed: true },
  0x00B6: { name: 'Viper V3 HyperSpeed',   type: 'wired',    txId: 0x1F, pollingReversed: true },
  0x00B8: { name: 'Viper V3 HyperSpeed',   type: 'wireless', txId: 0x1F, pollingReversed: true },
  0x00A5: { name: 'Viper V2 Pro',          type: 'wired',    txId: 0x1F, pollingReversed: true },
  0x00A6: { name: 'Viper V2 Pro',          type: 'wireless', txId: 0x1F, pollingReversed: true },

  // ── DeathAdder series ──
  0x00BE: { name: 'DeathAdder V4 Pro',     type: 'wired',    txId: 0x1F, pollingReversed: true },
  0x00BF: { name: 'DeathAdder V4 Pro',     type: 'wireless', txId: 0x1F, pollingReversed: true },
  0x0090: { name: 'DeathAdder V3',         type: 'wired',    txId: 0x1F, pollingReversed: true },
  0x0092: { name: 'DeathAdder V3 Pro',     type: 'wireless', txId: 0x1F, pollingReversed: true },
  0x007A: { name: 'DeathAdder V2',         type: 'wired',    txId: 0xFF, pollingReversed: false },
  0x007C: { name: 'DeathAdder V2 Pro',     type: 'wireless', txId: 0x3F, pollingReversed: false },

  // ── Basilisk series ──
  0x0099: { name: 'Basilisk V3',           type: 'wired',    txId: 0x1F, pollingReversed: true },
  0x008E: { name: 'Basilisk V3 Pro',       type: 'wireless', txId: 0x1F, pollingReversed: true },
  0x0078: { name: 'Basilisk Ultimate',     type: 'wireless', txId: 0x1F, pollingReversed: false },

  // ── Naga series ──
  0x0086: { name: 'Naga X',               type: 'wired',    txId: 0x1F, pollingReversed: false },
};

export const LOGITECH_DEVICES = {
  0xC547: { name: 'Lightspeed Receiver',       type: 'receiver' },
  0xC094: { name: 'PRO X SUPERLIGHT',          type: 'mouse' },
  0xC09B: { name: 'PRO X SUPERLIGHT 2',        type: 'mouse' },
  0x4093: { name: 'PRO X Superlight Wireless',  type: 'mouse' },
};

/**
 * Look up a Razer device by PID.
 * Unknown devices default to pollingReversed: true (safer for newer mice).
 */
export function getRazerDevice(pid) {
  return RAZER_DEVICES[pid] || {
    name: `Unknown (0x${pid.toString(16)})`,
    type: 'unknown',
    txId: 0x1F,
    pollingReversed: true,  // default reversed — all tested new mice use this
  };
}

export function getLogitechDevice(pid) {
  return LOGITECH_DEVICES[pid] || { name: `Unknown (0x${pid.toString(16)})`, type: 'unknown' };
}
