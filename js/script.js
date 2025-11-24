/* script.js - shared functions */

// --------- Bài 1: Product list & search ---------
const products = [
  "Chuột Gaming",
  "Bàn phím cơ",
  "Tai nghe Bluetooth",
  "Loa Mini",
  "Laptop Acer",
  "USB 32GB",
  "Webcam FullHD"
];

function displayProducts(list){
  const container = document.getElementById("productList");
  if(!container) return;
  container.innerHTML = "";
  list.forEach(p => {
    const d = document.createElement("div");
    d.className = "product";
    d.textContent = p; // safe: no innerHTML
    container.appendChild(d);
  });
}

function initProductList(){
  displayProducts(products);
  const search = document.getElementById("search");
  if(!search) return;
  search.addEventListener("input", function(){
    const q = this.value.toLowerCase().trim();
    const result = products.filter(p => p.toLowerCase().includes(q));
    document.getElementById("message").textContent = result.length ? "" : "Không tìm thấy sản phẩm";
    displayProducts(result);
  });
}

// --------- Bài 2: Register form validation & localStorage ---------
function initRegisterForm(){
  const form = document.getElementById("registerForm");
  if(!form) return;
  form.addEventListener("submit", function(e){
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("password").value;
    const agree = document.getElementById("agree").checked;
    const emailPattern = /\S+@\S+\.\S+/;
    const passPattern = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/;
    const msgEl = document.getElementById("registerMsg");
    if(!emailPattern.test(email)){ msgEl.textContent = "Email không hợp lệ"; return; }
    if(!passPattern.test(pass)){ msgEl.textContent = "Mật khẩu phải ≥8 ký tự, có Hoa/Thường/Số"; return; }
    if(!agree){ msgEl.textContent = "Bạn phải đồng ý điều khoản"; return; }
    // Do NOT store password in localStorage
    const user = {name, email, createdAt: new Date().toISOString()};
    localStorage.setItem("user", JSON.stringify(user));
    msgEl.textContent = "Đăng ký thành công!";
    form.reset();
  });
}

// --------- Bài 3: Countdown timer ---------
let countdownInterval = null;
let remaining = 600; // default 10 minutes

function formatTime(sec){
  const m = String(Math.floor(sec/60)).padStart(2,"0");
  const s = String(sec%60).padStart(2,"0");
  return `${m}:${s}`;
}

function initCountdown(){
  const timerEl = document.getElementById("timer");
  const startBtn = document.getElementById("startBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const resetBtn = document.getElementById("resetBtn");
  const modal = document.getElementById("modal");
  const closeModal = document.getElementById("closeModal");

  if(timerEl) timerEl.textContent = formatTime(remaining);

  function updateUI(){
    if(timerEl) timerEl.textContent = formatTime(remaining);
    if(timerEl) timerEl.classList.toggle("red", remaining<=60);
  }

  function tick(){
    if(remaining<=0){
      clearInterval(countdownInterval);
      countdownInterval = null;
      if(modal) modal.style.display = "flex";
      return;
    }
    remaining--;
    updateUI();
  }

  startBtn && startBtn.addEventListener("click", function(){
    if(countdownInterval) return;
    countdownInterval = setInterval(tick, 1000);
  });
  pauseBtn && pauseBtn.addEventListener("click", function(){
    if(countdownInterval){ clearInterval(countdownInterval); countdownInterval = null; }
  });
  resetBtn && resetBtn.addEventListener("click", function(){
    if(countdownInterval){ clearInterval(countdownInterval); countdownInterval = null; }
    remaining = 600;
    updateUI();
    if(modal) modal.style.display = "none";
  });
  closeModal && closeModal.addEventListener("click", function(){
    if(modal) modal.style.display = "none";
  });

  // Clean up when navigating away (best-effort)
  window.addEventListener("beforeunload", function(){
    if(countdownInterval) clearInterval(countdownInterval);
  });
}

// Initialize if index contains product list or form or timer
document.addEventListener("DOMContentLoaded", function(){
  if(document.getElementById("productList")) initProductList();
  if(document.getElementById("registerForm")) initRegisterForm();
  if(document.getElementById("timer")) initCountdown();
});
