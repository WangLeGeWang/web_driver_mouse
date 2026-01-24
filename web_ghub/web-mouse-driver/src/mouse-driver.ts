/**
 * 鼠标驱动控制器
 * 统一管理 WebHID 和 WebUSB 协议
 */

import { LogitechHIDPPProtocol } from './protocols/logitech-hidpp';
import { USBMouseProtocol } from './protocols/usb-protocol';
import {
  IMouseProtocol,
  MouseDeviceInfo,
  MouseSettings,
  DPIValue,
  PollingRate,
  DPI_VALUES,
  POLLING_RATES,
  DriverEvent,
  DriverEventType
} from './types/mouse';

export type ProtocolType = 'hid' | 'usb' | 'auto';

type EventCallback = (event: DriverEvent) => void;

export class MouseDriver {
  private protocol: IMouseProtocol | null = null;
  private eventListeners: Map<DriverEventType, EventCallback[]> = new Map();

  constructor() {
    // 初始化事件监听器
    this.eventListeners.set('connected', []);
    this.eventListeners.set('disconnected', []);
    this.eventListeners.set('settings-changed', []);
    this.eventListeners.set('error', []);
  }

  /**
   * 连接鼠标设备
   * @param protocolType 协议类型: 'hid' | 'usb' | 'auto'
   */
  async connect(protocolType: ProtocolType = 'auto'): Promise<boolean> {
    try {
      if (protocolType === 'auto') {
        // 优先尝试 WebHID (Logitech HID++ 协议)
        if ('hid' in navigator) {
          this.protocol = new LogitechHIDPPProtocol();
          if (await this.protocol.connect()) {
            this.emit('connected', { protocol: 'hid' });
            return true;
          }
        }
        // 回退到 WebUSB
        if ('usb' in navigator) {
          this.protocol = new USBMouseProtocol();
          if (await this.protocol.connect()) {
            this.emit('connected', { protocol: 'usb' });
            return true;
          }
        }
        return false;
      }

      // 指定协议类型
      this.protocol = protocolType === 'hid'
        ? new LogitechHIDPPProtocol()
        : new USBMouseProtocol();

      const success = await this.protocol.connect();
      if (success) {
        this.emit('connected', { protocol: protocolType });
      }
      return success;
    } catch (error) {
      this.emit('error', { error });
      return false;
    }
  }

  /**
   * 断开连接
   */
  async disconnect(): Promise<void> {
    if (this.protocol) {
      await this.protocol.disconnect();
      this.emit('disconnected', {});
      this.protocol = null;
    }
  }

  /**
   * 检查连接状态
   */
  isConnected(): boolean {
    return this.protocol?.isConnected() ?? false;
  }

  /**
   * 获取设备信息
   */
  getDeviceInfo(): MouseDeviceInfo | null {
    return this.protocol?.getDeviceInfo() ?? null;
  }

  /**
   * 设置 DPI
   */
  async setDPI(dpi: DPIValue): Promise<boolean> {
    if (!this.protocol) {
      throw new Error('未连接设备');
    }
    const success = await this.protocol.setDPI(dpi);
    if (success) {
      this.emit('settings-changed', { setting: 'dpi', value: dpi });
    }
    return success;
  }

  /**
   * 设置回报率
   */
  async setPollingRate(rate: PollingRate): Promise<boolean> {
    if (!this.protocol) {
      throw new Error('未连接设备');
    }
    const success = await this.protocol.setPollingRate(rate);
    if (success) {
      this.emit('settings-changed', { setting: 'pollingRate', value: rate });
    }
    return success;
  }

  /**
   * 获取当前设置
   */
  async getSettings(): Promise<MouseSettings | null> {
    return this.protocol?.getSettings() ?? null;
  }

  /**
   * 获取支持的 DPI 值列表
   */
  getSupportedDPIValues(): readonly DPIValue[] {
    return DPI_VALUES;
  }

  /**
   * 获取支持的回报率列表
   */
  getSupportedPollingRates(): readonly PollingRate[] {
    return POLLING_RATES;
  }

  /**
   * 检查 API 支持情况
   */
  static checkSupport(): { hid: boolean; usb: boolean } {
    return {
      hid: 'hid' in navigator,
      usb: 'usb' in navigator,
    };
  }

  /**
   * 添加事件监听器
   */
  on(event: DriverEventType, callback: EventCallback): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.push(callback);
    }
  }

  /**
   * 移除事件监听器
   */
  off(event: DriverEventType, callback: EventCallback): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(type: DriverEventType, data: unknown): void {
    const listeners = this.eventListeners.get(type);
    if (listeners) {
      listeners.forEach(callback => callback({ type, data }));
    }
  }
}

// 导出类型和常量
export { DPI_VALUES, POLLING_RATES } from './types/mouse';
export type { DPIValue, PollingRate, MouseDeviceInfo, MouseSettings } from './types/mouse';
