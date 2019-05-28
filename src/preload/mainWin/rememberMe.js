import ElectronStore from 'electron-store'
import debounce from 'lodash/debounce'
const electronStore = new ElectronStore()

export default () => {
  const $tab = document.querySelector('.login-form.login-tab .tab-items')
  if (!$tab) return
  const $tabItems = $tab.querySelectorAll('.tab-item')
  $tabItems.forEach(item => {
    item.addEventListener('click', () => {
      const classList = [...item.classList]
      if (item.getAttribute('ui-sref') === '.passwordLogin' && classList.indexOf('current') === -1) {
        setTimeout(() => rememberMe(), 100)
      }
    })
  })
  rememberMe()
}

const rememberMe = () => {
  const $form = document.querySelector('.login-form.login-tab form')
  if (!$form) return
  const $checkboxContainer = document.createElement('div')
  const $checkbox = document.createElement('input')
  const $text = document.createTextNode('记住我')
  $checkbox.setAttribute('type', 'checkbox')
  if (electronStore.get('remember')) {
    $checkbox.setAttribute('checked', true)
  }
  $checkboxContainer.appendChild($checkbox)
  $checkboxContainer.appendChild($text)
  const $submitBtn = $form.querySelector('button[type="submit"]')
  $form.insertBefore($checkboxContainer, $submitBtn)

  const $phoneInput = $form.querySelector('phone-input>input')
  const $pwdInput = $form.querySelector('input.password')

  const rememberMePhone = debounce(() => electronStore.set('phone', $phoneInput.value), 1500)
  const rememberMePwd = debounce(() => electronStore.set('pwd', $pwdInput.value), 1500)
  const remember = () => {
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

  // 保存密码
  if ($checkbox.checked) {
    remember()
    rememberMePhone()
    rememberMePwd()
  }

  $checkbox.addEventListener('change', () => {
    if ($checkbox.checked) {
      remember()
      rememberMePhone()
      rememberMePwd()
    } else {
      electronStore.delete('phone')
      electronStore.delete('pwd')
    }
    electronStore.set('remember', !!$checkbox.checked)
  })
}
