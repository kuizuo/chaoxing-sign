import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [],
  theme: {
    colors: {
      primary: '#e70012',
    },
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
    }),
    presetTypography({
      cssExtend: {
        'h2': {
          'padding-bottom': '.3em',
          'border-bottom': '1px solid #d8dee4',
        },
        'h2 > a, h3 > a, h4 > a': {
          'text-decoration': 'none',
          'border-bottom': '0',
        },
        'h2 > a:hover, h3 > a:hover, h4 > a:hover': {
          'color': 'inherit !important',
          'border-bottom': '0 !important',
        },
        'a': {
          'text-decoration': 'none',
          'border-bottom': '1px dashed',
        },
        'a:hover': {
          'color': '#f43f5e',
          'border-bottom': '1px solid #f43f5e',
        },
      },
    }),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
