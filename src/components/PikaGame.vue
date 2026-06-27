<template>
  <div class="game-wrapper">
    <!-- Header/Menu Bar -->
    <div class="menu-bar">
      <!-- Game Menu -->
      <div class="menu-dropdown" v-click-outside="() => closeDropdown('game')">
        <button class="menu-btn" @click="toggleDropdown('game')">遊戲 (G)</button>
        <div v-if="activeDropdown === 'game'" class="dropdown-content">
          <button @click="restartGame">重新開始 (R)</button>
          <button @click="togglePause">{{ isPaused ? '繼續 (P)' : '暫停 (P)' }}</button>
          <hr class="menu-divider" />
          <button @click="togglePracticeMode">
            練習模式: <span class="badge" :class="{ 'badge-active': isPracticeMode }">{{ isPracticeMode ? '開啟' : '關閉' }}</span>
          </button>
        </div>
      </div>

      <!-- Options Menu -->
      <div class="menu-dropdown" v-click-outside="() => closeDropdown('options')">
        <button class="menu-btn" @click="toggleDropdown('options')">選項 (O)</button>
        <div v-if="activeDropdown === 'options'" class="dropdown-content">
          <!-- Game Speed -->
          <div class="submenu-container">
            <span class="submenu-title">遊戲速度</span>
            <div class="submenu-options">
              <button :class="{ active: speed === 'slow' }" @click="setSpeed('slow')">慢速</button>
              <button :class="{ active: speed === 'medium' }" @click="setSpeed('medium')">一般</button>
              <button :class="{ active: speed === 'fast' }" @click="setSpeed('fast')">快速</button>
            </div>
          </div>
          <hr class="menu-divider" />
          <!-- Winning Score -->
          <div class="submenu-container">
            <span class="submenu-title">目標分數</span>
            <div class="submenu-options">
              <button :class="{ active: winningScore === 5 }" @click="setWinningScore(5)">5 分</button>
              <button :class="{ active: winningScore === 10 }" @click="setWinningScore(10)">10 分</button>
              <button :class="{ active: winningScore === 15 }" @click="setWinningScore(15)">15 分</button>
            </div>
          </div>
          <hr class="menu-divider" />
          <!-- Audio BGM -->
          <div class="submenu-container">
            <span class="submenu-title">背景音樂 (BGM)</span>
            <div class="submenu-options">
              <button :class="{ active: bgmVolume }" @click="setBGM(true)">開啟</button>
              <button :class="{ active: !bgmVolume }" @click="setBGM(false)">關閉</button>
            </div>
          </div>
          <hr class="menu-divider" />
          <!-- Audio SFX -->
          <div class="submenu-container">
            <span class="submenu-title">音效 (SFX)</span>
            <div class="submenu-options">
              <button :class="{ active: sfxMode === 'stereo' }" @click="setSFX('stereo')">雙聲道</button>
              <button :class="{ active: sfxMode === 'mono' }" @click="setSFX('mono')">單聲道</button>
              <button :class="{ active: sfxMode === 'off' }" @click="setSFX('off')">關閉</button>
            </div>
          </div>
          <hr class="menu-divider" />
          <!-- Graphics Mode -->
          <div class="submenu-container">
            <span class="submenu-title">畫面柔和</span>
            <div class="submenu-options">
              <button :class="{ active: isSoftGraphic }" @click="setGraphic(true)">柔和</button>
              <button :class="{ active: !isSoftGraphic }" @click="setGraphic(false)">像素化</button>
            </div>
          </div>
        </div>
      </div>

      <!-- About / Keybindings -->
      <button class="menu-btn" @click="showAbout = true">操作說明 / 關於 (A)</button>

      <!-- Virtual Controller Toggle -->
      <button 
        class="menu-btn controller-toggle" 
        :class="{ 'menu-btn-active': showVirtualController }"
        @click="showVirtualController = !showVirtualController"
      >
        🎮 螢幕手把: {{ showVirtualController ? '顯示' : '隱藏' }}
      </button>
    </div>

    <!-- Game Canvas Section -->
    <div class="canvas-outer-container">
      <div v-if="loading" class="loading-overlay">
        <div class="loader-content">
          <div class="terriermon-running">⚡</div>
          <h3>大耳獸打排球 載入中...</h3>
          <div class="progress-bar-container">
            <div class="progress-bar" :style="{ width: loadProgress + '%' }"></div>
          </div>
          <p>{{ loadProgress }}%</p>
        </div>
      </div>

      <div 
        ref="canvasContainer" 
        id="game-canvas-container"
        :class="{ 'graphic-soft': isSoftGraphic }"
      >
        <!-- PixiJS canvas will mount here -->
      </div>
    </div>

    <!-- Virtual Gamepad Overlay -->
    <div v-if="showVirtualController" class="virtual-controller">
      <!-- D-Pad -->
      <div class="dpad-container">
        <div></div>
        <button 
          class="control-btn dpad-btn up"
          @touchstart.prevent="triggerKey('KeyR', true)"
          @touchend.prevent="triggerKey('KeyR', false)"
          @touchcancel.prevent="triggerKey('KeyR', false)"
          @mousedown.prevent="triggerKey('KeyR', true)"
          @mouseup.prevent="triggerKey('KeyR', false)"
          @mouseleave.prevent="triggerKey('KeyR', false)"
        >▲</button>
        <div></div>
        
        <button 
          class="control-btn dpad-btn left"
          @touchstart.prevent="triggerKey('KeyD', true)"
          @touchend.prevent="triggerKey('KeyD', false)"
          @touchcancel.prevent="triggerKey('KeyD', false)"
          @mousedown.prevent="triggerKey('KeyD', true)"
          @mouseup.prevent="triggerKey('KeyD', false)"
          @mouseleave.prevent="triggerKey('KeyD', false)"
        >◀</button>
        <div class="dpad-center"></div>
        <button 
          class="control-btn dpad-btn right"
          @touchstart.prevent="triggerKey('KeyG', true)"
          @touchend.prevent="triggerKey('KeyG', false)"
          @touchcancel.prevent="triggerKey('KeyG', false)"
          @mousedown.prevent="triggerKey('KeyG', true)"
          @mouseup.prevent="triggerKey('KeyG', false)"
          @mouseleave.prevent="triggerKey('KeyG', false)"
        >▶</button>
        
        <div></div>
        <button 
          class="control-btn dpad-btn down"
          @touchstart.prevent="triggerKey('KeyV', true)"
          @touchend.prevent="triggerKey('KeyV', false)"
          @touchcancel.prevent="triggerKey('KeyV', false)"
          @mousedown.prevent="triggerKey('KeyV', true)"
          @mouseup.prevent="triggerKey('KeyV', false)"
          @mouseleave.prevent="triggerKey('KeyV', false)"
        >▼</button>
        <div></div>
      </div>

      <!-- Action Buttons -->
      <div class="action-container">
        <button 
          class="control-btn action-btn z-btn"
          @touchstart.prevent="triggerKey('KeyZ', true)"
          @touchend.prevent="triggerKey('KeyZ', false)"
          @touchcancel.prevent="triggerKey('KeyZ', false)"
          @mousedown.prevent="triggerKey('KeyZ', true)"
          @mouseup.prevent="triggerKey('KeyZ', false)"
          @mouseleave.prevent="triggerKey('KeyZ', false)"
        >
          <span class="btn-text">Z</span>
          <span class="btn-sub">擊球</span>
        </button>
        <button 
          class="control-btn action-btn enter-btn"
          @touchstart.prevent="triggerKey('Enter', true)"
          @touchend.prevent="triggerKey('Enter', false)"
          @touchcancel.prevent="triggerKey('Enter', false)"
          @mousedown.prevent="triggerKey('Enter', true)"
          @mouseup.prevent="triggerKey('Enter', false)"
          @mouseleave.prevent="triggerKey('Enter', false)"
        >
          <span class="btn-text">⏎</span>
          <span class="btn-sub">確認</span>
        </button>
      </div>
    </div>

    <!-- About Modal Dialog -->
    <div v-if="showAbout" class="modal-overlay" @click.self="showAbout = false">
      <div class="modal-card">
        <h2>🎮 遊戲操作說明</h2>
        <div class="controls-grid">
          <div class="control-column">
            <h3>Player 1 (左側大耳獸)</h3>
            <ul>
              <li><kbd>D</kbd> : 向左移動</li>
              <li><kbd>G</kbd> : 向右移動</li>
              <li><kbd>R</kbd> : 跳躍</li>
              <li><kbd>Z</kbd> : 扣殺 / 飛撲</li>
            </ul>
          </div>
          <div class="control-column">
            <h3>Player 2 (右側大耳獸 / AI)</h3>
            <ul>
              <li><kbd>←</kbd> : 向左移動</li>
              <li><kbd>→</kbd> : 向右移動</li>
              <li><kbd>↑</kbd> : 跳躍</li>
              <li><kbd>Enter</kbd> : 扣殺 / 飛撲</li>
            </ul>
          </div>
        </div>
        <hr class="menu-divider" />
        <p class="about-desc">
          本作品 100% 復刻 1997 年經典的《皮卡丘打排球》Windows 遊戲，其物理碰撞常數與電腦 AI 行為皆採用原版機器碼逆向工程重製而成（本版本已將皮卡丘替換為大耳獸），保證原汁原味的體驗。
        </p>
        <button class="close-btn" @click="showAbout = false">開始遊戲</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

