// ==UserScript==
// @name         gptx-auto-gpt
// @namespace    https://www.lzane.com/
// @version      0.3
// @description  GPTX 自动选择gpt4，支持hash传入query
// @author       zane
// @match        https://gptx.woa.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=woa.com
// @downloadURL  https://raw.githubusercontent.com/lzane/dotfiles/main/tampermonkey/gptx-auto-gpt.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const modelSelectDivSelector = "#__next > div > main > div.flex.flex-col.flex-auto.min-h-0.lg\\:p-4.lg\\:pt-0 > div.flex.h-full.w-full.overflow-hidden.lg\\:rounded-2xl > div.flex-1 > div > div.absolute.w-full.top-0.left-0.flex.flex-grow-0.py-2.px-3.lg\\:py-4.lg\\:px-6.justify-between.bg-gradient-to-t.from-transparent.via-white\\/50.to-white.z-10 > div.flex.gap-4 > div > div"
    const modelSelectGPT4Selector = "#__next > div > main > div.flex.flex-col.flex-auto.min-h-0.lg\\:p-4.lg\\:pt-0 > div.flex.h-full.w-full.overflow-hidden.lg\\:rounded-2xl > div.flex-1 > div > div.absolute.w-full.top-0.left-0.flex.flex-grow-0.py-2.px-3.lg\\:py-4.lg\\:px-6.justify-between.bg-gradient-to-t.from-transparent.via-white\\/50.to-white.z-10 > div.flex.gap-4 > div > div > div.p-2.z-20.absolute.top-\\[calc\\(100\\%\\+0\\.5rem\\)\\].left-0.shadow-\\[0_0_10px_rgba\\(0\\,0\\,0\\,0\\.10\\)\\].pt-2.rounded-\\[0\\.38rem\\].bg-white.transition-all.h-\\[auto\\] > div:nth-child(3)"
    const textareaSelector = "#__next > div > main > div.flex.flex-col.flex-auto.min-h-0.lg\\:p-4.lg\\:pt-0 > div.flex.h-full.w-full.overflow-hidden.lg\\:rounded-2xl > div.flex-1 > div > div.flex.flex-col.flex-auto.overflow-y-auto.justify-center > div.pb-2.bg-gradient-to-b.from-transparent.via-white\\/50.to-white.bottom-0.left-0.w-full.border-transparent > div.stretch.flex.flex-row.gap-3.last\\:mb-3.mx-2.mt-12.md\\:mx-4.md\\:mt-\\[52px\\].md\\:last\\:mb-6.lg\\:mx-auto.lg\\:max-w-3xl > div > textarea"
    const sendBtnSelector = "#__next > div > main > div.flex.flex-col.flex-auto.min-h-0.lg\\:p-4.lg\\:pt-0 > div.flex.h-full.w-full.overflow-hidden.lg\\:rounded-2xl > div.flex-1 > div > div.flex.flex-col.flex-auto.overflow-y-auto.justify-center > div.pb-2.bg-gradient-to-b.from-transparent.via-white\\/50.to-white.bottom-0.left-0.w-full.border-transparent > div.stretch.flex.flex-row.gap-3.last\\:mb-3.mx-2.mt-12.md\\:mx-4.md\\:mt-\\[52px\\].md\\:last\\:mb-6.lg\\:mx-auto.lg\\:max-w-3xl > div > button"

    function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

    // 输入框输入内容
    const setTextareaValue = ()=>new Promise((resolve)=>{
        // 从hash中获取内容
        const value = decodeURIComponent(location.hash.substr(1))
        if(!value){
            return
        }

        const textarea = document.querySelector(textareaSelector);
        var nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
        nativeTextAreaValueSetter.call(textarea, value);

        const event = new Event('input', { bubbles: true});
        textarea.dispatchEvent(event);
        resolve();
    })

    // 点击发送按钮
    const clickSendBtn = ()=>{
        const sendBtn = document.querySelector(sendBtnSelector)
        sendBtn.click()
    }

    async function main(){
        const select = await waitForElm(modelSelectDivSelector)
        select.click();
        const gpt4 = await waitForElm(modelSelectGPT4Selector)
        gpt4.click();
        await setTextareaValue()
        clickSendBtn()
    }

    main()
})();