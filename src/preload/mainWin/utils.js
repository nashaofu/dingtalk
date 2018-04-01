export const transFileClassName = filename => {
  let extension = ''
  if (filename) {
    const index = filename.lastIndexOf('.')
    extension = index >= 0 ? filename.substring(index + 1).toLowerCase() : ''
  }
  const audio = {
    mp3: 1,
    mp2: 1,
    ogg: 1,
    wav: 1,
    m4a: 1,
    ape: 1,
    mid: 1,
    aac: 1,
    au: 1,
    wma: 1,
    flac: 1,
    ac3: 1
  }
  const video = {
    aiff: 1,
    avi: 1,
    mov: 1,
    mp4: 1,
    mpeg: 1,
    mpg: 1,
    qt: 1,
    ram: 1,
    viv: 1,
    wmv: 1,
    rm: 1,
    rmvb: 1,
    mkv: 1
  }
  const img = {
    gif: 1,
    bmp: 1,
    png: 1,
    jpg: 1,
    jpeg: 1,
    ico: 1,
    tiff: 1,
    tif: 1,
    tga: 1
  }
  const files = {
    pdf: 1,
    ai: 1,
    doc: 1,
    docx: 1,
    ppt: 1,
    pptx: 1,
    psd: 1,
    rar: 1,
    txt: 1,
    xls: 1,
    xlsx: 1,
    zip: 1
  }
  if (!extension) {
    return 'ico_file_unknown'
  }
  extension = extension.toLowerCase()
  if (audio[extension]) {
    return 'ico_file_audio'
  } else if (video[extension]) {
    return 'ico_file_video'
  } else if (img[extension]) {
    return 'ico_file_img'
  } else if (files[extension]) {
    return `ico_file_${extension}`
  } else {
    return 'ico_file_unknown'
  }
}

export const formatFileSize = size => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  if (size === 0) return '0 B'
  const index = parseInt(Math.floor(Math.log(size) / Math.log(1024)))
  let fileSize = (Math.round(10 * size / Math.pow(1024, index)) / 10).toString()
  if (fileSize.indexOf('.') === -1) {
    fileSize += '.0'
  }
  return `${fileSize} ${units[index]}`
}
