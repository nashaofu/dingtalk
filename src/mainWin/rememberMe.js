import ElectronStore from 'electron-store'
const electronStore = new ElectronStore()

export default () => {
  const $form = document.querySelector('.login-form.login-tab form')
  const $tabItems = $form.querySelectorAll('.login-tab .tab-item')
  $tabItems.forEach((item) => {
    item.addEventListener('click', () => {
      if (item.getAttribute('ui-sref') === '.passwordLogin') {
        setTimeout(() => rememberMe(), 100)
      }
    })
  })
  if (!$form) return
  rememberMe(true)
}

const rememberMe = autoLogin => {
  const $form = document.querySelector('.login-form.login-tab form')
  if (!$form) return
  const $checkboxContainer = document.createElement('div')
  const $checkbox = document.createElement('input')
  const $text = document.createTextNode('记住我')
  $checkbox.setAttribute('type', 'checkbox')
  $checkbox.setAttribute('checked', true)
  $checkboxContainer.appendChild($checkbox)
  $checkboxContainer.appendChild($text)
  const $submitBtn = $form.querySelector('button[type="submit"]')
  $form.insertBefore($checkboxContainer, $submitBtn)

  const $phoneInput = $form.querySelector('phone-input>input')
  const $pwdInput = $form.querySelector('input.password')

  const rememberMePhone = () => electronStore.set('phone', $phoneInput.value)
  const rememberMePwd = () => electronStore.set('pwd', $pwdInput.value)
  const rememberMe = () => {
    $phoneInput.removeEventListener('input', rememberMePhone)
    $pwdInput.removeEventListener('input', rememberMePwd)
    $phoneInput.addEventListener('input', rememberMePhone)
    $pwdInput.addEventListener('input', rememberMePwd)
  }
  const phone = electronStore.get('phone')
  const pwd = electronStore.get('pwd')
  const $scopePhone = angular.element($phoneInput).scope()
  const $scopePwd = angular.element($pwdInput).scope()

  if (phone) {
    $scopePhone.$apply(() => {
      $scopePhone.phoneInput.telephone = $scopePhone.phone = $phoneInput.value = phone
      $scopePhone.phoneInput.triggerChange()
    })
    $scopePwd.$apply(() => {
      $scopePwd.passwordLogin.telephone = phone
    })
  }

  if (pwd) {
    $scopePwd.$apply(() => {
      $scopePwd.passwordLogin.password = $pwdInput.value = pwd
      $scopePwd.passwordLogin.submitable = true
    })
  }

  if ($phoneInput.value &&
    $pwdInput.value &&
    $pwdInput.value.length > 3) {
    $submitBtn.disabled = false
    if (autoLogin) {
      $scopePwd.passwordLogin.submit()
    }
  }

  // 保存密码
  if ($checkbox.checked) {
    rememberMe()
    rememberMePhone()
    rememberMePwd()
  }

  $checkbox.addEventListener('change', () => {
    if ($checkbox.checked) {
      rememberMe()
      rememberMePhone()
      rememberMePwd()
    } else {
      electronStore.delete('phone')
      electronStore.delete('pwd')
    }
  })
}
