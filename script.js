const API_URL = 'https://script.google.com/macros/s/AKfycbwsU2bPH4EfqzSX8N7zMxJDmoOH-uQPbMLObH3IB9iqbHTyiapq95SgeFZyVes_wrBF-g/exec';

let currentStudentData = null;

// FAIL-SAFE INITIALIZATION (Fixes Blank Screen)
document.addEventListener('DOMContentLoaded', () => {
  const session = localStorage.getItem('shiksha_session');
  const adminSession = localStorage.getItem('shiksha_admin_session');

  if (session) {
    showPage('student-dashboard');
    refreshStudentData(session);
  } else if (adminSession === 'true') {
    showPage('admin-dashboard');
    loadAdminDashboard();
  } else {
    showPage('login-page');
  }
});

function showPage(id) {
  const pages = ['login-page', 'otp-page', 'admin-login-page', 'student-dashboard', 'admin-dashboard'];
  pages.forEach(p => {
    const el = document.getElementById(p);
    if(el) el.style.display = 'none';
  });
  const target = document.getElementById(id);
  if(target) target.style.display = (id.includes('dashboard') ? 'flex' : 'flex');
}

async function callAPI(action, data = {}) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({ action, data }),
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }
    });
    const res = await response.json();
    if (!res.success) throw new Error(res.message);
    return res.data;
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
}

function showLoader(text = 'Processing...') {
  document.getElementById('loader-text').innerText = text;
  document.getElementById('loader').style.display = 'flex';
}

function hideLoader() { document.getElementById('loader').style.display = 'none'; }

async function requestOTP() {
  const adm = document.getElementById('login-adm').value.trim();
  const dob = document.getElementById('login-dob').value;
  if(!adm || !dob) return Swal.fire('Error', 'Fill all fields', 'warning');
  
  showLoader('Verifying ID...');
  try {
    const res = await callAPI('login', { adm, dob });
    hideLoader();
    document.getElementById('display-email').innerText = res.maskedEmail;
    showPage('otp-page');
  } catch (e) {
    hideLoader();
    Swal.fire('Error', e.message, 'error');
  }
}

async function verifyOTP() {
  const adm = document.getElementById('login-adm').value.trim();
  const otp = document.getElementById('login-otp').value.trim();
  showLoader('Authenticating...');
  try {
    const data = await callAPI('verifyOTP', { adm, otp });
    hideLoader();
    localStorage.setItem('shiksha_session', adm);
    currentStudentData = data;
    // (Call your loadStudentDashboard function here)
    showPage('student-dashboard');
  } catch (e) {
    hideLoader();
    Swal.fire('Error', e.message, 'error');
  }
}

async function attemptAdminLogin() {
  const user = document.getElementById('admin-user').value;
  const pass = document.getElementById('admin-pass').value;
  showLoader('Checking Admin...');
  try {
    await callAPI('adminLogin', { user, pass });
    hideLoader();
    localStorage.setItem('shiksha_admin_session', 'true');
    showPage('admin-dashboard');
    // (Call your loadAdminDashboard function here)
  } catch (e) {
    hideLoader();
    Swal.fire('Error', e.message, 'error');
  }
}

function logout() {
  localStorage.clear();
  showPage('login-page');
}
