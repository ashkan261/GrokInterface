// تابع برای نمایش پیام بالای صفحه
function showMessage(text) {
  const messageDiv = document.createElement('div');
  messageDiv.style.position = 'fixed';
  messageDiv.style.top = '10px';
  messageDiv.style.left = '50%';
  messageDiv.style.transform = 'translateX(-50%)';
  messageDiv.style.background = '#333';
  messageDiv.style.color = '#fff';
  messageDiv.style.padding = '10px 20px';
  messageDiv.style.borderRadius = '5px';
  messageDiv.style.zIndex = '10000';
  messageDiv.style.fontFamily = 'Vazir, sans-serif';
  messageDiv.style.fontSize = '14px';
  messageDiv.textContent = text;

  document.body.appendChild(messageDiv);
  setTimeout(() => messageDiv.remove(), 5000);
}

console.log("Grok Interface: Hello from content.js! This means the script is running.");
showMessage("Grok Interface: اسکریپت با موفقیت لود شد!");

// تابع برای اعمال فونت و سایز
function applySettings(element, font, fontSize) {
  console.log("Applying settings to element:", element.tagName, { font, fontSize });
  if (font) element.style.fontFamily = `${font}, sans-serif !important`;
  if (fontSize) element.style.fontSize = `${fontSize}px !important`;
}

// تابع برای تنظیم جهت متن
function applyTextDirection(element) {
  const text = element.textContent.trim();
  const persianChars = /[\u0600-\u06FF]/.test(text);
  const latinOnly = /^[A-Za-z0-9\s!"#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~]*$/.test(text);

  element.classList.remove('rtl-text', 'ltr-text');
  if (persianChars) {
    element.classList.add('rtl-text');
    console.log("Applied RTL to:", element.textContent.substring(0, 20) + "...");
  } else if (latinOnly) {
    element.classList.add('ltr-text');
    console.log("Applied LTR to:", element.textContent.substring(0, 20) + "...");
  }
}

// اعمال تنظیمات به کل صفحه
function applyTextSettingsToPage() {
  console.log("Applying text settings to page");
  const textElements = document.querySelectorAll('p, div, span, h1, h2, h3, h4, h5, h6, li, a');
  textElements.forEach(element => {
    applyTextDirection(element);
  });
}

function tryOpenPopup() {
  console.log("Trying to open popup...");
  showMessage("تلاش برای باز کردن پاپ‌آپ");

  let popupButton;
  const maxAttempts = 20;
  let attempts = 0;

  const buttonCheckInterval = setInterval(() => {
    popupButton = document.querySelector('button svg circle[cx="16"][cy="15"][r="4"]') || 
                  document.querySelector('button svg circle') || 
                  document.querySelector('button svg');

    attempts++;

    console.log(`Attempt ${attempts}: Searching for popup button... Found: ${!!popupButton}`);
    if (popupButton) {
      console.log("Popup button found after", attempts, "attempts:", popupButton.outerHTML);
      showMessage("دکمه ذره‌بین پیدا شد بعد از " + attempts + " تلاش");
      clearInterval(buttonCheckInterval);

      const buttonElement = popupButton.closest('button');
      try {
        const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
        buttonElement.dispatchEvent(clickEvent);
        console.log("Popup button clicked:", buttonElement.outerHTML);
        showMessage("کلیک روی دکمه ذره‌بین ارسال شد");

        setTimeout(() => {
          const chatPopup = document.querySelector('[cmdk-root]');
          if (chatPopup) {
            console.log("Chat popup opened:", chatPopup.outerHTML.substring(0, 100) + "...");
            showMessage("پاپ‌آپ چت‌ها با موفقیت باز شد");

            const dialog = chatPopup.closest('[role="dialog"]');
            if (dialog) {
              dialog.className = 'chat-sidebar';

              const chatList = dialog.querySelector('[cmdk-list]');
              if (chatList) {
                chatList.className = 'chat-list';
                chatList.style.height = 'calc(100% - 60px)';
                chatList.style.maxHeight = 'none';
                chatList.style.setProperty('--cmdk-list-height', '100%');
                console.log("Chat list height set:", chatList.outerHTML.substring(0, 100) + "...");
                applyTextSettingsToPage();
              }

              const bottomSection = dialog.querySelector('.flex.items-center.justify-end');
              if (bottomSection) {
                bottomSection.className = 'sidebar-footer';
                console.log("Bottom section fixed:", bottomSection.outerHTML.substring(0, 100) + "...");
              }

              const timeElements = dialog.querySelectorAll('span.text-secondary.whitespace-nowrap');
              timeElements.forEach(element => {
                element.style.display = 'none';
              });
              showMessage("تنظیمات سایدبار اعمال شد");

              const bgOverlay = document.querySelector('.bg-overlay');
              if (bgOverlay) bgOverlay.style.display = 'none';
              const backdropBlur = document.querySelector('.backdrop-blur-\\5b2px\\5d, .backdrop-blur-lg');
              if (backdropBlur) backdropBlur.style.display = 'none';

              document.addEventListener('click', (event) => {
                if (!chatPopup.contains(event.target)) {
                  event.stopImmediatePropagation();
                  event.preventDefault();
                  console.log("Blocked outside click from closing popup");
                }
              }, { capture: true });

              const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                  if (!document.contains(chatPopup) || dialog.style.display === 'none') {
                    console.log("Popup removed or hidden, restoring...");
                    showMessage("پاپ‌آپ حذف یا مخفی شد، در حال بازگردانی");
                    dialog.className = 'chat-sidebar';
                    document.body.appendChild(dialog);
                    applyTextSettingsToPage();
                  }
                });
              });
              observer.observe(document.body, { childList: true, subtree: true, attributes: true });

              chrome.storage.sync.get(['font', 'fontSize'], (data) => {
                const font = data && data.font ? data.font : 'Vazir';
                const fontSize = data && data.fontSize ? data.fontSize : '16';
                applySettings(dialog, font, fontSize);
                applySettings(document.body, font, fontSize);
                applyTextSettingsToPage();
              });
            } else {
              console.log("Dialog not found after popup opened!");
              showMessage("دیالوگ پیدا نشد!");
            }
          } else {
            console.log("Chat popup not found after 1 second...");
            showMessage("پاپ‌آپ چت‌ها بعد از ۱ ثانیه پیدا نشد");
          }
        }, 1000);
      } catch (error) {
        console.error("Error triggering button:", error);
        showMessage("خطا در فعال‌سازی دکمه ذره‌بین");
      }
    } else if (attempts >= maxAttempts) {
      clearInterval(buttonCheckInterval);
      console.log("Popup button not found after", maxAttempts, "attempts");
      showMessage("دکمه ذره‌بین بعد از " + maxAttempts + " تلاش پیدا نشد");

      const buttonsWithSvg = document.querySelectorAll('button svg');
      console.log("All buttons with SVG found:", buttonsWithSvg.length);
      buttonsWithSvg.forEach((svg, index) => {
        console.log(`Button ${index}:`, svg.parentElement.outerHTML);
      });
    }
  }, 100);
}

