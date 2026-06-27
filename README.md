# Terriermon Volleyball (大耳獸打排球) - Vue 3 完美復刻版

本專案是一個基於 **Vue 3** 與 **PixiJS** 開發的網頁遊戲，完美復刻了 1997 年經典的 Windows 遊戲《皮卡丘打排球》（対戦ぴかちゅ～ ﾋﾞｰﾁﾊﾞﾚｰ編）。
在此版本中，遊戲中的皮卡丘角色已被替換為經典的數碼寶貝角色——**大耳獸 (Terriermon)**。

---

## 🎮 遊戲特點
*   **完美復刻物理引擎**：核心物理碰撞常數與原版 1997 年二進位機器碼 `00403dd0` 逆向工程結果 100% 一致。
*   **經典電腦 AI**：電腦對手使用與原版相同的行為決策樹，保留原本的操作手感。
*   **現代化前端架構**：使用 Vite 構建，以 Vue 3 Composition API 管理遊戲設定（音量、速度、得分合約、像素化渲染等）與視窗響應式縮放。
*   **遊戲模式**：支援單人模式（玩家 vs 電腦）與本機雙人模式（同鍵盤對戰）。

---

## ⌨️ 遊戲操作說明

*   **左側玩家 (Player 1)**：
    *   `D` 鍵：向左移動
    *   `G` 鍵：向右移動
    *   `R` 鍵：跳躍
    *   `Z` 鍵：擊球/扣殺/飛撲
*   **右側玩家 (Player 2 / 電腦 AI)**：
    *   `←` 鍵：向左移動
    *   `→` 鍵：向右移動
    *   `↑` 鍵：跳躍
    *   `Enter` 鍵：擊球/扣殺/飛撲
*   **全域控制**：
    *   `P` 鍵：暫停 / 繼續遊戲

---

## 🚀 本地開發與運行步驟

### 1. 安裝依賴項目
在專案根目錄下執行：
```bash
npm install
```

### 2. 啟動開發伺服器
```bash
npm run dev
```
啟動後在瀏覽器開啟 `http://localhost:5173/` 即可開始遊戲。

### 3. 專案打包建置 (Production Build)
```bash
npm run build
```
編譯後的靜態檔案將輸出至 `dist/` 資料夾下，可直接部署於 GitHub Pages 或任何靜態網頁伺服器。

---

## ⚠️ 版權與免責聲明 (Copyright Disclaimer)

### 中文聲明：
*   **非商業用途**：本專案為個人學習前端技術、遊戲物理引擎以及 AI 代理人開發的開源教育性質專案，**絕對不包含任何商業盈利、廣告、收費或贊助行為**。
*   **版權歸屬**：
    1.  本專案中使用的角色「大耳獸 (Terriermon)」之美術與角色形象版權，完全屬於 **萬代南夢宮 (Bandai Namco)** 所有。
    2.  本專案復刻之原始遊戲《皮卡丘打排球》版權，屬於原創作者 **(C) SACHI SOFT / SAWAYAKAN Programmers** 與 **Satoshi Takenouchi (1997)** 所有。
*   **配合下架**：本專案無意侵犯任何版權。若版權持有人或相關機構認為此專案有侵權疑慮，請立即聯繫本儲存庫擁有者，我們將在收到通知後第一時間將本專案下架並配合刪除所有相關資源。

### English Disclaimer:
*   **Non-commercial Use**: This is an open-source, non-profit educational study project created solely for the purpose of learning frontend development and game physics. **No commercialization, advertisements, or monetization of any form is involved.**
*   **IP Rights**: 
    1.  The character "Terriermon" and all related designs are registered trademarks and copyrights of **Bandai Namco**.
    2.  The original game "Pikachu Volleyball" is copyrighted by **(C) SACHI SOFT / SAWAYAKAN Programmers** and **Satoshi Takenouchi (1997)**.
*   **Takedown Policy**: This project does not intend to violate any intellectual property rights. If you are the copyright holder and wish to request a removal, please contact the repository owner, and we will take down the project and delete all related assets immediately.