// PixiJS imports
import { settings } from '@pixi/settings';
import { SCALE_MODES } from '@pixi/constants';
import { Renderer, BatchRenderer, autoDetectRenderer } from '@pixi/core';
import { Prepare } from '@pixi/prepare';
import { Container } from '@pixi/display';
import { Loader } from '@pixi/loaders';
import { SpritesheetLoader } from '@pixi/spritesheet';
import { Ticker } from '@pixi/ticker';
import { CanvasRenderer } from '@pixi/canvas-renderer';
import { CanvasSpriteRenderer } from '@pixi/canvas-sprite';
import { CanvasPrepare } from '@pixi/canvas-prepare';
import '@pixi/canvas-display';

// Game controller & assets imports
import { PikachuVolleyball } from '../game/pikavolley.js';
import { ASSETS_PATH } from '../game/assets_path.js';

// Setup PIXI plugins (Register once on load)
try {
  Renderer.registerPlugin('prepare', Prepare);
  Renderer.registerPlugin('batch', BatchRenderer);
  CanvasRenderer.registerPlugin('prepare', CanvasPrepare);
  CanvasRenderer.registerPlugin('sprite', CanvasSpriteRenderer);
  Loader.registerPlugin(SpritesheetLoader);
} catch (e) {
  // Avoid errors if hot reloads attempt to register multiple times
}

