
document.addEventListener('DOMContentLoaded', function() {
     // Load existing values if present
    // TODO: Replace this with a fetch call to your backend API to get current values
    document.getElementById('heroTitle').value = localStorage.getItem('heroTitle') || '';
    document.getElementById('heroSubtitle').value = localStorage.getItem('heroSubtitle') || '';
    document.getElementById('theme').value = localStorage.getItem('theme') || '';

    document.getElementById('admin-edit-form').addEventListener('submit', function(e) {
        e.preventDefault();

        // TODO: Replace this with a POST/PUT call to your backend API
        localStorage.setItem('heroTitle', document.getElementById('heroTitle').value);
        localStorage.setItem('heroSubtitle', document.getElementById('heroSubtitle').value);
        localStorage.setItem('theme', document.getElementById('theme').value);

        document.getElementById('saveMsg').style.display = 'block';
        setTimeout(() => document.getElementById('saveMsg').style.display = 'none', 2000);
    });
});


