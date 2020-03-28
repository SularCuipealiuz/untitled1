// const box = document.querySelector('.box')
import {CountUp} from '../javascripts/countUp.min.js'

const getClassElement = (e) => document.getElementsByClassName(e)[0]

// const box = getClassElement('aspect__box')
//
// const div = box.addEventListener('click', e => {
//   const element = e.target
//   const radius = element.offsetWidth / 2
//   console.log('座標X為:', e.offsetX - radius, ' 座標Y為:', radius - e.offsetY)
//
//   const sin = e.offsetX - radius
//   const cos = radius - e.offsetY
//   const tan2 = sin * sin + cos * cos
//   let r = Math.sqrt(tan2)
//   if (r > radius) {
//     console.log('超出圓範圍')
//   }
// })

let getChips = {
  chip_10000: false,
  chip_5000: false,
  chip_1000: false,
  chip_500: false,
  chip_100: false
}

let clockTime = 0
let shouldShowMoney = false
let stopWatch = null
let waitingTime = null
let startingCurrFullExpect = ''

let lastPutMoney = null
let lastTotalMoneyValue

const resetChips = () => {
  getChips = {
    chip_10000: false,
    chip_5000: false,
    chip_1000: false,
    chip_500: false,
    chip_100: false
  }
}

const returnChips = () => {
  if (getChips.chip_10000) {
    return 10000
  } else if (getChips.chip_5000) {
    return 5000
  } else if (getChips.chip_1000) {
    return 1000
  } else if (getChips.chip_500) {
    return 500
  } else if (getChips.chip_100) {
    return 100
  }
}

const toggleChips = (num, element) => {
  if ($(element).closest('.chips-img.brightness').length === 0) {
    $('.chips-img').removeClass('chip-active')
    $(element).closest('.chips-img').addClass('chip-active')

    getChips.chip_10000 = false
    getChips.chip_5000 = false
    getChips.chip_1000 = false
    getChips.chip_500 = false
    getChips.chip_100 = false

    switch (num) {
      case 10000: {
        getChips.chip_10000 = true
        break
      }
      case 5000: {
        getChips.chip_5000 = true
        break
      }
      case 1000: {
        getChips.chip_1000 = true
        break
      }
      case 500: {
        getChips.chip_500 = true
        break
      }
      case 100: {
        getChips.chip_100 = true
        break
      }
    }
  }
}

const sumChips = () => {

}

const toggleAutoPlay = (boolean) => {
  $('.btn-on').removeClass('active')
  $('.btn-off').removeClass('active')

  if (boolean === true) {
    autoPlay = false
    $('.btn-off').addClass('active')
  } else if (boolean === false) {
    autoPlay = true
    $('.btn-on').addClass('active')
    checkAutoPlay()
  }
}

const checkAutoPlay = () => {
  if (autoPlay === true) {
    if (lastPutMoney !== null) {
      $('.chips-box-panel')[0].innerHTML = lastPutMoney
      $('.btn-again').addClass('brightness')
      $('.btn-agree').click()
    }
  }
}

let autoPlay = false
getClassElement('auto-play-btn').addEventListener('click', () => {
  toggleAutoPlay(autoPlay)
})

