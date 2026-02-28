const companyList = document.getElementById("companyList");
const overlay = document.getElementById("overlay");
const closeButton = document.getElementById("closeBtn");
const overlayLogo = document.getElementById("overlayLogo");
const overlayTitle = document.getElementById("overlayTitle");
const overlayDesc = document.getElementById("overlayDesc");
const overlayLink = document.getElementById("overlayLink");
const tvContainer = document.getElementById("tradingview-container");

function openOverlay() {
    overlay.style.display = "flex";
}

function closeOverlay() {
    overlay.style.display = "none";
    tvContainer.innerHTML = ""; // ล้างกราฟออกเมื่อปิด
}

function createCompanyCard(company) {
    const article = document.createElement("article");
    article.className = "card";
    
    article.innerHTML = `
        <img src="${company.img}" alt="${company.name}">
        <h2>${company.name}</h2>
        <p>${company.desc}</p>
        <button type="button" class="open-btn">รายละเอียด</button>
    `;

    article.querySelector(".open-btn").addEventListener("click", () => {
        overlayTitle.textContent = company.name;
        overlayDesc.textContent = company.desc;
        overlayLogo.src = company.img;
        overlayLink.href = company.url;

        // ล้างกราฟเก่าและโหลดใหม่
        tvContainer.innerHTML = ""; 
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
        script.async = true;
        script.innerHTML = JSON.stringify({
            "symbol": company.symbol,
            "width": "100%",
            "height": "100%",
            "locale": "th",
            "dateRange": "12M",
            "colorTheme": "light",
            "trendLineColor": "rgba(41, 98, 255, 1)",
            "underLineColor": "rgba(41, 98, 255, 0.3)",
            "isTransparent": false,
            "autosize": true
        });
        tvContainer.appendChild(script);
        openOverlay();
    });

    return article;
}

function loadCompanies() {
    // ล้างหน้าจอทีก่อน เพื่อกันข้อมูลซ้ำเวลา Refresh
    companyList.innerHTML = ""; 
    
    fetch("companies.json")
        .then(res => res.json())
        .then(data => {
            data.forEach(company => {
                companyList.appendChild(createCompanyCard(company));
            });
        });
}

closeButton.addEventListener("click", closeOverlay);
window.onclick = (e) => { if (e.target == overlay) closeOverlay(); };

// เรียกใช้แค่ครั้งเดียว!
loadCompanies();