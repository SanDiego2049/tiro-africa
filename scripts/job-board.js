document.addEventListener("DOMContentLoaded", () => {
  const jobListElement = document.getElementById("job-list");
  const paginationEl = document.getElementById("pagination");
  const resultsCountEl = document.getElementById("results-count");

  let allJobs = [];
  let currentPage = 1;
  const jobsPerPage = 6;

  // Load jobs from jobsData
  if (typeof jobsData === 'undefined' || !Array.isArray(jobsData) || jobsData.length === 0) {
    jobListElement.innerHTML = `
      <div class="alert alert-warning" role="alert">
        <h4 class="alert-heading">No Jobs Available</h4>
        <p>No job postings available at the moment. Please check back later.</p>
      </div>
    `;
    return;
  }

  allJobs = jobsData;
  render();

  function render() {
    displayJobs();
    updatePagination();
    updateResultsCount();
    refreshIcons();
  }

  function displayJobs() {
    const startIndex = (currentPage - 1) * jobsPerPage;
    const endIndex = startIndex + jobsPerPage;
    const jobsToDisplay = allJobs.slice(startIndex, endIndex);

    jobListElement.innerHTML = jobsToDisplay.map(createJobCard).join("");
  }

  function createJobCard(job) {
    const {
      id,
      postedTime,
      logo,
      company,
      title,
      category,
      type,
      salary,
      location,
    } = job;

    return `
      <div class="job-card p-3 p-md-4 mb-3 mb-md-4 rounded shadow-sm bg-white">
        <div class="d-flex justify-content-between align-items-start mb-3">
          <span class="badge bg-light text-dark small">${postedTime}</span>
          <button class="btn btn-link p-0 text-muted" data-job-id="${id}" aria-label="bookmark">
            <i data-lucide="bookmark" style="width: 20px; height: 20px;"></i>
          </button>
        </div>

        <div class="d-flex flex-column flex-md-row justify-content-between gap-3">
          <div class="flex-grow-1">
            <div class="d-flex gap-2 mb-2">
              <img width="40" height="40" src="${logo}" alt="logo for ${company}" class="rounded flex-shrink-0">
              <div>
                <h5 class="fw-bold mb-1 fs-6 fs-md-5">${title}</h5>
                <p class="text-muted small mb-0">${company}</p>
              </div>
            </div>

            <div class="d-flex flex-wrap gap-2 gap-md-3 mt-3">
              <span class="small text-muted text-nowrap">
                <i data-lucide="briefcase" class="me-1" style="width: 16px; height: 16px;"></i> ${category}
              </span>
              <span class="small text-muted text-nowrap">
                <i data-lucide="clock" class="me-1" style="width: 16px; height: 16px;"></i> ${type}
              </span>
              <span class="small text-muted text-nowrap">
                <i data-lucide="wallet" class="me-1" style="width: 16px; height: 16px;"></i> ${salary}
              </span>
              <span class="small text-muted text-nowrap">
                <i data-lucide="map-pin" class="me-1" style="width: 16px; height: 16px;"></i> ${location}
              </span>
            </div>
          </div>

          <div class="flex-shrink-0 d-flex align-items-start">
            <button class="btn btn-teal px-3 px-md-4 w-100 w-md-auto text-nowrap view-details-btn" data-job-id="${id}">
              Job Details
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function updatePagination() {
    const totalPages = Math.ceil(allJobs.length / jobsPerPage);
    let html = "";

    if (currentPage > 1) {
      html += `
        <button class="btn btn-outline-secondary px-3 px-md-4 prev-btn">
          <i data-lucide="chevron-left" style="width: 16px; height: 16px;"></i> Previous
        </button>
      `;
    }

    for (let i = 1; i <= totalPages; i++) {
      if (i === currentPage) {
        html += `<button class="btn btn-teal px-3 px-md-4 active-page">${i}</button>`;
      } else {
        html += `<button class="btn btn-outline-secondary px-3 px-md-4 page-btn" data-page="${i}">${i}</button>`;
      }
    }

    if (currentPage < totalPages) {
      html += `
        <button class="btn btn-outline-secondary px-3 px-md-4 next-btn">
          Next <i data-lucide="chevron-right" style="width: 16px; height: 16px;"></i>
        </button>
      `;
    }

    paginationEl.innerHTML = html;

    const prevBtn = paginationEl.querySelector(".prev-btn");
    const nextBtn = paginationEl.querySelector(".next-btn");

    if (prevBtn)
      prevBtn.addEventListener("click", () => changePage(currentPage - 1));
    if (nextBtn)
      nextBtn.addEventListener("click", () => changePage(currentPage + 1));

    paginationEl.querySelectorAll(".page-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const page = parseInt(btn.dataset.page, 10);
        changePage(page);
      });
    });
  }

  function changePage(page) {
    currentPage = page;
    displayJobs();
    updatePagination();
    updateResultsCount();
    refreshIcons();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateResultsCount() {
    if (!resultsCountEl) return;
    const startIndex = (currentPage - 1) * jobsPerPage + 1;
    const endIndex = Math.min(currentPage * jobsPerPage, allJobs.length);
    resultsCountEl.textContent = `Showing ${startIndex}-${endIndex} of ${allJobs.length} results`;
  }

  function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  // Delegated click handlers for job list (bookmark + details)
  jobListElement.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const jobId = btn.dataset.jobId;
    if (!jobId) return;

    if (btn.classList.contains("view-details-btn")) {
      window.location.href = `job-details.html?id=${jobId}`;
      return;
    }

    if (btn.getAttribute("aria-label") === "bookmark") {
      console.log("Bookmark toggled:", jobId);
    }
  });
});