// const ScoreBarInfo = {
//   number: getClassElement('number').innerHTML,
//   totalBet: getClassElement('total-bet').innerHTML,
//   win: getClassElement('win').innerHTML
// }
let hasCubyed = false
let btnAgainActive = false
let isDone = false
let nowMoney = 0
let lastMoneyValue = 0
let isMobile = false
let countUp
let winMoney
let totalMoney
let moneyValue = 0
let winMoneyValue = 0
let totalMoneyValue = 0
let isOver = false
let isOpen = false
window.onload = function () {
  setTimeout(function () {
    $('.font-panel').removeClass('non-visible')
  }, 2000)

  document.addEventListener('touchstart', (event) => {
    if (event.touches.length > 1) {
      event.preventDefault()
    }
  }, {passive: false})

  let lastTouchEnd = 0
  document.addEventListener('touchend', (event) => {
    const now = (new Date()).getTime()
    if (now - lastTouchEnd <= 100) {
      event.preventDefault()
    }
    lastTouchEnd = now
  }, false)

  let sUserAgent = navigator.userAgent
  if (sUserAgent.indexOf('Android') > -1 || sUserAgent.indexOf('iPhone') > -1 || sUserAgent.indexOf('iPad') > -1 || sUserAgent.indexOf('iPod') > -1 || sUserAgent.indexOf('Symbian') > -1) {
    console.log('mobile')
    isMobile = true
  } else {
    console.log('pc')
    isMobile = false
  }

  const options = {
    duration: 0.5
  }

  countUp = new CountUp('moneyValue', moneyValue, options)
  countUp.start()
  winMoney = new CountUp('win', winMoneyValue, options)
  winMoney.start()
  totalMoney = new CountUp('total', totalMoneyValue, options)
  totalMoney.start()

  document.fullscreenEnabled =
    document.fullscreenEnabled ||
    document.mozFullScreenEnabled ||
    document.documentElement.webkitRequestFullScreen

  function requestFullscreen (element) {
    if (element.requestFullscreen) {
      element.requestFullscreen()
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen()
    } else if (element.webkitRequestFullScreen) {
      element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)
    } else {
      alert('123')
    }
  }

  init(moneyValue)
  getLotteryRates()
  getLotteryTimes()

  const body = getClassElement('body')
  body.addEventListener('click', function () {
    if (isMobile) {
      if (document.fullscreenEnabled) {
        requestFullscreen(document.documentElement)
      }
    }
  })

  // const login = api('login', {
  //   name: 'fcacbt0001',
  //   pass: '123456'
  // })
  //
  // login.done(function () {
  //
  // })
  api('checkislogin', {}).done(function (res) {
    const data = JSON.parse(res)
    chipsVisible(data.data.balance)

    if (data.sign !== true) {
      showErrorMessage(data.message)
    }
    nowMoney = data.data.balance
    countUp.update((nowMoney))
    $('.user-name')[0].innerHTML = data.data.username
  })
  setInterval(function () {
    api('checkislogin', {}).done(function (res) {
      const data = JSON.parse(res)
      chipsVisible(data.data.balance)
      console.log(isOver, shouldShowMoney, isDone)
      if (isOver === true && shouldShowMoney === true && isDone === true) {
        countUp.update(data.data.balance)
      }  else if (isOver === true && shouldShowMoney === false && isDone === false) {
        isDone = true
        countUp.update(data.data.balance)
      }
    })
  }, 1000)
}

const chipsVisible = (num) => {
  if (num < 10000) {
    $('.chip-10000').closest('.chips-img').addClass('brightness')
  }
  if (num < 5000) {
    $('.chip-5000').closest('.chips-img').addClass('brightness')
  }
  if (num < 1000) {
    $('.chip-1000').closest('.chips-img').addClass('brightness')
  }
  if (num < 500) {
    $('.chip-500').closest('.chips-img').addClass('brightness')
  }
  if (num < 100) {
    $('.chip-100').closest('.chips-img').addClass('brightness')
  }
}

const getLoadOpenCode = async (expect) => {
  let requestInfo = {
    lotteryname: 'mysedia',
    expect: expect
  }

  const response = await api('loadopencode', requestInfo)

  return response
}

