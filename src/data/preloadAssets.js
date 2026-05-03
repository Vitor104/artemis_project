/** URLs passed to LoadingScreen — keep in sync with VoidJourney imports. */
import capsuleImg from '../assets/Capsula.webp'
import astronautLookingAtEarth from '../assets/astronautLookingAtEarth.webp'
import earthViewFromOrion from '../assets/earthViewFromOrion.webp'
import overTheMoon from '../assets/overTheMoon.webp'
import earthset from '../assets/earthset.webp'
import backToEarth from '../assets/backToEarth.webp'
import splashdown from '../assets/splashdown.webp'
import { crewMembers } from './crew'

export const preloadImageUrls = [
  capsuleImg,
  astronautLookingAtEarth,
  earthViewFromOrion,
  overTheMoon,
  earthset,
  backToEarth,
  splashdown,
  ...crewMembers.map((m) => m.portrait),
]
