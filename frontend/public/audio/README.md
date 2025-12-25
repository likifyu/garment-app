# Digital Atelier Audio Assets

## Generated Audio Files

### Background Music
- `background_music.mp3` - Sophisticated luxury fashion runway music

### UI Sound Effects
- `success.mp3` - Success notification sound
- `click.mp3` - Button click sound  
- `whoosh.mp3` - Page transition sound

## Usage
Import audio manager from `@/utils/audioManager.js`

```javascript
import audioManager from '@/utils/audioManager'

// Play success sound
audioManager.playSuccess()

// Play click sound
audioManager.playClick()

// Play background music (looping)
audioManager.playBackgroundMusic()
```