const resetInit = () => {
  resetChips()
  btnAgainActive = false
  shouldShowMoney = false
  isOver = false
  isOpen = false
  totalMoneyValue = 0
  lastMoneyValue = 0
  // $('#win')[0].innerHTML = 0
  const moneyList = $('.put-money-panel')
  for (let e of moneyList) {
    e.remove()
  }

  const c = $('.table-chips')
  for (let e of c) {
    e.remove()
  }

  $('.betsResult.open').removeClass('open')
  $('.even-font').removeClass('font-active')
  $('.odd-font').removeClass('font-active')

  $('#total')[0].innerHTML = 0
  $('.chips-img').removeClass('brightness')
  $('.stop-watch-panel').addClass('non-visible')

  $('.bowl').removeClass('bowl-open-animation')
  $('.bowl').removeClass('bowl-shake-animation')

  $('.plate').removeClass('plate-shake-animation')
  $('.condition-panel').addClass('non-visible')
  $('.dish-animation').removeClass('scale-move')

  $('#chose').addClass('non-visible')
  $('#onReady').addClass('non-visible')
  $('#open').addClass('non-visible')
  $('#please').addClass('non-visible')
  $('#working').addClass('non-visible')
  $('#wait').addClass('non-visible')

  $('.paper-panel-1').addClass('non-visible')
  $('.paper-panel-2').addClass('non-visible')
  $('.paper-panel-3').addClass('non-visible')

  setTimeout(function () {
    $('.condition-panel').removeClass('non-visible')
    $('#working').removeClass('non-visible')

    const chipValue = returnChips()
    if (chipValue === undefined || chipValue === 0) {
      $('.btn-agree').addClass('brightness')
      $('.btn-cancel').addClass('brightness')
    }
    $('.btn-again').addClass('brightness')

    setTimeout(function () {
      $('.condition-panel').addClass('non-visible')
      $('#working').addClass('non-visible')

      $('.dish-animation').addClass('scale-move-for-open')
      $('.bowl').addClass('bowl-shake-animation')
      $('.plate').addClass('plate-shake-animation')

      setTimeout(function () {
        $('.condition-panel').removeClass('non-visible')
        $('#please').removeClass('non-visible')

        $('.dish-animation').removeClass('scale-move-for-open')
        $('.bowl').removeClass('bowl-shake-animation')
        $('.plate').removeClass('plate-shake-animation')

        setTimeout(function () {
          console.log(nowMoney, lastTotalMoneyValue)
          //TODO bug
          if (lastPutMoney !== null && nowMoney > lastTotalMoneyValue) {
            $('.btn-again').removeClass('brightness')
          }

          $('.condition-panel').addClass('non-visible')
          $('#please').addClass('non-visible')

          $('.stop-watch-panel').removeClass('non-visible')
          $('.chips').removeClass('brightness')
          $('.chips-panel').removeClass('fade')

          if (isOver !== true) {
            checkAutoPlay()
          }
        }, 3000)
      }, 4500)
    }, 3000)
  }, 1000)
}