// Refs
const canvasContainer = ref(null);
const loading = ref(true);
const loadProgress = ref(0);
const showAbout = ref(true);

// Menu dropdowns state
const activeDropdown = ref(null);

// Game options state
const isPaused = ref(false);
const isPracticeMode = ref(false);
const speed = ref('medium'); // slow, medium, fast
const winningScore = ref(15);
const bgmVolume = ref(true);
const sfxMode = ref('stereo'); // stereo, mono, off
const isSoftGraphic = ref(false);
const isMobile = ref(false);
const showVirtualController = ref(false);

const triggerKey = (keyCode, isDown) => {
  const eventType = isDown ? 'keydown' : 'keyup';
  
  // Cross-browser compatibility map for key and keyCode values
  const keyMap = {
    'KeyD': { key: 'd', keyCode: 68 },
    'KeyG': { key: 'g', keyCode: 71 },
    'KeyR': { key: 'r', keyCode: 82 },
    'KeyV': { key: 'v', keyCode: 86 },
    'KeyZ': { key: 'z', keyCode: 90 },
    'Enter': { key: 'Enter', keyCode: 13 }
  };
  
  const mapped = keyMap[keyCode] || { key: '', keyCode: 0 };
  
  // Standard constructor
  const event = new KeyboardEvent(eventType, {
    key: mapped.key,
    keyCode: mapped.keyCode,
    which: mapped.keyCode,
    bubbles: true,
    cancelable: true
  });
  
  // Explicitly define the 'code' property to bypass iOS Safari read-only constructor bugs
  Object.defineProperty(event, 'code', {
    value: keyCode,
    writable: false,
    configurable: true,
    enumerable: true
  });
  
  window.dispatchEvent(event);
};

