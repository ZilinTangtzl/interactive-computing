// 页面来源检查相关
const gamePage = 'p5game.html';
const howtoPage = 'howtoplay.html';
const authorsPage = 'authors.html';
const otherPages = [gamePage, howtoPage, authorsPage];

let justClickedBegin = false;

// 检查是不是从其他页面回来的
function isFromOtherPage() {
    for(let page of otherPages) {
        if(document.referrer.includes(page)) {
            return true;
        }
    }
    return false;
}

// 检查是不是刷新页面
function isRefresh() {
    return performance.navigation.type == 1;
}

// 遮罩层显示相关
function showPortal(overlay) {
    overlay.style.display = 'flex';
}

function hidePortal(overlay) {
    overlay.style.display = 'none';
}

function fadeOutPortal(overlay) {
    overlay.style.animation = 'fadeOut 1s';
    setTimeout(function() {
        hidePortal(overlay);
        justClickedBegin = true;
    }, 1000);
}

// 主要逻辑
function initPortal() {
    let overlay = document.querySelector('.portal-overlay');
    
    if (justClickedBegin) {
        hidePortal(overlay);
    } else if (isRefresh()) {
        showPortal(overlay);
    } else if (isFromOtherPage()) {
        hidePortal(overlay);
    } else {
        showPortal(overlay);
    }
}

function startJourney() {
    bgMusic.play();
    let overlay = document.querySelector('.portal-overlay');
    fadeOutPortal(overlay);
}

// 初始化
window.addEventListener('load', initPortal);