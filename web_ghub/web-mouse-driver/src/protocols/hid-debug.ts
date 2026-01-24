/**
 * HID 调试协议 - 用于抓包分析
 */

export interface HIDPacket {
  timestamp: number;
  direction: 'in' | 'out';
  reportId: number;
  data: Uint8Array;
  dataHex: string;
}

export class HIDDebugger {
  private device: HIDDevice | null = null;
  private packets: HIDPacket[] = [];
  private onPacketCallback: ((packet: HIDPacket) => void) | null = null;

  // 设备过滤器 - Logitech PRO X SUPERLIGHT
  private readonly filters: HIDDeviceFilter[] = [
    { vendorId: 0x046D, productId: 0xC232 },
    { vendorId: 0x046D, productId: 0xC094 },
    { vendorId: 0x046D, productId: 0xC09B },
    { vendorId: 0x046D, productId: 0xC54D },
    { vendorId: 0x046D },
  ];

  async connect(): Promise<{ success: boolean; device?: HIDDevice; error?: string }> {
    try {
      const devices = await navigator.hid.requestDevice({ filters: this.filters });

      if (devices.length === 0) {
        return { success: false, error: '未选择设备' };
      }

      this.device = devices[0];

      if (!this.device.opened) {
        await this.device.open();
      }

      // 监听输入报告
      this.device.addEventListener('inputreport', this.handleInputReport.bind(this));

      console.log('设备已连接:', {
        productName: this.device.productName,
        vendorId: `0x${this.device.vendorId.toString(16).toUpperCase()}`,
        productId: `0x${this.device.productId.toString(16).toUpperCase()}`,
        collections: this.device.collections
      });

      return { success: true, device: this.device };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  async disconnect(): Promise<void> {
    if (this.device?.opened) {
      await this.device.close();
    }
    this.device = null;
  }

  getDevice(): HIDDevice | null {
    return this.device;
  }

  getCollections(): HIDCollectionInfo[] {
    return this.device?.collections || [];
  }

  onPacket(callback: (packet: HIDPacket) => void): void {
    this.onPacketCallback = callback;
  }

  getPackets(): HIDPacket[] {
    return [...this.packets];
  }

  clearPackets(): void {
    this.packets = [];
  }

  private handleInputReport(event: HIDInputReportEvent): void {
    const data = new Uint8Array(event.data.buffer);
    const packet: HIDPacket = {
      timestamp: Date.now(),
      direction: 'in',
      reportId: event.reportId,
      data: data,
      dataHex: this.toHex(data)
    };

    this.packets.push(packet);
    this.onPacketCallback?.(packet);

    console.log(`[IN] Report ${event.reportId}:`, packet.dataHex);
  }

  // 发送 Feature Report
  async sendFeatureReport(reportId: number, data: number[]): Promise<HIDPacket | null> {
    if (!this.device?.opened) {
      throw new Error('设备未连接');
    }

    const uint8Data = new Uint8Array(data);

    const packet: HIDPacket = {
      timestamp: Date.now(),
      direction: 'out',
      reportId: reportId,
      data: uint8Data,
      dataHex: this.toHex(uint8Data)
    };

    try {
      await this.device.sendFeatureReport(reportId, uint8Data);
      this.packets.push(packet);
      this.onPacketCallback?.(packet);
      console.log(`[OUT] Feature Report ${reportId}:`, packet.dataHex);
      return packet;
    } catch (error) {
      console.error(`发送失败:`, error);
      throw error;
    }
  }

  // 读取 Feature Report
  async receiveFeatureReport(reportId: number): Promise<HIDPacket | null> {
    if (!this.device?.opened) {
      throw new Error('设备未连接');
    }

    try {
      const report = await this.device.receiveFeatureReport(reportId);
      const data = new Uint8Array(report.buffer);

      const packet: HIDPacket = {
        timestamp: Date.now(),
        direction: 'in',
        reportId: reportId,
        data: data,
        dataHex: this.toHex(data)
      };

      this.packets.push(packet);
      this.onPacketCallback?.(packet);
      console.log(`[IN] Feature Report ${reportId}:`, packet.dataHex);
      return packet;
    } catch (error) {
      console.error(`读取 Report ${reportId} 失败:`, error);
      return null;
    }
  }

  // 发送 Output Report
  async sendOutputReport(reportId: number, data: number[]): Promise<HIDPacket | null> {
    if (!this.device?.opened) {
      throw new Error('设备未连接');
    }

    const uint8Data = new Uint8Array(data);

    const packet: HIDPacket = {
      timestamp: Date.now(),
      direction: 'out',
      reportId: reportId,
      data: uint8Data,
      dataHex: this.toHex(uint8Data)
    };

    try {
      await this.device.sendReport(reportId, uint8Data);
      this.packets.push(packet);
      this.onPacketCallback?.(packet);
      console.log(`[OUT] Output Report ${reportId}:`, packet.dataHex);
      return packet;
    } catch (error) {
      console.error(`发送失败:`, error);
      throw error;
    }
  }

  // 扫描可用的 Report IDs
  async scanReportIds(): Promise<{ reportId: number; data: string }[]> {
    const results: { reportId: number; data: string }[] = [];

    for (let reportId = 0; reportId <= 255; reportId++) {
      try {
        const packet = await this.receiveFeatureReport(reportId);
        if (packet) {
          results.push({ reportId, data: packet.dataHex });
        }
      } catch {
        // 跳过不支持的 Report ID
      }
    }

    return results;
  }

  private toHex(data: Uint8Array): string {
    return Array.from(data)
      .map(b => b.toString(16).padStart(2, '0').toUpperCase())
      .join(' ');
  }

  // 导出抓包数据
  exportPackets(): string {
    return JSON.stringify(this.packets, (_, v) => {
      if (v instanceof Uint8Array) {
        return Array.from(v);
      }
      return v;
    }, 2);
  }
}
