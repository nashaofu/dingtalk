const { spawn } = require('child_process')

spawn('npm', ['run', 'dev:main'], {
  stdio: 'inherit',
  // 仅在当前运行环境为 Windows 时，才使用 shell
  shell: process.platform === 'win32'
})

spawn('npm', ['run', 'dev:preload'], {
  stdio: 'inherit',
  // 仅在当前运行环境为 Windows 时，才使用 shell
  shell: process.platform === 'win32'
})

spawn('npm', ['run', 'dev:renderer'], {
  stdio: 'inherit',
  // 仅在当前运行环境为 Windows 时，才使用 shell
  shell: process.platform === 'win32'
})
