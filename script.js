// --- CONFIGURATION ---
const API_URL = 'https://script.google.com/a/~/macros/s/AKfycbwsU2bPH4EfqzSX8N7zMxJDmoOH-uQPbMLObH3IB9iqbHTyiapq95SgeFZyVes_wrBF-g/exec'; 

// --- API WRAPPER ---
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

// --- LOGIN LOGIC ---
async function requestOTP() {
  const adm = document.getElementById('login-adm').value.trim();
  const dob = document.getElementById('login-dob').value;
  if(!adm || !dob) return Swal.fire('Error', 'Missing ID or DOB', 'warning');

  showLoader('Verifying...');
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
  showLoader('Logging in...');
  try {
    const data = await callAPI('verifyOTP', { adm, otp });
    hideLoader();
    localStorage.setItem('shiksha_session', adm);
    currentStudentData = data;
    loadStudentDashboard();
    showPage('student-dashboard');
  } catch (e) {
    hideLoader();
    Swal.fire('Error', e.message, 'error');
  }
}

// --- ADMIN LOGIN ---
async function attemptAdminLogin() {
  const user = document.getElementById('admin-user').value;
  const pass = document.getElementById('admin-pass').value;
  showLoader('Authenticating...');
  try {
    await callAPI('adminLogin', { user, pass });
    hideLoader();
    localStorage.setItem('shiksha_admin_session', 'true');
    showPage('admin-dashboard');
    loadAdminDashboard();
  } catch (e) {
    hideLoader();
    Swal.fire('Error', e.message, 'error');
  }
}

// (Replace all other original functions with callAPI equivalents)
// (Copy original UI logic like switchStudentTab, toggleMobileMenu, loadStudentDashboard, etc)
