# LwhAdmin

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```


日志调用
```javascript
import { logger } from '@/utils/logger'

// 记录错误
logger.error('发生错误', error)

// 记录警告
logger.warn('警告信息')

// 记录普通信息
logger.info('操作信息')

```


