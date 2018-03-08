import { screen } from 'electron'

export default () => {
  const displays = screen.getAllDisplays()
  const primaryDisplay = screen.getPrimaryDisplay()

  // win32 darwin linux平台分别处理
  return displays.map(({ id, bounds, workArea, scaleFactor }) => {
    const scale = scaleFactor / primaryDisplay.scaleFactor
    const display = process.platform === 'linux' ? workArea : bounds
    return {
      id,
      scaleFactor,
      x: display.x * (scale >= 1 ? scale : 1),
      y: display.y * (scale >= 1 ? scale : 1),
      width: display.width * scale,
      height: display.height * scale
    }
  })
}