// PIXI and PikachuVolleyball instance references
let pixiRenderer = null;
let stage = null;
let ticker = null;
let loader = null;
let pikaVolley = null;

// Click outside directive helper
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent);
  }
};

// Dropdown Handlers
const toggleDropdown = (menu) => {
  activeDropdown.value = activeDropdown.value === menu ? null : menu;
};

const closeDropdown = (menu) => {
  if (activeDropdown.value === menu) {
    activeDropdown.value = null;
  }
};

// Game Action Methods
const restartGame = () => {
  if (pikaVolley) {
    if (isPaused.value) {
      togglePause();
    }
    pikaVolley.restart();
  }
  activeDropdown.value = null;
};

const togglePause = () => {
  if (pikaVolley) {
    pikaVolley.paused = !pikaVolley.paused;
    isPaused.value = pikaVolley.paused;
  }
  activeDropdown.value = null;
};

const togglePracticeMode = () => {
  if (pikaVolley) {
    pikaVolley.isPracticeMode = !pikaVolley.isPracticeMode;
    isPracticeMode.value = pikaVolley.isPracticeMode;
  }
  activeDropdown.value = null;
};

const setSpeed = (val) => {
  speed.value = val;
  if (pikaVolley && ticker) {
    if (val === 'slow') {
      pikaVolley.normalFPS = 20;
    } else if (val === 'medium') {
      pikaVolley.normalFPS = 25;
    } else if (val === 'fast') {
      pikaVolley.normalFPS = 30;
    }
    ticker.maxFPS = pikaVolley.normalFPS;
  }
};

const setWinningScore = (score) => {
  winningScore.value = score;
  if (pikaVolley) {
    pikaVolley.winningScore = score;
  }
};

const setBGM = (on) => {
  bgmVolume.value = on;
  if (pikaVolley) {
    pikaVolley.audio.turnBGMVolume(on);
  }
};

const setSFX = (mode) => {
  sfxMode.value = mode;
  if (pikaVolley) {
    if (mode === 'stereo') {
      pikaVolley.audio.turnSFXVolume(true);
      pikaVolley.isStereoSound = true;
    } else if (mode === 'mono') {
      pikaVolley.audio.turnSFXVolume(true);
      pikaVolley.isStereoSound = false;
    } else if (mode === 'off') {
      pikaVolley.audio.turnSFXVolume(false);
    }
  }
};

const setGraphic = (soft) => {
  isSoftGraphic.value = soft;
};

// Lifecycle Hooks
onMounted(() => {
  isMobile.value = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  if (isMobile.value) {
    showVirtualController.value = true;
  }
  
  // Global key listener for Esc (toggle menu bar) and P (toggle pause)
  window.addEventListener('keydown', handleGlobalKeydown);

  // Initialize Pixi settings
  settings.RESOLUTION = 2;
  settings.SCALE_MODE = SCALE_MODES.NEAREST;
  settings.ROUND_PIXELS = true;

  // 1. Create auto renderer
  pixiRenderer = autoDetectRenderer({
    width: 432,
    height: 304,
    antialias: false,
    backgroundColor: 0x000000,
    backgroundAlpha: 1,
    forceCanvas: true, // Legacy compatibility
  });

  pixiRenderer.view.setAttribute('id', 'game-canvas');
  canvasContainer.value.appendChild(pixiRenderer.view);

  // 2. Initialize Stage, Ticker, Loader
  stage = new Container();
  ticker = new Ticker();
  loader = new Loader();

  // Render initial frame to stabilize browser drawing
  pixiRenderer.render(stage);

  // 3. Load assets
  loader.add(ASSETS_PATH.SPRITE_SHEET);
  for (const prop in ASSETS_PATH.SOUNDS) {
    loader.add(ASSETS_PATH.SOUNDS[prop]);
  }

  loader.onProgress.add(() => {
    loadProgress.value = Math.round(loader.progress);
  });

  loader.onComplete.add(() => {
    loading.value = false;
    // Instantiate core game
    pikaVolley = new PikachuVolleyball(stage, loader.resources);
    
    // Apply current UI states to engine properties
    setSpeed(speed.value);
    setWinningScore(winningScore.value);
    setBGM(bgmVolume.value);
    setSFX(sfxMode.value);

    // Setup game loop
    ticker.maxFPS = pikaVolley.normalFPS;
    let frameCount = 0;
    ticker.add(() => {
      pikaVolley.gameLoop();
      pixiRenderer.render(stage);
      
      // Diagnostic logging every 30 frames (approx. 1 second)
      frameCount++;
      if (frameCount % 30 === 0 && pikaVolley) {
        console.log(
          `[PikaVolley Debug] P1(Left) isComputer: ${pikaVolley.physics.player1.isComputer} | ` +
          `P2(Right) isComputer: ${pikaVolley.physics.player2.isComputer}`
        );
        console.log(
          `[PikaVolley Key Status] Left(D): ${pikaVolley.keyboardArray[0].leftKey.isDown} | ` +
          `Right(G): ${pikaVolley.keyboardArray[0].rightKey.isDown} | ` +
          `Up(R): ${pikaVolley.keyboardArray[0].upKey.isDown} | ` +
          `Z: ${pikaVolley.keyboardArray[0].powerHitKey.isDown}`
        );
      }
    });
    ticker.start();
  });

  loader.load();
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown);
  
  // Cleanup Pixi Resources
  if (ticker) {
    ticker.stop();
    ticker.destroy();
  }
  if (pikaVolley && pikaVolley.audio) {
    // Mute/stop all audio
    pikaVolley.audio.muteAll();
  }
  if (pixiRenderer) {
    pixiRenderer.destroy(true);
  }
  if (loader) {
    loader.reset();
  }
});

