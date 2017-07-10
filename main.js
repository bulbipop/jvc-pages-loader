// ==UserScript==
// @name         jvc-pages-loader
// @namespace    https://github.com/bulbipop/jvc-pages-loader
// @version      0.1
// @match        http://www.jeuxvideo.com/forums/*
// @run-at       document-idle
// ==/UserScript==

let lastURL = document.URL

unsafeWindow.newRequest = function(url, reload=false) {
    let req = new XMLHttpRequest();

    req.onreadystatechange = function(ev) {
        if (this.readyState === XMLHttpRequest.DONE) {
            let listPage = document.querySelectorAll('.bloc-pagi-default')
            let lastPage = listPage[listPage.length - 1]
            let wrapper = document.createElement('div');
            wrapper.innerHTML = this.responseText
            wrapper.querySelector('#bloc-formulaire-forum').remove()
            wrapper.querySelector('.bloc-outils-bottom').remove()
            let posts = wrapper.querySelector('.conteneur-messages-pagi')
            lastPage.insertAdjacentHTML('afterend', posts.innerHTML)
            if (reload) {
                for (let pagi of listPage) {
                    pagi.remove()
                }
                scroll(0, 10000)
            }
        }
    }

    console.log('GET:' + url)
    lastURL = url
    req.open('GET', url, true)
    req.send(null)
}

unsafeWindow.checkScroll = function() {
/*
if not typing a post
*/

    console.log('checking')
    let screenSize = document.body.scrollHeight
    let scrollPos = document.body.scrollTop
    let windowSize = document.defaultView.height()
    if (screenSize == scrollPos  + windowSize) {
        let pageActive = document.querySelectorAll('.page-active')
        try {
            let nextPage = pageActive[pageActive.length - 1].nextSibling
                                                            .firstChild
                                                            .href
            newRequest(nextPage)
        } catch (e) {
            console.log('Reloading pageActive')
            let parentLastPage = pageActive[pageActive.length - 2].parentNode
                                                                  .parentNode
                                                                  .parentNode
            let oldMsg = parentLastPage.querySelectorAll('.bloc-message-forum')
            for (let msg of oldMsg) {
                msg.remove()
            }
            newRequest(lastURL, reload=true)
        }
    }
}

setInterval(checkScroll, 5000)