// اجرا هنگام لود صفحه
function initializeExtension() {
  console.log("Initializing extension on page load...");
  showMessage("در حال مقداردهی اولیه اکستنشن...");

  chrome.storage.sync.get(['font', 'fontSize'], (data) => {
    console.log("Storage data retrieved:", data);
    const font = data && data.font ? data.font : 'Vazir';
    const fontSize = data && data.fontSize ? data.fontSize : '16';
    
    applySettings(document.body, font, fontSize);
    applyTextSettingsToPage();
    console.log("Initial font and RTL settings applied");

    setTimeout(() => {
      console.log("Calling tryOpenPopup...");
      tryOpenPopup();
    }, 2000);
  });
}

// اجرا هنگام لود یا رفرش
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM fully loaded");
  showMessage("DOM کاملاً لود شد");
  initializeExtension();
});

// دریافت پیام از popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received:", message);
  const dialog = document.querySelector('.chat-sidebar');

  if (message.action === 'updateFont') {
    applySettings(document.body, message.font, null);
    if (dialog) applySettings(dialog, message.font, null);
    applyTextSettingsToPage();
    showMessage("فونت به " + message.font + " تغییر کرد");
  } else if (message.action === 'updateFontSize') {
    applySettings(document.body, null, message.fontSize);
    if (dialog) applySettings(dialog, null, message.fontSize);
    applyTextSettingsToPage();
    showMessage("اندازه فونت به " + message.fontSize + "px تغییر کرد");
  }
});