import { signTypeMap } from './cx'
import type { Setting } from '~/types/account'

export const defaultSetting: Setting = {
  location: {
    text: '',
    latitude: '-1',
    longitude: '-1',
  },
  monitor: false,
  signType: [...Object.keys(signTypeMap)],
  delay: 2000,
}
