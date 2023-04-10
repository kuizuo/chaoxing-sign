import { signTypeMap } from './cx'

export const defaultSetting: API.Setting = {
  location: {
    latitude: '-1',
    longitude: '-1',
  },
  monitor: false,
  signType: [...Object.keys(signTypeMap)],
  delay: 2000,
}
