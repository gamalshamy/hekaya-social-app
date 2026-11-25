import { Injectable } from '@angular/core';

export type SoundType = 'success' | 'error' | 'click';

@Injectable({
  providedIn: 'root',
})
export class SoundService {
  private readonly sounds: Record<SoundType, HTMLAudioElement> = {
    click: new Audio('/sounds/button-click-sound.mp3'),
    success: new Audio('/sounds/success.mp3'),
    error: new Audio('/sounds/error.mp3'),
  };

  private readonly volumes: Record<SoundType, number> = {
    success: 0.7,
    error: 0.7,
    click: 0.2,
  };

  constructor() {
    Object.entries(this.sounds).forEach(([type, audio]) => {
      audio.preload = 'auto';
      audio.volume = this.volumes[type as SoundType];
    });
  }

  play(type: SoundType): void {
    const audio = this.sounds[type];

    audio.currentTime = 0;

    void audio.play().catch(() => {
      // Playback may be blocked by the browser.
    });
  }

  playClick(): void {
    this.play('click');
  }

  playSuccess(): void {
    this.play('success');
  }

  playError(): void {
    this.play('error');
  }
}
