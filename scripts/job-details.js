document.addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector("main");
  const urlParams = new URLSearchParams(window.location.search);
  const jobIdParam = urlParams.get("id");
  const jobId = jobIdParam ? parseInt(jobIdParam, 10) : null;

  if (!jobId) {
    displayError();
    return;
  }

  const relatedJobsContainer = document.getElementById("related-jobs");
  let currentJobId = jobId;

  // Fetch jobs once
  fetch("../data/jobs-posting.json")
    .then((res) => {
      if (!res.ok) throw new Error("Network response not ok");
      return res.json();
    })
    .then((jobs) => {
      if (!Array.isArray(jobs) || jobs.length === 0) {
        displayError();
        return;
      }

      const currentJob = jobs.find((j) => j.id === jobId);
      if (!currentJob) {
        displayError();
        return;
      }

      currentJobId = currentJob.id;
      displayJobDetails(currentJob);
      renderRelatedJobs(currentJob, jobs);
      refreshIcons();
    })
    .catch((err) => {
      console.error("Failed to load jobs:", err);
      displayError();
    });

  // global bookmark handler (for inline onclick="toggleBookmark()")
  window.toggleBookmark = function (id) {
    const effectiveId = id || currentJobId;
    console.log("Bookmark toggled:", effectiveId);
  };

  // helpers
  function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  function displayJobDetails(job) {
    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };

    // page title + document title
    setText("page-title", job.title);
    document.title = `${job.title} - TiroAfrica`;

    // main logo
    const logo = document.getElementById("job-logo");
    if (logo) {
      logo.src = job.logo;
      logo.alt = `${job.company} logo`;
    }

    // basic fields
    setText("job-title", job.title);
    setText("job-company", job.company);
    setText("job-category", job.category);
    setText("job-type", job.type);
    setText("job-location", job.location);
    setText("job-posted", `Posted ${job.postedTime}`);

    const salaryEl = document.getElementById("job-salary");
    if (salaryEl) salaryEl.textContent = job.salary;

    // sidebar company logo + name
    const companyLogoSidebar = document.getElementById("company-logo-sidebar");
    if (companyLogoSidebar) {
      companyLogoSidebar.src = job.logo;
      companyLogoSidebar.alt = `${job.company} logo`;
    }
    setText("company-name", job.company);

    // skills / tags
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
      .map(
        (s) => `<span class="badge bg-light text-dark px-3 py-2">${s}</span>`
      )
      .join("");
  }

  function renderRelatedJobs(currentJob, allJobs) {
    if (!relatedJobsContainer) return;

    const relatedJobs = allJobs
      .filter(
        (job) =>
          job.category === currentJob.category && job.id !== currentJob.id
      )
      .slice(0, 3);

    if (relatedJobs.length === 0) {
      relatedJobsContainer.innerHTML =
        '<p class="text-muted">No related jobs found.</p>';
      return;
    }

    relatedJobsContainer.innerHTML = relatedJobs
      .map((job) => createRelatedJobCard(job))
      .join("");

    refreshIcons();

    // Event delegation for related job cards
    relatedJobsContainer.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      const relatedId = btn.dataset.jobId;
      if (!relatedId) return;

      if (btn.classList.contains("view-related-btn")) {
        viewJobDetails(relatedId);
      } else if (btn.getAttribute("aria-label") === "bookmark") {
        window.toggleBookmark(relatedId);
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

  function viewJobDetails(id) {
    window.location.href = `job-details.html?id=${id}`;
  }

  function displayError() {
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
});
