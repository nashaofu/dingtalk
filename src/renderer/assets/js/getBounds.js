export default displays => {
  return displays.reduce((bounds, { x, y, width, height }) => {
    const w = x + width - bounds.x
    const h = y + height - bounds.y
    return {
      x: bounds.x < x ? bounds.x : x,
      y: bounds.y < y ? bounds.y : y,
      width: bounds.width > w ? bounds.width : w,
      height: bounds.height > h ? bounds.height : h
    }
  })
}