const handleGlobalKeydown = (event) => {
  if (event.code === 'KeyP') {
    togglePause();
  }
};
</script>

<style scoped>
.game-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
  background: rgba(30, 30, 30, 0.75);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #f0f0f0;
}

/* Header Menu Styling */
.menu-bar {
  display: flex;
  gap: 12px;
  width: 100%;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 16px;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.menu-dropdown {
  position: relative;
}

.menu-btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  font-family: inherit;
}

.menu-btn:hover {
  background: rgba(255, 255, 255, 0.18);
  border-color: rgba(255, 255, 255, 0.3);
}

.dropdown-content {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 6px;
  background: rgba(20, 20, 20, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
  min-width: 180px;
}

.dropdown-content button {
  background: none;
  border: none;
  color: #ccc;
  text-align: left;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.15s ease;
  width: 100%;
}

.dropdown-content button:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.menu-divider {
  border: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.15);
  margin: 4px 0;
}

/* Submenu container style */
.submenu-container {
  padding: 6px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.submenu-title {
  font-size: 12px;
  color: #888;
  font-weight: bold;
  text-transform: uppercase;
}

.submenu-options {
  display: flex;
  gap: 4px;
}

.submenu-options button {
  padding: 4px 8px;
  font-size: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
  color: #aaa;
  text-align: center;
}

.submenu-options button.active {
  background: #facc15;
  color: #000;
  border-color: #facc15;
  font-weight: bold;
}

/* Badge styling */
.badge {
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  font-size: 12px;
}
.badge-active {
  background: #facc15;
  color: #000;
}

/* Canvas Area */
.canvas-outer-container {
  position: relative;
  width: 100%;
  max-width: 648px;
  aspect-ratio: 432 / 304;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
}

#game-canvas-container {
  width: 100%;
  height: 100%;
}

:deep(#game-canvas) {
  width: 100% !important;
  height: 100% !important;
  image-rendering: pixelated;
}

#game-canvas-container.graphic-soft :deep(#game-canvas) {
  image-rendering: auto;
}

/* Loading Overlay */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #111;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.loader-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.terriermon-running {
  font-size: 40px;
  animation: bounce 0.6s infinite alternate;
}

.progress-bar-container {
  width: 200px;
  height: 8px;
  background: rgba(255,255,255,0.1);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: #facc15;
  transition: width 0.1s ease;
}

/* Modal Dialog */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  backdrop-filter: blur(4px);
}

.modal-card {
  background: #1e1e1e;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  padding: 24px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-card h2 {
  margin: 0;
  color: #facc15;
  text-align: center;
}

