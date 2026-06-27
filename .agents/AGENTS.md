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
