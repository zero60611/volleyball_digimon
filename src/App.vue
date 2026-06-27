<script setup>
import PikaGame from './components/PikaGame.vue'
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <h1 class="pixel-title">Terriermon Volleyball</h1>
      <p class="subtitle">大耳獸打排球 JS 完美復刻 Vue 版</p>
    </header>

    <main class="game-area">
      <PikaGame />
    </main>

    <footer class="app-footer">
      <p>© 1997 SACHI SOFT / SAWAYAKAN Programmers. Reimplemented in JS by gorisanson. Refactored to Vue 3 by Antigravity Coder.</p>
    </footer>
  </div>
</template>

<style>
/* Global resets and body styling */
body {
  margin: 0;
  padding: 0;
  font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background: radial-gradient(circle at center, #1e293b 0%, #0f172a 100%);
  color: #fff;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

#app {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.app-header {
  text-align: center;
  margin-bottom: 24px;
}

.pixel-title {
  font-size: 3rem;
  margin: 0;
  color: #facc15;
  text-shadow: 0 4px 0px #1e3a8a, 0 8px 16px rgba(0,0,0,0.5);
  font-family: 'Outfit', sans-serif;
  font-weight: 900;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.subtitle {
  font-size: 1.1rem;
  color: #94a3b8;
  margin: 8px 0 0 0;
}

.game-area {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 30px;
}

.app-footer {
  text-align: center;
  font-size: 0.8rem;
  color: #64748b;
  max-width: 600px;
  line-height: 1.4;
}
</style>
