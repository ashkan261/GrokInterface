document.addEventListener('DOMContentLoaded', () => {
  const fontSelect = document.getElementById('font-select');
  const fontSizeSlider = document.getElementById('font-size');
  const fontSizeValue = document.getElementById('font-size-value');

  // بارگذاری تنظیمات ذخیره‌شده
  chrome.storage.sync.get(['font', 'fontSize'], (data) => {
    console.log("Loaded settings from storage:", data);
    fontSelect.value = data.font || 'Vazir'; // پیش‌فرض Vazir
    fontSizeSlider.value = data.fontSize || '16';
    fontSizeValue.textContent = `${fontSizeSlider.value}px`;
  });

  // ذخیره و ارسال فونت
  fontSelect.addEventListener('change', (e) => {
    const font = e.target.value;
    console.log("Font changed to:", font);
    chrome.storage.sync.set({ font: font }, () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'updateFont', font: font });
      });
    });
  });

  // ذخیره و ارسال سایز فونت
  fontSizeSlider.addEventListener('input', (e) => {
    const fontSize = e.target.value;
    fontSizeValue.textContent = `${fontSize}px`;
    console.log("Font size changed to:", fontSize);
    chrome.storage.sync.set({ fontSize: fontSize }, () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'updateFontSize', fontSize: fontSize });
      });
    });
  });
});