const getLotteryTimes = () => {
  let requestInfo = {
    cptype: 'sedia',
    lotteryname: 'mysedia'
  }
  const response = api('lotterytimes', requestInfo)
  response.done(function (res) {
    const data = JSON.parse(res).data
    const json = JSON.parse(res)
    if (json.sign !== true) {
      showErrorMessage(json.message)
    }

    $('.player-count .highlight')[0].innerHTML = data.onlinePlayerCount
    startingCurrFullExpect = data.currFullExpect

    api('betsContent', {'expect': startingCurrFullExpect, 'lotteryname': 'mysedia'}).done(function (res) {
      const data = JSON.parse(res).data



      if(data.length>0) {
        //TODO 有下住了
        hasCubyed = true
        let st = 0
        for(let e of data){
          let money = parseInt(e.amount)
          st += money
          let copy = $(`#${e.playid}`)[0].innerHTML
          $(`#${e.playid}`)[0].innerHTML = copy + `<div class="put-money-panel"><span class="put-value">${money}</span></div>`

          let n1 = parseInt(money/10000)
          let m1 = money % 10000
          let n2 = parseInt(m1/5000)
          let m2 = m1 % 5000
          let n3 = parseInt(m2/1000)
          let m3 = m2 % 1000
          let n4 = parseInt(m3/500)
          let m4 = m3 % 500
          let n5 = parseInt(m4/100)
          let m5 = m4 % 100

          if(n1 > 0){
            $(`#${e.playid} .put-chips-panel`)[0].innerHTML += `<div class="table-chips for-100"><img src="images/chips/100.png" alt=""></div>`

            for(let i = 0; i< n1; i++){
              $(`#${e.playid} .for-100`)[0].innerHTML += `<img style="top: -${i * 3}px" src="images/chips/100.png" alt="">`
            }
          }
          if(n2 > 0){
            $(`#${e.playid} .put-chips-panel`)[0].innerHTML += `<div class="table-chips for-500"><img src="images/chips/500.png" alt=""></div>`
            for(let i = 0; i< n1; i++){
              $(`#${e.playid} .for-500`)[0].innerHTML += `<img style="top: -${i * 3}px" src="images/chips/500.png" alt="">`
            }
          }
          if(n3 > 0){
            $(`#${e.playid} .put-chips-panel`)[0].innerHTML += `<div class="table-chips for-1000"><img src="images/chips/1000.png" alt=""></div>`
            for(let i = 0; i< n1; i++){
              $(`#${e.playid} .for-1000`)[0].innerHTML += `<img style="top: -${i * 3}px" src="images/chips/1000.png" alt="">`
            }
          }
          if(n4 > 0){
            $(`#${e.playid} .put-chips-panel`)[0].innerHTML += `<div class="table-chips for-5000"><img src="images/chips/5000.png" alt=""></div>`
            for(let i = 0; i< n1; i++){
              $(`#${e.playid} .for-5000`)[0].innerHTML += `<img style="top: -${i * 3}px" src="images/chips/5000.png" alt="">`
            }
          }
          if(n5 > 0){
            $(`#${e.playid} .put-chips-panel`)[0].innerHTML += `<div class="table-chips for-10000"><img src="images/chips/10000.png" alt=""></div>`
            for(let i = 0; i< n1; i++){
              $(`#${e.playid} .for-10000`)[0].innerHTML += `<img style="top: -${i * 3}px" src="images/chips/10000.png" alt="">`
            }
          }
          const btn = $('.btn-agree').removeClass('brightness')
          $(btn).click()
        }

        totalMoney.update(st)
      }
    })


    clockTime = data.remainTime
    const shouldGetLottery = -3
    const shouldEndGame = data.remainTime <= 10 ? true : false
    if (shouldEndGame === true && waitingTime === null && hasCubyed !== true) {
      $('.condition-panel').removeClass('non-visible')
      $('#wait').removeClass('non-visible')

      // waitingTime = setTimeout(function () {
      //   $('.condition-panel').addClass('non-visible')
      //   $('#wait').addClass('non-visible')
      // }, 3000)
    }

    let tenDigit = Math.floor(clockTime / 10)
    let digit = clockTime % 10

    let tenDigitStr = `images/alarm/time-${tenDigit}.png`
    let digitStr = `images/alarm/time-${digit}.png`

    $('.ten-digit.clock').attr('src', tenDigitStr)
    $('.digit.clock').attr('src', digitStr)
    const shouldLockGame = 0

    const checkOpenLottery = () => {
      const setPaperByResponse = (data) => {

        const openCodeList = (data.opencode).split(',')

        let panel_1 = getClassElement('paper-panel-1')
        let panel_2 = getClassElement('paper-panel-2')
        let panel_3 = getClassElement('paper-panel-3')

        panel_1.classList.add('non-visible')
        panel_2.classList.add('non-visible')
        panel_3.classList.add('non-visible')

        const r = Math.random() * 100

        if (r <= 33) {
          panel_1.classList.remove('non-visible')
          f(panel_1)
        } else if (r > 33 && r <= 66) {
          panel_2.classList.remove('non-visible')
          f(panel_2)
        } else {
          panel_3.classList.remove('non-visible')
          f(panel_3)
        }

        function f (panel) {
          let p1 = panel.querySelectorAll('.paper-1')[0]
          let p2 = panel.querySelectorAll('.paper-2')[0]
          let p3 = panel.querySelectorAll('.paper-3')[0]
          let p4 = panel.querySelectorAll('.paper-4')[0]

          const list = [p1, p2, p3, p4]

          for (let i = 0; i < list.length; i++) {
            list[i].classList.remove('red-paper', 'white-paper')
            // Math.random() * 100 > 50 ? list[i].classList.add('red-paper') : list[i].classList.add('white-paper')
            openCodeList[i] === '1' ? list[i].classList.add('red-paper') : list[i].classList.add('white-paper')
          }

          const num = panel.querySelectorAll('.red-paper').length

          setTimeout(function () {
            if (num % 2 === 0) {
              $('.even-font').addClass('font-active')
              $('#sedia_even').addClass('box-highlight')
            } else {
              $('.odd-font').addClass('font-active')
              $('#sedia_odd').addClass('box-highlight')
            }

            if (num === 0) {
              $('#sedia_fourth_w').addClass('box-highlight')
            } else if (num === 1) {
              $('#sedia_third_w').addClass('box-highlight')
            } else if (num === 3) {
              $('#sedia_third_r').addClass('box-highlight')
            } else if (num === 4) {
              $('#sedia_fourth_r').addClass('box-highlight')
            }
          }, 4000)

          setTimeout(function () {
            $('.font-active').removeClass('font-active')
            setTimeout(function () {
              let info = {
                expect: startingCurrFullExpect - 1,
                lotteryname: 'mysedia'
              }
              const response = api('betsResult', info)

              response.done(e => {
                shouldShowMoney = true

                let reg = /,+-$/gi
                const d = JSON.parse(e)
                const n = (d.data.amount.toString()).replace(reg, '')
                if ((parseInt(n) !== 0)) {
                  $('.betsResult').addClass('open')
                  if (parseInt(n) > 0) {
                    $('.betsValue').css('color', 'green')
                  } else {
                    $('.betsValue').css('color', 'red')
                  }
                  $('.betsValue')[0].innerHTML = d.data.amount
                  winMoneyValue = d.data.amount > 0 ? d.data.amount : 0
                  winMoney.update(winMoneyValue)
                }
              })
            }, 100)
          }, 6000)
          setTimeout(function () {
            $('.box-highlight').removeClass('box-highlight')
          }, 9000)
        }
      }

      if (clockTime < shouldGetLottery) {
        $('.condition-panel').addClass('non-visible')
        $('#onReady').addClass('non-visible')

        clearInterval(keepCheckTime)
        getLotteryTimes()

        getLoadOpenCode(startingCurrFullExpect).then((res) => {
          const data = JSON.parse(res).data
          setPaperByResponse(data)
          console.log('開獎囉')

          isOpen = true
        })
      } else {

      }
    }

    let scaleTime = null
    let openTime = null
    let resetTime = null
    const checkDesktopElement = () => {
      if (clockTime < shouldLockGame) {
        $('.stop-watch-panel').addClass('non-visible')
        $('.chips').addClass('brightness')

        $('.chips-panel').addClass('fade')
        $('.chip-active').removeClass('chip-active')
        resetChips()

        console.log('開碗動畫')
        //鎖定籌碼區
        //提示+開碗動畫
        if ($('.condition-panel.non-visible').length > 0) {
          resetAllCondition()
        }

        $('.condition-panel').removeClass('non-visible')
        $('#open').removeClass('non-visible')
        $('.btn-agree').addClass('brightness')
        $('.btn-cancel').addClass('brightness')
        $('.btn-again').addClass('brightness')

        if (isOver === false) {
          $('.put-money-panel').remove()
          $('#total')[0].innerHTML = 0

          const c = $('.table-chips')
          for (let e of c) {
            e.remove()
          }
        }

        if (scaleTime === null) {
          scaleTime = setTimeout(function () {
            $('.condition-panel').addClass('non-visible')
            $('#open').addClass('non-visible')
            $('.bowl-panel').addClass('scale-move')

            if (openTime === null) {
              openTime = setTimeout(function () {
                //復歸
                $('.bowl-panel').addClass('scale-move')

                $('.bowl').addClass('bowl-open-animation')
                if (resetTime === null) {
                  resetTime = setTimeout(function () {
                    resetInit()
                  }, 8000)
                }
              }, 1400)
            }
          }, 3000)
        }

      } else {

        let tenDigit = Math.floor(clockTime / 10)
        let digit = clockTime % 10

        let tenDigitStr = `images/alarm/time-${tenDigit}.png`
        let digitStr = `images/alarm/time-${digit}.png`

        $('.ten-digit.clock').attr('src', tenDigitStr)
        $('.digit.clock').attr('src', digitStr)
      }
    }

    const keepCheckTime = setInterval(function () {
      clockTime -= 1
      checkOpenLottery()
      checkDesktopElement()
    }, 1000)
  })
}
const resetAllCondition = () => {
  $('.condition-panel').addClass('non-visible')
  $('#chose').addClass('non-visible')
  $('#onReady').addClass('non-visible')
  $('#open').addClass('non-visible')
  $('#please').addClass('non-visible')
  $('#working').addClass('non-visible')
  $('#wait').addClass('non-visible')
}

