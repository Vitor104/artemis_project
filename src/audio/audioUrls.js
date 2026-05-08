/** Vite resolves these to URLs — keep total encoded size low for LCP (see scripts/gen-audio.mjs). */
import droneUrl from '../assets/audio/drone.mp3'
import radio1Url from '../assets/audio/radio1.mp3'
import radio2Url from '../assets/audio/radio2.mp3'
import radio3Url from '../assets/audio/radio3.mp3'
import transmissionCh4Url from '../assets/audio/transmission-ch4.mp3'

export const AUDIO_URLS = {
  drone: droneUrl,
  radioPool: [radio1Url, radio2Url, radio3Url],
  transmissions: {
    'ch4-hidden-side': transmissionCh4Url,
  },
}
