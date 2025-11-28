// job-details.js - job details page (depends on main.js)

onReady(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const jobId = parseInt(urlParams.get("id"), 10);
  if (!jobId) {
    displayError();
    return;
  }

  let allJobs = [];
  try {
    allJobs = await fetchJobs();
  } catch (err) {
    displayError();
    return;
  }

  const currentJob = allJobs.find((j) => j.id === jobId);
  if (!currentJob) {
    displayError();
    return;
  }

  displayJobDetails(currentJob);
  renderRelatedJobs(currentJob, allJobs);
  updateIcons();
});

// Display job details (DOM updates)
function displayJobDetails(job) {
  const setIf = (id, value, attr = false) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (attr) el.setAttribute(attr, value);
    else el.textContent = value;
  };

  setIf("page-title", job.title);
  document.title = `${job.title} - TiroAfrica`;

  const logo = document.getElementById("job-logo");
  if (logo) {
    logo.src = job.logo;
    logo.alt = `${job.company} logo`;
  }

  setIf("job-title", job.title);
  setIf("job-company", job.company);
  setIf("job-category", job.category);
  setIf("job-type", job.type);
  setIf("job-location", job.location);
  setIf("job-posted", `Posted ${job.postedTime}`);

  const salaryEl = document.getElementById("job-salary");
  if (salaryEl) salaryEl.textContent = job.salary;

  const companyLogoSidebar = document.getElementById("company-logo-sidebar");
  if (companyLogoSidebar) {
    companyLogoSidebar.src = job.logo;
    companyLogoSidebar.alt = `${job.company} logo`;
  }
  setIf("company-name", job.company);

  generateSkillsTags(job);
}

function generateSkillsTags(job) {
  const tagsContainer = document.getElementById("job-tags");
  if (!tagsContainer) return;

  const skillsMap = {
    Technology: [
      "Programming",
      "Problem Solving",
      "Agile",
      "Team Collaboration",
      "Technical Skills",
    ],
    Commerce: [
      "Sales",
      "Marketing",
      "Customer Service",
      "Business Strategy",
      "Analytics",
    ],
    "Hotels & Tourism": [
      "Hospitality",
      "Customer Service",
      "Management",
      "Communication",
      "Multitasking",
    ],
    Construction: [
      "Project Management",
      "Safety",
      "Technical Drawing",
      "Team Leadership",
      "Planning",
    ],
    Education: [
      "Teaching",
      "Curriculum Development",
      "Communication",
      "Patience",
      "Mentoring",
    ],
    Healthcare: [
      "Patient Care",
      "Medical Knowledge",
      "Empathy",
      "Attention to Detail",
      "Teamwork",
    ],
    Agriculture: [
      "Farming",
      "Sustainability",
      "Equipment Operation",
      "Planning",
      "Physical Stamina",
    ],
  };

  const skills = skillsMap[job.category] || [
    "Leadership",
    "Management",
    "Communication",
    "Strategy",
    "Analytics",
  ];
  tagsContainer.innerHTML = skills
    .map((s) => `<span class="badge bg-light text-dark px-3 py-2">${s}</span>`)
    .join("");
}

function renderRelatedJobs(currentJob, allJobs) {
  const relatedJobs = allJobs
    .filter(
      (job) => job.category === currentJob.category && job.id !== currentJob.id
    )
    .slice(0, 3);
  const container = document.getElementById("related-jobs");
  if (!container) return;

  if (relatedJobs.length === 0) {
    container.innerHTML = '<p class="text-muted">No related jobs found.</p>';
    return;
  }

  container.innerHTML = relatedJobs
    .map((job) => createRelatedJobCard(job))
    .join("");
  updateIcons();

  // add event delegation for related cards (view details / bookmark)
  container.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const jobId = btn.dataset.jobId;
    if (!jobId) return;
    if (btn.classList.contains("view-related-btn")) {
      viewJobDetails(jobId);
    } else {
      toggleBookmark(jobId);
    }
  });
}

function createRelatedJobCard(job) {
  return `
    <div class="col-12 col-md-6 col-lg-4">
      <div class="card border-0 shadow-sm h-100 hover-card">
        <div class="card-body p-4">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <span class="badge bg-light text-dark small">${job.postedTime}</span>
            <button class="btn btn-link p-0 text-muted" data-job-id="${job.id}" aria-label="bookmark">
              <i data-lucide="bookmark" style="width: 18px; height: 18px;"></i>
            </button>
          </div>
          
          <div class="d-flex gap-2 mb-3">
            <img width="40" height="40" src="${job.logo}" alt="${job.company}" class="rounded flex-shrink-0">
            <div>
              <h5 class="h6 fw-bold mb-1">${job.title}</h5>
              <p class="text-muted small mb-0">${job.company}</p>
            </div>
          </div>
          
          <div class="d-flex flex-wrap gap-2 mb-3">
            <span class="small text-muted">
              <i data-lucide="briefcase" class="me-1" style="width: 14px; height: 14px;"></i> ${job.category}
            </span>
            <span class="small text-muted">
              <i data-lucide="map-pin" class="me-1" style="width: 14px; height: 14px;"></i> ${job.location}
            </span>
          </div>
          
          <button class="btn btn-teal w-100 btn-sm view-related-btn" data-job-id="${job.id}">
            View Details
          </button>
        </div>
      </div>
    </div>
  `;
}

function displayError() {
  const main = document.querySelector("main");
  if (!main) return;
  main.innerHTML = `
    <div class="container my-5">
      <div class="alert alert-danger" role="alert">
        <h4 class="alert-heading">Job Not Found</h4>
        <p>The job you're looking for doesn't exist or has been removed.</p>
        <hr>
        <a href="job-board.html" class="btn btn-primary">Back to Jobs</a>
      </div>
    </div>
  `;
}