.controls-grid {
  display: flex;
  gap: 20px;
}

.control-column {
  flex: 1;
}

.control-column h3 {
  font-size: 14px;
  color: #888;
  margin-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 4px;
}

.control-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.control-column li {
  font-size: 13px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

kbd {
  background: #333;
  border: 1px solid #555;
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 11px;
  color: #fff;
  font-family: monospace;
  box-shadow: 0 2px 0 #111;
}

.about-desc {
  font-size: 12px;
  color: #888;
  line-height: 1.5;
  text-align: center;
}

.close-btn {
  background: #facc15;
  color: #000;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-family: inherit;
  transition: background 0.2s ease;
  width: 100%;
  text-align: center;
}

.close-btn:hover {
  background: #eab308;
}

/* Animations */
@keyframes bounce {
  from { transform: translateY(0); }
  to { transform: translateY(-10px); }
}

/* Virtual Gamepad Styles */
.menu-btn.controller-toggle {
  background: rgba(147, 51, 234, 0.15);
  border: 1px solid rgba(147, 51, 234, 0.3);
  color: #e9d5ff;
}

.menu-btn.controller-toggle:hover {
  background: rgba(147, 51, 234, 0.3);
  border-color: rgba(147, 51, 234, 0.5);
}

.menu-btn.controller-toggle.menu-btn-active {
  background: rgba(147, 51, 234, 0.6);
  border-color: rgba(147, 51, 234, 0.8);
  color: #fff;
  box-shadow: 0 0 8px rgba(147, 51, 234, 0.5);
}

.virtual-controller {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 432px;
  margin: 16px auto 0 auto;
  padding: 14px 20px;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  box-sizing: border-box;
  user-select: none;
}

.dpad-container {
  display: grid;
  grid-template-columns: repeat(3, 42px);
  grid-template-rows: repeat(3, 42px);
  gap: 2px;
  background: rgba(0, 0, 0, 0.3);
  padding: 6px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.05);
}

.dpad-center {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 4px;
}

.control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  cursor: pointer;
  user-select: none;
  touch-action: none;
  transition: background 0.05s, transform 0.05s;
}

.control-btn:active {
  transform: scale(0.9);
}

.control-btn.dpad-btn {
  font-size: 15px;
  color: #94a3b8;
}

.control-btn.dpad-btn:active {
  background: rgba(59, 130, 246, 0.4) !important;
  color: #fff;
}

.control-btn.dpad-btn.up {
  border-radius: 8px 8px 0 0;
  background: rgba(59, 130, 246, 0.1);
  border-bottom: 1px solid rgba(59, 130, 246, 0.15);
}
.control-btn.dpad-btn.down {
  border-radius: 0 0 8px 8px;
  background: rgba(59, 130, 246, 0.1);
  border-top: 1px solid rgba(59, 130, 246, 0.15);
}
.control-btn.dpad-btn.left {
  border-radius: 8px 0 0 8px;
  background: rgba(59, 130, 246, 0.1);
  border-right: 1px solid rgba(59, 130, 246, 0.15);
}
.control-btn.dpad-btn.right {
  border-radius: 0 8px 8px 0;
  background: rgba(59, 130, 246, 0.1);
  border-left: 1px solid rgba(59, 130, 246, 0.15);
}

.action-container {
  display: flex;
  gap: 14px;
  align-items: center;
}

.control-btn.action-btn {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
}

.control-btn.action-btn.z-btn {
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #fca5a5;
}

.control-btn.action-btn.z-btn:active {
  background: rgba(239, 68, 68, 0.5) !important;
  color: #fff;
}

.control-btn.action-btn.enter-btn {
  background: rgba(16, 185, 129, 0.2);
  border: 1px solid rgba(16, 185, 129, 0.4);
  color: #a7f3d0;
  transform: translateY(-4px);
}

.control-btn.action-btn.enter-btn:active {
  background: rgba(16, 185, 129, 0.5) !important;
  color: #fff;
  transform: translateY(-4px) scale(0.9);
}

.btn-text {
  font-size: 16px;
  font-weight: bold;
}

.btn-sub {
  font-size: 8px;
  opacity: 0.8;
  margin-top: 1px;
}
</style>
