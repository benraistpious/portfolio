document.addEventListener('DOMContentLoaded', () => {
    
    // Simple UX Password Gate
    const pw = prompt("Dashboard Locked. Please enter password:");
    if (pw !== "benrasi123") {
        document.body.innerHTML = `
            <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:100vh; background:var(--color-bg); color:var(--color-accent); font-family:var(--font-primary);">
                <h1 style="font-size:3rem; text-transform:uppercase;">Access Denied</h1>
                <a href="index.html" class="btn btn-secondary" style="margin-top:2rem;">Return to site</a>
            </div>
        `;
        return;
    }

    const STORAGE_KEY = 'portfolioProjects';
    let editingId = null;
    const form = document.getElementById('projectForm');
    const formTitle = document.getElementById('formTitle');
    const submitBtn = document.getElementById('submitBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const listContainer = document.getElementById('adminProjectsList');
    const exportBtn = document.getElementById('exportBtn');
    const importFile = document.getElementById('importFile');

    // Load projects
    function getProjects() {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    }

    // Save projects
    function saveProjects(projects) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
        renderList();
    }

    // Render Admin List
    function renderList() {
        const projects = getProjects();
        listContainer.innerHTML = '';

        if (projects.length === 0) {
            listContainer.innerHTML = '<p>No projects found. Add one above.</p>';
            return;
        }

        projects.forEach(proj => {
            const tagsHTML = (proj.softwares || []).map(s => `<span>${s}</span>`).join(' • ');
            const thumbHTML = proj.image ? `<img src="${proj.image}" style="width: 80px; height: 45px; object-fit: cover; margin-right: 1rem; border: 1px solid var(--color-text);">` : '';
            
            const cardHTML = `
                <div class="admin-card">
                    <div style="display: flex; align-items: flex-start;">
                        ${thumbHTML}
                        <div>
                            <h3 style="margin-bottom: 0.5rem; text-transform: uppercase;">${proj.title}</h3>
                            <p style="font-size: 0.9rem; opacity: 0.7; margin-bottom: 1rem;">${proj.description}</p>
                            <div style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase;">
                                ${tagsHTML}
                            </div>
                        </div>
                    </div>
                    <div class="admin-card-actions">
                        <button class="btn btn-secondary edit-btn" data-id="${proj.id}" style="padding: 0.5rem 1rem;">Edit</button>
                        <button class="btn btn-danger delete-btn" data-id="${proj.id}" style="padding: 0.5rem 1rem;">Delete</button>
                    </div>
                </div>
            `;
            listContainer.innerHTML += cardHTML;
        });

        // Attach listeners
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                editProject(id);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                deleteProject(id);
            });
        });
    }

    // Edit Project Logic
    function editProject(id) {
        const projects = getProjects();
        const proj = projects.find(p => p.id === id);
        if(!proj) return;

        editingId = id;
        formTitle.innerText = "Edit Project";
        submitBtn.innerText = "Update Project";
        cancelEditBtn.style.display = "inline-block";

        document.getElementById('projTitle').value = proj.title;
        document.getElementById('projDesc').value = proj.description;
        document.getElementById('projLink').value = proj.link || '';
        
        // Reset checkboxes
        document.querySelectorAll('input[name="software"]').forEach(cb => cb.checked = false);
        // Check relevant boxes
        if(proj.softwares) {
            proj.softwares.forEach(sw => {
                const cb = document.querySelector(`input[name="software"][value="${sw}"]`);
                if(cb) cb.checked = true;
            });
        }
        
        document.getElementById('projImage').value = '';
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

    cancelEditBtn.addEventListener('click', () => {
        resetFormState();
    });

    function resetFormState() {
        editingId = null;
        form.reset();
        formTitle.innerText = "Add New Project";
        submitBtn.innerText = "Save Project";
        cancelEditBtn.style.display = "none";
    }

    // Helper function to compress image
    function compressImage(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    const MAX_WIDTH = 800;

                    if (width > MAX_WIDTH) {
                        height = Math.round((height * MAX_WIDTH) / width);
                        width = MAX_WIDTH;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Compress as highly-optimized JPEG (quality 0.6)
                    const base64Str = canvas.toDataURL('image/jpeg', 0.6);
                    resolve(base64Str);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    // Add Project
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('projTitle').value;
        const desc = document.getElementById('projDesc').value;
        const link = document.getElementById('projLink').value;
        const imageFile = document.getElementById('projImage').files[0];
        
        // Get selected checkboxes
        const softwareCheckboxes = document.querySelectorAll('input[name="software"]:checked');
        const softwares = Array.from(softwareCheckboxes).map(cb => cb.value);

        if (softwares.length === 0) {
            alert("Please select at least one software.");
            return;
        }

        let compressedImage = null;
        if (imageFile) {
            compressedImage = await compressImage(imageFile);
        }

        const projects = getProjects();

        if (editingId) {
            const index = projects.findIndex(p => p.id === editingId);
            if(index !== -1) {
                projects[index].title = title;
                projects[index].description = desc;
                projects[index].link = link;
                projects[index].softwares = softwares;
                if(compressedImage) {
                    projects[index].image = compressedImage;
                }
            }
        } else {
            const newProject = {
                id: Date.now(),
                title: title,
                description: desc,
                link: link,
                softwares: softwares,
                image: compressedImage
            };
            projects.unshift(newProject);
        }

        saveProjects(projects);
        resetFormState();
    });

    // Delete Project
    function deleteProject(id) {
        if(confirm("Are you sure you want to delete this project?")) {
            let projects = getProjects();
            projects = projects.filter(p => p.id !== id);
            saveProjects(projects);
        }
    }

    // Export Backup
    exportBtn.addEventListener('click', () => {
        const projects = getProjects();
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projects, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "portfolio_backup.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    });

    // Import Backup
    importFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const importedData = JSON.parse(event.target.result);
                if (Array.isArray(importedData)) {
                    if(confirm("This will overwrite your current projects. Continue?")) {
                        saveProjects(importedData);
                        alert("Backup restored successfully!");
                    }
                } else {
                    alert("Invalid backup file format.");
                }
            } catch (err) {
                alert("Error parsing backup file.");
            }
        };
        reader.readAsText(file);
    });

    // Initial render
    renderList();

});
