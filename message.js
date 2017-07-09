a = 0
$li = $('#menu-pannel').children('.main-menus').children('li')
$li.each(i => {
  d = $li.eq(i).find('all-conv-unread-count').find('em.ng-binding')
  d.each(item => {
    let val = parseInt(d.eq(item).text())
    a += isNaN(val) ? 0 : val
  })
})