const getTimeStamp = (date) => {
  let parse = date ? new Date(date) : new Date()
  return Date.parse(parse)
}

const getLotteryRates = () => {
  let requestInfo = {
    cptype: 'sedia',
    lotteryname: 'mysedia'
  }
  const response = api('lotteryrates', requestInfo)
  response.done(function (res) {
    const data = JSON.parse(res)
    const rates = data.rates
    if (data.sign !== true) {
      showErrorMessage(data.message)
    }
    let sedia_third_r = document.getElementById('sedia_third_r')
    let sedia_third_w = document.getElementById('sedia_third_w')
    let sedia_fourth_r = document.getElementById('sedia_fourth_r')
    let sedia_fourth_w = document.getElementById('sedia_fourth_w')
    let sedia_odd = document.getElementById('sedia_odd')
    let sedia_even = document.getElementById('sedia_even')

    sedia_third_r.innerHTML = sedia_third_r.innerHTML + '<span class="label">1:' + parseFloat(rates.sedia_third_r.maxrate) + '</span>'
    sedia_third_w.innerHTML = sedia_third_w.innerHTML + '<span class="label">1:' + parseFloat(rates.sedia_third_w.maxrate) + '</span>'
    sedia_fourth_r.innerHTML = sedia_fourth_r.innerHTML + '<span class="label">1:' + parseFloat(rates.sedia_fourth_r.maxrate) + '</span>'
    sedia_fourth_w.innerHTML = sedia_fourth_w.innerHTML + '<span class="label">1:' + parseFloat(rates.sedia_fourth_w.maxrate) + '</span>'
    sedia_odd.innerHTML = sedia_odd.innerHTML + '<span class="label">1:' + parseFloat(rates.sedia_odd.maxrate) + '</span>'
    sedia_even.innerHTML = sedia_even.innerHTML + '<span class="label">1:' + parseFloat(rates.sedia_even.maxrate) + '</span>'
  })
}

