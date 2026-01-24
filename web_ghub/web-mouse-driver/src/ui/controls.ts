/**
 * UI 控制组件
 */

import { MouseDriver, DPIValue, PollingRate, DPI_VALUES, POLLING_RATES } from '../mouse-driver';

export class MouseDriverUI {
  private driver: MouseDriver;
  private consoleEl: HTMLElement | null = null;

  constructor() {
    this.driver = new MouseDriver();
    this.setupEventListeners();
  }

  init(): void {
    this.renderAPISupport();
    this.renderControls();
    this.bindEvents();
  }

  private setupEventListeners(): void {
    this.driver.on('connected', (event) => {
      this.log(`设备已连接 (${(event.data as { protocol: string }).protocol})`, 'success');
      this.updateConnectionStatus(true);
      this.updateDeviceInfo();
    });

    this.driver.on('disconnected', () => {
      this.log('设备已断开', 'error');
      this.updateConnectionStatus(false);
    });

    this.driver.on('settings-changed', (event) => {
      const data = event.data as { setting: string; value: number };
      this.log(`设置已更新: ${data.setting} = ${data.value}`, 'success');
    });

    this.driver.on('error', (event) => {
      const data = event.data as { error: Error };
      this.log(`错误: ${data.error.message}`, 'error');
    });
  }

  private renderAPISupport(): void {
    const support = MouseDriver.checkSupport();
    const container = document.getElementById('api-support');
    if (!container) return;

    container.innerHTML = `
      <span class="api-badge ${support.hid ? 'supported' : 'unsupported'}">
        WebHID: ${support.hid ? '✓ 支持' : '✗ 不支持'}
      </span>
      <span class="api-badge ${support.usb ? 'supported' : 'unsupported'}">
        WebUSB: ${support.usb ? '✓ 支持' : '✗ 不支持'}
      </span>
    `;
  }

  private renderControls(): void {
    // 渲染 DPI 选项
    const dpiGroup = document.getElementById('dpi-options');
    if (dpiGroup) {
      dpiGroup.innerHTML = DPI_VALUES.map(dpi => `
        <div class="radio-btn">
          <input type="radio" name="dpi" id="dpi-${dpi}" value="${dpi}">
          <label for="dpi-${dpi}">${dpi}</label>
        </div>
      `).join('');
    }

    // 渲染回报率选项
    const pollingGroup = document.getElementById('polling-options');
    if (pollingGroup) {
      pollingGroup.innerHTML = POLLING_RATES.map(rate => `
        <div class="radio-btn">
          <input type="radio" name="polling" id="polling-${rate}" value="${rate}">
          <label for="polling-${rate}">${rate} Hz</label>
        </div>
      `).join('');
    }

    this.consoleEl = document.getElementById('console');
  }

  private bindEvents(): void {
    // 连接按钮 - HID
    document.getElementById('connect-hid')?.addEventListener('click', async () => {
      this.log('正在通过 WebHID 连接...');
      try {
        await this.driver.connect('hid');
      } catch (e) {
        this.log(`连接失败: ${e}`, 'error');
      }
    });

    // 连接按钮 - USB
    document.getElementById('connect-usb')?.addEventListener('click', async () => {
      this.log('正在通过 WebUSB 连接...');
      try {
        await this.driver.connect('usb');
      } catch (e) {
        this.log(`连接失败: ${e}`, 'error');
      }
    });

    // 断开连接
    document.getElementById('disconnect')?.addEventListener('click', async () => {
      await this.driver.disconnect();
    });

    // DPI 设置 - 使用事件委托
    document.getElementById('dpi-options')?.addEventListener('change', async (e) => {
      const target = e.target as HTMLInputElement;
      if (target.name === 'dpi') {
        const dpi = parseInt(target.value) as DPIValue;
        this.log(`正在设置 DPI: ${dpi}...`);
        try {
          await this.driver.setDPI(dpi);
        } catch (err) {
          this.log(`设置失败: ${err}`, 'error');
        }
      }
    });

    // 回报率设置 - 使用事件委托
    document.getElementById('polling-options')?.addEventListener('change', async (e) => {
      const target = e.target as HTMLInputElement;
      if (target.name === 'polling') {
        const rate = parseInt(target.value) as PollingRate;
        this.log(`正在设置回报率: ${rate}Hz...`);
        try {
          await this.driver.setPollingRate(rate);
        } catch (err) {
          this.log(`设置失败: ${err}`, 'error');
        }
      }
    });
  }

  private updateConnectionStatus(connected: boolean): void {
    const indicator = document.querySelector('.status-indicator');
    const statusText = document.getElementById('status-text');
    const disconnectBtn = document.getElementById('disconnect') as HTMLButtonElement;
    const settingsCard = document.getElementById('settings-card');

    if (indicator) {
      indicator.classList.toggle('connected', connected);
    }
    if (statusText) {
      statusText.textContent = connected ? '已连接' : '未连接';
    }
    if (disconnectBtn) {
      disconnectBtn.disabled = !connected;
    }
    if (settingsCard) {
      settingsCard.style.opacity = connected ? '1' : '0.5';
      settingsCard.style.pointerEvents = connected ? 'auto' : 'none';
    }
  }

  private updateDeviceInfo(): void {
    const info = this.driver.getDeviceInfo();
    if (!info) return;

    const nameEl = document.getElementById('device-name');
    const vidEl = document.getElementById('device-vid');
    const pidEl = document.getElementById('device-pid');

    if (nameEl) nameEl.textContent = info.productName;
    if (vidEl) vidEl.textContent = `0x${info.vendorId.toString(16).toUpperCase().padStart(4, '0')}`;
    if (pidEl) pidEl.textContent = `0x${info.productId.toString(16).toUpperCase().padStart(4, '0')}`;
  }

  private log(message: string, type: 'info' | 'success' | 'error' = 'info'): void {
    if (!this.consoleEl) return;

    const time = new Date().toLocaleTimeString();
    const line = document.createElement('div');
    line.className = `console-line ${type}`;
    line.innerHTML = `<span class="time">[${time}]</span>${message}`;

    this.consoleEl.appendChild(line);
    this.consoleEl.scrollTop = this.consoleEl.scrollHeight;
  }
}
