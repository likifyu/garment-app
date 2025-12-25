/**
 * Digital Atelier Audio Manager
 * 精心雕琢的音频体验
 */

class AudioManager {
  constructor() {
    this.sounds = {}
    this.backgroundMusic = null
    this.enabled = true
    this.volume = 0.3
    this.musicVolume = 0.15
  }

  init() {
    // 预加载音效
    this.sounds.success = new Audio('/audio/success.mp3')
    this.sounds.click = new Audio('/audio/click.mp3')
    this.sounds.whoosh = new Audio('/audio/whoosh.mp3')
    this.sounds.notification = new Audio('/audio/success.mp3')
    
    // 设置音量
    Object.values(this.sounds).forEach(sound => {
      sound.volume = this.volume
    })

    // 背景音乐
    this.backgroundMusic = new Audio('/audio/background_music.mp3')
    this.backgroundMusic.volume = this.musicVolume
    this.backgroundMusic.loop = true
  }

  playSuccess() {
    if (!this.enabled) return
    const sound = this.sounds.success?.cloneNode()
    if (sound) {
      sound.volume = this.volume
      sound.play().catch(() => {})
    }
  }

  playClick() {
    if (!this.enabled) return
    const sound = this.sounds.click?.cloneNode()
    if (sound) {
      sound.volume = this.volume * 0.5
      sound.play().catch(() => {})
    }
  }

  playWhoosh() {
    if (!this.enabled) return
    const sound = this.sounds.whoosh?.cloneNode()
    if (sound) {
      sound.volume = this.volume * 0.6
      sound.play().catch(() => {})
    }
  }

  playNotification() {
    if (!this.enabled) return
    const sound = this.sounds.notification?.cloneNode()
    if (sound) {
      sound.volume = this.volume * 0.8
      sound.play().catch(() => {})
    }
  }

  playBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.play().catch(() => {
        console.log('Background music autoplay blocked')
      })
    }
  }

  stopBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause()
      this.backgroundMusic.currentTime = 0
    }
  }

  toggleBackgroundMusic() {
    if (this.backgroundMusic.paused) {
      this.playBackgroundMusic()
    } else {
      this.stopBackgroundMusic()
    }
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume))
    Object.values(this.sounds).forEach(sound => {
      sound.volume = this.volume
    })
  }

  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume))
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = this.musicVolume
    }
  }

  toggleEnabled() {
    this.enabled = !this.enabled
    return this.enabled
  }
}

const audioManager = new AudioManager()
audioManager.init()

export default audioManager
