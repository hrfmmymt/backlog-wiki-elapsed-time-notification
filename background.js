const xhr = new XMLHttpRequest()
xhr.open('GET', window.location.href, true)
xhr.send()
xhr.onreadystatechange = () => {
  if (xhr.readyState === 4) {
    const serverDate = new Date(xhr.getResponseHeader('Date'))

    const yyyy = serverDate.getFullYear()
    const MM = ('0' + (serverDate.getMonth() + 1)).slice(-2)
    const dd = ('0' + serverDate.getDate()).slice(-2)
    const hh = ('0' + serverDate.getHours()).slice(-2)
    const mm = ('0' + serverDate.getMinutes()).slice(-2)
    const ss = ('0' + serverDate.getSeconds()).slice(-2)
    const nowDate = yyyy + '/' + MM + '/' + dd + ' ' + hh + ':' + mm + ':' + ss

    // from Backlog DOM
    const userIconSet = document.querySelectorAll(
      '.user-history > .user-icon-set'
    )
    const lastElText = userIconSet[userIconSet.length - 1].querySelector(
      '.user-icon-set__text'
    ).innerHTML
    const lastUpDate = lastElText.match(
      /(\d{4})(\/)(\d{2})(\/)(\d{2})(\s)(\d{2})(\:)(\d{2})(\:)(\d{2})/
    )[0]

    const msDiff = new Date(nowDate).getTime() - new Date(lastUpDate).getTime()
    const daysDiff = Math.floor(msDiff / (1000 * 60 * 60 * 24))

    if (daysDiff > 364) {
      const notification = document.createElement('p')
      Object.assign(notification.style, {
        backgroundColor: '#ffe79a',
        color: '#533f03',
        padding: '16px'
      })
      notification.innerHTML = '最終更新日から1年以上が経過しています。'

      // to Backlog UI
      document
        .getElementById('bodyLeft')
        .insertBefore(
          notification,
          document.getElementById('mainTitle').nextSibling
        )
    }
  }
}

;(function() {
  // https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide
  function trackEvent(category, action, opt_label) {
    var label = opt_label || ''
    _gaq.push(['_trackEvent', category, action, label])
  }

  // https://developer.chrome.com/extensions/runtime#method-getManifest
  function reportVersion() {
    var version = 'v' + chrome.runtime.getManifest().version
    trackEvent('Background', 'version', version)
  }

  function reportContentEvent() {
    trackEvent('Content', 'some_event', '')
  }

  // ...

  function init() {
    reportVersion()

    // Listen to request from content script.
    chrome.runtime.onMessage.addListener(function(
      request,
      sender,
      sendResponse
    ) {
      someOperation()
      reportContentEvent()
      return true
    })
  }

  chrome.storage.sync.get(DEFAULT_OPTIONS, function(items) {
    init()
  })
})()
