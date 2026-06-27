import { describe, it, expect } from 'vitest';
import { PikaPhysics, PikaUserInput } from '../src/game/physics.js';

describe('Pikachu Volleyball Physics Engine', () => {
  it('should initialize player and ball positions correctly', () => {
    const physics = new PikaPhysics(false, true); // Player 1 human, Player 2 computer
    
    // Check player 1 initial position (left side)
    expect(physics.player1.x).toBe(36);
    expect(physics.player1.y).toBe(244);
    
    // Check player 2 initial position (right side)
    expect(physics.player2.x).toBe(432 - 36); // 396
    expect(physics.player2.y).toBe(244);
    
    // Check ball initial values (typically initialized in constructor/round start)
    expect(physics.ball.x).toBe(56);
    expect(physics.ball.y).toBe(0);
  });

  it('should run physics engine for next frame and simulate gravity on the ball', () => {
    const physics = new PikaPhysics(false, true);
    
    // Initialize the ball on the left side
    physics.ball.x = 50;
    physics.ball.y = 50;
    physics.ball.xVelocity = 0;
    physics.ball.yVelocity = 0;

    const inputs = [new PikaUserInput(), new PikaUserInput()];
    
    // Run 5 frames
    for (let i = 0; i < 5; i++) {
      physics.runEngineForNextFrame(inputs);
    }
    
    // Ball should fall down under gravity, so Y should increase and yVelocity should be > 0
    expect(physics.ball.y).toBeGreaterThan(50);
    expect(physics.ball.yVelocity).toBeGreaterThan(0);
  });

  it('should bounce the ball when it hits boundaries', () => {
    const physics = new PikaPhysics(false, true);
    
    // Position ball near left wall going left
    physics.ball.x = 22; // close to left limit (ball radius is 20)
    physics.ball.y = 100;
    physics.ball.xVelocity = -5;
    physics.ball.yVelocity = 0;

    const inputs = [new PikaUserInput(), new PikaUserInput()];
    
    // Run 1 frame
    physics.runEngineForNextFrame(inputs);
    
    // Ball should bounce back, so xVelocity should become positive
    expect(physics.ball.xVelocity).toBeGreaterThan(0);
  });
});
