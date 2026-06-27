# 📝 歷史開發問題與經驗教訓紀錄庫 (LESSONS.md)

本文件專門紀錄《大耳獸打排球》開發過程中遇到的各類技術問題、跨平台相容性 Bug、以及對應的解決方案與驗證步驟。未來進行相關開發或重構時，請先檢索此文件，避免重複犯錯。

---

## 🏷️ [ISSUE-001] iOS/Safari 虛擬按鍵模擬失效 Bug
*   **分類 (Category)**：跨平台相容性 (Cross-Platform) / 瀏覽器安全 (Browser Security)
*   **現象描述 (Symptoms)**：
    網頁在行動裝置（特別是 iOS Safari）或特定手機 Chrome 上開啟時，雖然選單可以正常選取，但進入打排球畫面後，點擊虛擬手把的 `◀` `▶` `▲` 卻無法控制大耳獸移動與跳躍。
*   **根本原因 (Root Cause)**：
    iOS/Safari 底層的安全規範限制了以 `new KeyboardEvent(..., { code: 'KeyD' })` 建構物件時的寫入行為。這會導致事件傳遞至 `keyboard.js` 時，`event.code` 屬性變為唯讀且空值或 `undefined`，進而無法觸發物理引擎的鍵盤監聽。
*   **解決方案 (Solution)**：
    1. 不依賴 constructor 傳遞 `code`，而是使用 `Object.defineProperty(event, 'code', { value: targetKeyCode })` 來強制注入 `code` 屬性。
    2. 同時在構造參數中補全 `key`（如 `'d'`）與 `keyCode` / `which`（如 `68`），確保跨平台瀏覽器均能順利解讀。
    3. 對所有觸控按鈕事件使用 `.prevent`（如 `@touchstart.prevent`）防止瀏覽器雙擊縮放及手勢干擾多點觸控。
*   **✅ 驗證清單 (Verification Checklist)**：
    - [ ] 1. 使用電腦 Chrome 開啟 F12 開發者工具，開啟行動端模擬器（觸控模式）。
    - [ ] 2. 按下手把上的左/右鍵，觀察主控台 (Console) 輸出 `Left(D): true` 與 `Right(G): true`。
    - [ ] 3. 使用實體 iOS / Android 手機瀏覽網頁，確認手把可流暢控制角色位移與跳躍。

---

## 🏷️ [ISSUE-002] 選單確認鍵與玩家角色控制權對應 Bug
*   **分類 (Category)**：遊戲輸入邏輯 (Input Logic) / 系統整合 (System Integration)
*   **現象描述 (Symptoms)**：
    進入遊戲後，點選虛擬手把的所有方向鍵與跳躍鍵，左側的大耳獸都毫無反應（但電腦 AI 大耳獸會自己動）。
*   **根本原因 (Root Cause)**：
    1. 在原版遊戲選單中，按下 `Enter` 鍵代表由 **Player 2 (右側角色)** 作為人類玩家開局，電腦控制 Player 1 (left)；而按下 `Z` 鍵則相反。
    2. 我們的虛擬手把「確認鍵」發送的是 `Enter`，導致遊戲開局後，右側角色變為玩家，左側角色變為電腦 AI。
    3. 同時，虛擬手把發送的方向鍵訊號為 Player 1 的鍵位 (`KeyD`/`KeyG`/`KeyR`)，此時 P1 正由電腦接管，而由人控制的 P2 卻在等待方向鍵 (`ArrowLeft`/`ArrowRight`/`ArrowUp`)，導致兩者都無法操作。
*   **解決方案 (Solution)**：
    1. 在發送按鍵的 `triggerKey` 函數中，加入**動態角色偵測**：
       ```javascript
       if (pikaVolley.physics.player2.isComputer === false) { // Player 2 是人類
         // 將 KeyD 轉為 ArrowLeft, KeyG 轉為 ArrowRight, KeyR 轉為 ArrowUp...
       }
       ```
    2. 當 Player 2 是人類時，自動將手把的方向鍵與擊球鍵轉譯為 P2 對應的方向鍵與 Enter 發送。這確保了不論左側或右側玩家開局，手把都能完美適配。
*   **✅ 驗證清單 (Verification Checklist)**：
    - [ ] 1. 在選單畫面點擊 `Z` 鍵（擊球）確認，進入遊戲後，確認手把可控制 **左側** 大耳獸。
    - [ ] 2. 在選單畫面點擊 `⏎` 鍵（確認）確認，進入遊戲後，確認手把可控制 **右側** 大耳獸。
    - [ ] 3. 檢查主控台輸出的除錯日誌，確認 `isComputer` 標記與按下的按鍵狀態正確對應。
