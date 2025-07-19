// admin.js
document.addEventListener("DOMContentLoaded", function() {
    const pages = ["index.html", "about.html", "activity.html", "event.html", "sermon.html", "blog.html"];
    const contentArea = document.getElementById("contentArea");
    const saveButton = document.getElementById("saveButton");
    const pageSelect = document.getElementById("pageSelect");

    // Load the selected page content into the editor
    pageSelect.addEventListener("change", function() {
        const selectedPage = this.value;
        loadPageContent(selectedPage);
    });

    // Load content from the selected HTML file
    function loadPageContent(page) {
        fetch(page)
            .then(response => response.text())
            .then(data => {
                contentArea.value = data;
            })
            .catch(error => {
                console.error("Error loading page content:", error);
            });
    }

    // Save the edited content back to the selected HTML file
    saveButton.addEventListener("click", function() {
        const selectedPage = pageSelect.value;
        const updatedContent = contentArea.value;

        // Simulate saving the content (this would require server-side handling)
        console.log(`Saving changes to ${selectedPage}:`, updatedContent);
        alert("Changes saved successfully! (This is a simulation; actual saving requires server-side code.)");
    });

    // Initialize the page select dropdown
    pages.forEach(page => {
        const option = document.createElement("option");
        option.value = page;
        option.textContent = page;
        pageSelect.appendChild(option);
    });
});