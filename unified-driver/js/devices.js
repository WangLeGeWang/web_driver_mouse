/**
 * Razer & Logitech device database.
 * Maps PID to device info, features, and quirks.
 */

export const RAZER_DEVICES = {
  // Viper V3 Pro
  0x00C0: { name: 'Viper V3 Pro',        type: 'wired',    txId: 0x1F, pollingReversed: false },
  0x00C1: { name: 'Viper V3 Pro',        type: 'wireless', txId: 0x1F, pollingReversed: false },
  // Viper V3 HyperSpeed
  0x00B6: { name: 'Viper V3 HyperSpeed', type: 'wired',    txId: 0x1F, pollingReversed: false },
  0x00B8: { name: 'Viper V3 HyperSpeed', type: 'wireless', txId: 0x1F, pollingReversed: false },
  // DeathAdder V4 Pro
  0x00BE: { name: 'DeathAdder V4 Pro',   type: 'wired',    txId: 0x1F, pollingReversed: true },
  0x00BF: { name: 'DeathAdder V4 Pro',   type: 'wireless', txId: 0x1F, pollingReversed: true },
  // Viper V2 Pro
  0x00A5: { name: 'Viper V2 Pro',        type: 'wired',    txId: 0x1F, pollingReversed: false },
  0x00A6: { name: 'Viper V2 Pro',        type: 'wireless', txId: 0x1F, pollingReversed: false },
  // DeathAdder V3
  0x0090: { name: 'DeathAdder V3',       type: 'wired',    txId: 0x1F, pollingReversed: false },
  // DeathAdder V3 Pro
  0x0092: { name: 'DeathAdder V3 Pro',   type: 'wireless', txId: 0x1F, pollingReversed: false },
  // DeathAdder V2
  0x007A: { name: 'DeathAdder V2',       type: 'wired',    txId: 0xFF, pollingReversed: false },
  // DeathAdder V2 Pro
  0x007C: { name: 'DeathAdder V2 Pro',   type: 'wireless', txId: 0x3F, pollingReversed: false },
  // Basilisk V3
  0x0099: { name: 'Basilisk V3',         type: 'wired',    txId: 0x1F, pollingReversed: false },
  // Basilisk V3 Pro
  0x008E: { name: 'Basilisk V3 Pro',     type: 'wireless', txId: 0x1F, pollingReversed: false },
  // Basilisk Ultimate
  0x0078: { name: 'Basilisk Ultimate',   type: 'wireless', txId: 0x1F, pollingReversed: false },
  // Naga X
  0x0086: { name: 'Naga X',             type: 'wired',    txId: 0x1F, pollingReversed: false },
};

export const LOGITECH_DEVICES = {
  0xC547: { name: 'Lightspeed Receiver',     type: 'receiver' },
  0xC094: { name: 'PRO X SUPERLIGHT',        type: 'mouse' },
  0xC09B: { name: 'PRO X SUPERLIGHT 2',      type: 'mouse' },
  0x4093: { name: 'PRO X Superlight Wireless', type: 'mouse' },
};

/**
 * Look up a Razer device by PID.
 * Returns device info or a default object for unknown devices.
 */
export function getRazerDevice(pid) {
  return RAZER_DEVICES[pid] || { name: `Unknown (0x${pid.toString(16)})`, type: 'unknown', txId: 0x1F, pollingReversed: false };
}

/**
 * Look up a Logitech device by PID.
 */
export function getLogitechDevice(pid) {
  return LOGITECH_DEVICES[pid] || { name: `Unknown (0x${pid.toString(16)})`, type: 'unknown' };
}
