# Web Mouse Driver

基于 WebHID API 的罗技鼠标 Web 驱动程序，无需安装原生驱动即可控制鼠标 DPI 和回报率。

## 功能特性

### DPI 控制
- 支持 5 档 DPI 设置：400, 800, 1600, 3200, 6400
- 支持自定义 DPI 值输入（100-25600 范围）
- 实时切换，即时生效

### 回报率调节
- 支持 4 档回报率：125Hz, 250Hz, 500Hz, 1000Hz
- 通过 HID++ 2.0 协议动态发现 Feature Index
- 兼容 Lightspeed 无线接收器

### 电池状态
- 实时电量百分比显示
- 充电状态检测（放电中/充电中/已充满等）
- 支持 UNIFIED_BATTERY (0x1004) 和 BATTERY_STATUS (0x1000) 协议

### 设备信息
- 自动识别设备型号
- 显示 Vendor ID / Product ID
- 支持多种罗技设备

## 支持的设备

| 设备型号 | Product ID | 状态 |
|---------|-----------|------|
| PRO X Superlight Wireless | 0x4093 | 已测试 |
| G604 Wireless Gaming Mouse | 0x4085 | 支持 |
| G915 TKL | 0x408E | 支持 |
| MX Master 2S | 0x4069 | 支持 |
| MX Vertical | 0x407B | 支持 |
| Lightspeed Receiver | 0xC547 | 已测试 |

## 技术栈

- **语言**: TypeScript 5.3
- **构建工具**: Vite 5.0
- **浏览器 API**: WebHID
- **协议**: Logitech HID++ 2.0

## 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### Docker 部署

```bash
# 使用 Docker Compose
docker-compose up -d

# 或手动构建运行
docker build -t web-mouse-driver .
docker run -d -p 8080:80 web-mouse-driver
```

访问 http://localhost:8080

## 浏览器要求

- **Chrome 89+** 或 **Edge 89+**（需要 WebHID API 支持）
- 必须通过 **HTTPS** 或 **localhost** 访问
- 需要用户授权设备访问权限

## 使用说明

1. **关闭 G Hub**: 使用前请先关闭罗技 G Hub 软件，避免设备冲突
2. **连接设备**: 点击"连接鼠标"按钮，在弹窗中选择你的罗技设备
3. **调整设置**: 连接成功后即可调整 DPI 和回报率
4. **查看电量**: 点击刷新按钮获取当前电池状态

## 项目结构

```
web-mouse-driver/
├── src/
│   ├── main.ts            # 应用入口
│   ├── mouse-driver.ts    # 鼠标驱动核心
│   ├── types/mouse.ts     # TypeScript 类型定义
│   ├── protocols/         # 设备协议实现
│   └── ui/                # UI 组件
├── index.html             # 主页面
├── debug.html             # 调试页面
├── diag.html              # 诊断页面
├── scan.html              # 扫描页面
├── Dockerfile             # Docker 构建文件
├── docker-compose.yml     # Docker Compose 配置
└── package.json           # 项目配置
```

## HID++ 2.0 协议

本项目实现了罗技 HID++ 2.0 协议的以下功能：

| Feature ID | 名称 | 功能 |
|-----------|------|------|
| 0x0000 | IRoot | Feature 发现 |
| 0x1004 | UNIFIED_BATTERY | 统一电池状态 |
| 0x1000 | BATTERY_STATUS | 电池状态（旧设备） |
| 0x2201 | ADJUSTABLE_DPI | DPI 调节 |
| 0x8060 | REPORT_RATE | 回报率设置 |

## 开发注意事项

1. **WebHID 限制**: 仅在安全上下文（HTTPS/localhost）下可用
2. **设备冲突**: 同一时间只能有一个程序访问设备
3. **协议差异**: 不同型号设备的 Feature Index 可能不同，需动态发现

## 参考资料

- [Logitech HID++ 2.0 Specification](https://lekensteyn.nl/files/logitech/)
- [Solaar - Linux Device Manager](https://github.com/pwr-Solaar/Solaar)
- [WebHID API](https://developer.mozilla.org/en-US/docs/Web/API/WebHID_API)

## License

MIT License
