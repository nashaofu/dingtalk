import { desktopCapturer } from 'electron'

export default async (displays, bounds) => {
  // 图片定位要以窗口最左侧开始
  // 但在窗口可能不是在(0, 0)位置
  let dx = bounds.x
  let dy = bounds.y
  displays.forEach(display => {
    if (dx > display.x) {
      dx = display.x
    }
    if (dy > display.y) {
      dy = display.y
    }
  })
  /**
   * 每一个屏幕截一张图是为了让每一张图片都尽可能的清晰
   * 图片经过缩放之后质量损失非常大
   */
  if (process.platform === 'win32') {
    return await Promise.all(displays.map(async (display, index) => {
      return await new Promise((resolve, reject) => {
        desktopCapturer.getSources({
          types: ['screen'],
          thumbnailSize: {
            width: display.width,
            height: display.width
          }
        }, (error, sources) => {
          if (error) {
            return reject(error)
          }
          resolve({
            x: display.x - dx,
            y: display.y - dy,
            width: display.width,
            height: display.height,
            thumbnail: sources[index].thumbnail
          })
        })
      })
    }))
  } else {
    return await new Promise((resolve, reject) => {
      desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: {
          width: bounds.width,
          height: bounds.width
        }
      }, (error, sources) => {
        if (error) {
          return reject(error)
        }
        resolve([{
          x: 0,
          y: 0,
          width: bounds.width,
          height: bounds.height,
          thumbnail: sources[0].thumbnail
        }])
      })
    })
  }
}
