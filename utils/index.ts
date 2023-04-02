import { h } from 'vue'
import { Icon } from '#components'

// 深度合并
export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
  const result = Object.assign({}, src)
  Object.keys(target).forEach((key) => {
    if (result[key] && typeof result[key] === 'object')
      result[key] = deepMerge(result[key], target[key])

    else
      result[key] = target[key]
  })
  return result
}

export function renderIcon(icon: string) {
  return () => h(Icon, { name: icon })
}
