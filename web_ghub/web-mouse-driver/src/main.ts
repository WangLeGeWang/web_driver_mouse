import './ui/styles.css';
import { MouseDriverUI } from './ui/controls';

// 初始化 UI
document.addEventListener('DOMContentLoaded', () => {
  const ui = new MouseDriverUI();
  ui.init();
});
