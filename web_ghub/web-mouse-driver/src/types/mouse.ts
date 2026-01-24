/**
 * 鼠标驱动类型定义
 */

// 支持的 DPI 值
export const DPI_VALUES = [400, 800, 1600, 3200, 6400] as const;
export type DPIValue = typeof DPI_VALUES[number];

// 支持的回报率 (Hz)
export const POLLING_RATES = [125, 250, 500, 1000] as const;
export type PollingRate = typeof POLLING_RATES[number];

// 鼠标设备信息
export interface MouseDeviceInfo {
  vendorId: number;
  productId: number;
  productName: string;
  serialNumber?: string;
}

// 鼠标当前设置
export interface MouseSettings {
  dpi: DPIValue;
  pollingRate: PollingRate;
  activeProfile: number;
}

// 控制命令类型
export interface ControlCommand {
  reportId: number;
  data: Uint8Array;
}

// 驱动事件
export type DriverEventType = 'connected' | 'disconnected' | 'settings-changed' | 'error';

export interface DriverEvent {
  type: DriverEventType;
  data?: unknown;
}

// 协议接口
export interface IMouseProtocol {
  connect(): Promise<boolean>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  setDPI(dpi: DPIValue): Promise<boolean>;
  setPollingRate(rate: PollingRate): Promise<boolean>;
  getSettings(): Promise<MouseSettings | null>;
  getDeviceInfo(): MouseDeviceInfo | null;
}