const init = (moneyValue) => {
  getClassElement('btn-cancel').addEventListener('click', function () {
    if ($('.btn-cancel.brightness').length === 0) {
      const c = $('.table-chips')
      for (let e of c) {
        e.remove()
      }

      const l = $('.put-money-panel')
      for (let e of l) {
        e.remove()
      }
      $('.btn.btn-cancel').addClass('brightness')

      if (lastPutMoney !== null) {
        $('.btn.btn-agree').addClass('brightness')

      }
      totalMoneyValue = 0
      $('#total')[0].innerHTML = 0
      totalMoney.update(0)
    }
  })

  getClassElement('btn-agree').addEventListener('click', function () {
    if ($('.put-money-panel').length > 0 && $('.btn-agree.brightness').length === 0) {
      isOver = true
      $('.btn-agree').addClass('brightness')
      $('.btn-cancel').addClass('brightness')
      $('.btn-again').addClass('brightness')

      $('.condition-panel').removeClass('non-visible')
      $('#onReady').removeClass('non-visible')
      $('.chips-img').addClass('brightness')
      $('.chip-active').removeClass('chip-active')

      setTimeout(function () {
        $('.condition-panel').addClass('non-visible')
        $('#onReady').addClass('non-visible')
      }, 3000)


      if(hasCubyed !== true) {
        const l = $('.chips-box')
        let requestInfo = {
          orderList: [],
          expect: startingCurrFullExpect,
          lotteryname: 'mysedia'
        }

        let sum = 0
        for (let e of l) {
          if ($(e).find('.put-money-panel').length > 0) {
            sum += parseInt($(e).find('.put-money-panel .put-value')[0].innerHTML)
            requestInfo.orderList.push({
              playid: $(e)[0].id,
              price: $(e).find('.put-money-panel .put-value')[0].innerHTML
            })
          }
        }
        lastTotalMoneyValue = sum
        lastPutMoney = $('.chips-box-panel')[0].innerHTML
        lastMoneyValue = sum

        const response = api('agreeLottery', requestInfo)
        response.done(function (res) {
          if (res.sign !== true) {
            showErrorMessage(res.message)
          }
        })
      }

    } else {

    }
  })

  getClassElement('btn-again').addEventListener('click', function () {
    if (lastPutMoney !== null && $('.btn-again.brightness').length === 0) {
      $('.total-bet')[0].innerHTML = lastTotalMoneyValue
      $('.chips-box-panel')[0].innerHTML = lastPutMoney
      $('.btn-again').addClass('brightness')
      $('.btn-agree').removeClass('brightness')
      $('.btn-cancel').removeClass('brightness')

      btnAgainActive = true
    } else {

    }
  })

  $('.chips-box-panel').on('click', '.chips-box', function (e) {
    if($('#sedia_even').hasClass('.put-money-panel')){

    }


    const copy = e.target.innerHTML
    const chipValue = returnChips()
    let dontDoIt = false
    if (e.target.classList.value.indexOf('dont-put') > 0) {
      dontDoIt = true
    }

    const element = $(this).find('.put-money-panel')
    if (isOver === false) {
      if (nowMoney > returnChips() && nowMoney > totalMoneyValue + returnChips()) {
        if (element.length > 0) {
          if (dontDoIt !== true) {
            const target = element.find('span')[0]
            const value = parseInt(target.innerHTML)
            target.innerHTML = value + chipValue
          }
        } else if (chipValue !== undefined) {
          $(this)[0].innerHTML = copy + `<div class="put-money-panel"><span class="put-value">${chipValue}</span></div>`
          $('.btn.btn-cancel.brightness').removeClass('brightness')
          $('.btn.btn-agree.brightness').removeClass('brightness')
        }
        //TODO 如果有按延續上把
        if(btnAgainActive === true && lastTotalMoneyValue > 0 ){
          totalMoneyValue += lastTotalMoneyValue
          btnAgainActive = false
        }

        let total = totalMoneyValue
        let parseTotal = parseInt(total, 10)
        totalMoneyValue = parseTotal + chipValue
        totalMoney.update(totalMoneyValue)
      }
      if (element.length >= 0 && nowMoney > returnChips() && nowMoney > totalMoneyValue + returnChips()) {
        if (returnChips() === 100) {
          if ($(this).find('.for-100').length === 0) {
            $(this).find('.put-chips-panel')[0].innerHTML += `<div class="table-chips for-100"><img src="images/chips/100.png" alt=""></div>`
          } else {
            const i = $(this).find('.for-100 img').length
            $(this).find('.for-100')[0].innerHTML += `<img style="top: -${i * 3}px" src="images/chips/100.png" alt="">`
          }
        }
        if (returnChips() === 500) {
          if ($(this).find('.for-500').length === 0) {
            $(this).find('.put-chips-panel')[0].innerHTML += `<div class="table-chips for-500"><img src="images/chips/500.png" alt=""></div>`
          } else {
            const i = $(this).find('.for-500 img').length
            $(this).find('.for-500')[0].innerHTML += `<img style="top: -${i * 3}px" src="images/chips/500.png" alt="">`
          }
        }
        if (returnChips() === 1000) {
          if ($(this).find('.for-1000').length === 0) {
            $(this).find('.put-chips-panel')[0].innerHTML += `<div class="table-chips for-1000"><img src="images/chips/1000.png" alt=""></div>`
          } else {
            const i = $(this).find('.for-1000 img').length
            $(this).find('.for-1000')[0].innerHTML += `<img style="top: -${i * 3}px" src="images/chips/1000.png" alt="">`
          }
        }
        if (returnChips() === 5000) {
          if ($(this).find('.for-5000').length === 0) {
            $(this).find('.put-chips-panel')[0].innerHTML += `<div class="table-chips for-5000"><img src="images/chips/5000.png" alt=""></div>`
          } else {
            const i = $(this).find('.for-5000 img').length
            $(this).find('.for-5000')[0].innerHTML += `<img style="top: -${i * 3}px" src="images/chips/5000.png" alt="">`
          }
        }
        if (returnChips() === 10000) {
          if ($(this).find('.for-10000').length === 0) {
            $(this).find('.put-chips-panel')[0].innerHTML += `<div class="table-chips for-10000"><img src="images/chips/10000.png" alt=""></div>`
          } else {
            const i = $(this).find('.for-10000 img').length
            $(this).find('.for-10000')[0].innerHTML += `<img style="top: -${i * 3}px" src="images/chips/10000.png" alt="">`
          }
        }
      }
    }
  })

  let chip_10000 = getClassElement('chip-10000')
  chip_10000.addEventListener('click', function (e) {
    toggleChips(10000, this)
  })

  let chip_5000 = getClassElement('chip-5000')
  chip_5000.addEventListener('click', function (e) {
    toggleChips(5000, this)
  })

  let chip_1000 = getClassElement('chip-1000')
  chip_1000.addEventListener('click', function (e) {
    toggleChips(1000, this)
  })

  let chip_500 = getClassElement('chip-500')
  chip_500.addEventListener('click', function (e) {
    toggleChips(500, this)
  })

  let chip_100 = getClassElement('chip-100')
  chip_100.addEventListener('click', function (e) {
    toggleChips(100, this)
  })

  const dish = getClassElement('dish-animation')
  const cover = getClassElement('black-cover')
  const confirm = getClassElement('confirm-panel')

  const btnExit = getClassElement('btn-exit')
  btnExit.addEventListener('click', function (e) {
    $('.btn-confirm').removeClass('non-visible')
    confirm.classList.remove('non-visible')
    cover.classList.remove('non-visible')
    $('.confirm-panel .hint span')[0].innerHTML = '確定要離開牌桌？'
  })

  const close = getClassElement('close')
  close.addEventListener('click', function (e) {
    confirm.classList.add('non-visible')
    cover.classList.add('non-visible')
    $('.btn-confirm').addClass('non-visible')
  })

  const btnClose = getClassElement('btn-close')
  btnClose.addEventListener('click', function (e) {
    confirm.classList.add('non-visible')
    cover.classList.add('non-visible')
  })

  const btnConfirm = getClassElement('btn-confirm')
  btnConfirm.addEventListener('click', function (e) {
    // window.history.go(-2)
    window.history.back()

  })

  const btnHistory = getClassElement('btn-history')
  btnHistory.addEventListener('click', function (e) {
    let exist = false
    const right = getClassElement('right')

    for (let e of right.classList) {
      if (e === 'move-animation') {
        exist = true
        break
      }
    }
    if (exist) {
      right.classList.remove('move-animation')
      $('.list').removeClass('list-active')

    } else {
      right.classList.add('move-animation')
      $('.list').addClass('list-active')

    }

    let requestInfo = {
      num: 50,
      lotteryname: 'mysedia'
    }
    const response = api('history', requestInfo)
    response.done(function (res) {
      const json = JSON.parse(res)
      if (json.sign !== true) {
        showErrorMessage(json.message)
      }
      const list = json.data

      const panel = getClassElement('list')
      panel.innerHTML = ''
      for (let i = 0; i < list.length; i++) {

        let insertElement = document.createElement('div')
        const num = list[i].opencode.replace(/[^0]/g, '').length
        const isEven = num % 2 === 0 ? true : false

        let dishImg

        switch (num) {
          case 0: {
            dishImg = `<img src="images/list/w-dish-zero.png" alt="">`
            break
          }
          case 1: {
            dishImg = `<img src="images/list/w-dish-one.png" alt="">`
            break
          }
          case 2: {
            dishImg = `<img src="images/list/w-dish-two.png" alt="">`
            break
          }
          case 3: {
            dishImg = `<img src="images/list/w-dish-three.png" alt="">`
            break
          }
          case 4: {
            dishImg = `<img src="images/list/w-dish-four.png" alt="">`
            break
          }
        }

        let index = i + 1
        insertElement.classList.add('list-row')
        insertElement.innerHTML = `
          <span class="index">${index < 10 ? '0' + index : index}</span>
          <span class="sub ${isEven ? 'even' : 'odd'}">${isEven ? '雙' : '單'}</span>
          <span class="content">${dishImg}</span>
    `
        panel.appendChild(insertElement)
      }

    })
  })
}

