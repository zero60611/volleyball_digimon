# 皮卡丘打排球專案開發與循環工程規範

本專案是一個完美復刻 1997 年經典《皮卡丘打排球》網頁版之 Vue 3 專案。

## 🛠️ 1. 本地開發與驗證指令
- 啟動開發伺服器: `npm run dev`
- 專案打包建置: `npm run build`
- 執行測試套件: `npm run test` (Vitest)
- 程式碼格式化: `npm run lint`

## 🔄 2. 循環工程自修正守則
- 修改 `src/game/physics.js` 或相關計算引擎時，必須隨時執行 `npm run test`。
- 如果測試套件有任何失敗 (Fail)，AI 代理人必須讀取錯誤訊息並持續修正，直至測試 100% 通過。
- 在提交代碼前，必須確保 `npm run build` 能夠無編譯錯誤成功打包。

## 📐 3. 技術規格限制
- 視窗大小固定為 432x304 像素。
- 物理運算必須在 `physics.js` 中嚴格依據逆向工程所得的公式。
- BGM 音訊檔與 Sprite 資源直接引用 `public/resources/assets/...`。

## 📝 4. 跨平台與行動裝置開發經驗教訓 (Lessons Learned)
### ⚠️ iOS/Safari 虛擬按鍵模擬 Bug
*   **問題描述**：在行動裝置（特別是 iOS Safari）上，使用 `new KeyboardEvent('keydown', { code: 'KeyD' })` 模擬按鍵時，瀏覽器會因為底層限制，導致 `event.code` 屬性變為唯讀且為空值或未定義，使物理與輸入引擎無法識別按鍵。
*   **解決方案**：
    1. 必須使用 `Object.defineProperty(event, 'code', { value: keyCode })` 來顯式注入 `code` 屬性，避開唯讀建構子的 Bug。
    2. 同時在 options 中補全 `key`（如 `'d'`）和 `keyCode` / `which`（如 `68`），實現完整的瀏覽器相容性。
    3. 所有觸控按鈕事件皆應加上 `.prevent` 修飾符（如 `@touchstart.prevent`），以防止行動裝置觸控時觸發瀏覽器的預設縮放或滑動手勢。