const api = (apiName, requestInfo) => {

  // let requestInfo = new FormData()
  //
  // requestInfo.append('cptype', 'sedia')

  $.ajaxSetup({
    xhrFields: {
      withCredentials: true
    },
    crossDomain: true
  })

  const config = {
    pc_host: 'http://www.bryson.sedia.asusbr.club',
    mobile_host: 'http://www.bryson.sedia.asusbr.club',
    path: [{
      apiName: 'lotteryrates',
      uri: '/Apijiekou.lotteryrates'
    }, {
      apiName: 'history',
      uri: '/Apijiekou.lotteryopencodes'
    }, {
      apiName: 'lotterytimes',
      uri: '/Apijiekou.lotterytimes'
    }, {
      apiName: 'agreeLottery',
      uri: '/Apijiekou.cpbuy'
    }, {
      apiName: 'loadopencode',
      uri: '/Apijiekou.loadopencode'
    }, {
      apiName: 'login',
      uri: '/Public.loginDo'
    }, {
      apiName: 'checkislogin',
      uri: '/Apijiekou.checkislogin'
    }, {
      apiName: 'betsResult',
      uri: '/Apijiekou.betsResult'
    }, {
      apiName: 'betsContent',
      uri: '/Apijiekou.betsContent'
    }]
  }

  let api = config.path.filter(e => {
    if (apiName === e.apiName) {
      return e
    }
  })
  return $.post((isMobile ? config.mobile_host : config.pc_host) + api[0].uri, requestInfo)
}

const showErrorMessage = (message) => {
  const cover = getClassElement('black-cover')
  const confirm = getClassElement('confirm-panel')

  confirm.classList.remove('non-visible')
  cover.classList.remove('non-visible')
  $('.confirm-panel .hint span')[0].innerHTML = message
}

