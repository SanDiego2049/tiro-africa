// job-board.js - job listing page (depends on main.js)
// Corrected: added displayError() and stronger DOM guards

onReady(async () => {
  const jobListEl = document.getElementById("job-list");
  const paginationEl = document.getElementById("pagination");
  const resultsCountEl =
    document.getElementById("results-count") ||
    document.getElementById("resultCount");

  // page state (kept local)
  let allJobs = [];
  let currentPage = 1;
  const jobsPerPage = 6;

  // Local displayError fallback (was missing)
  function displayError() {
    if (jobListEl) {
      jobListEl.innerHTML = `
        <div class="alert alert-danger" role="alert">
          <h4 class="alert-heading">Error Loading Jobs</h4>
          <p>Unable to load job listings. Please try again later.</p>
        </div>
      `;
    } else {
      // If jobListEl isn't present, try inserting into main as a fallback
      const main = document.querySelector("main") || document.body;
      const wrapper = document.createElement("div");
      wrapper.className = "container my-5";
      wrapper.innerHTML = `
        <div class="alert alert-danger" role="alert">
          <h4 class="alert-heading">Error Loading Jobs</h4>
          <p>Unable to load job listings. Please try again later.</p>
        </div>
      `;
      main.appendChild(wrapper);
    }
  }

  try {
    allJobs = await fetchJobs(); // shared cached fetch in main.js
    if (!Array.isArray(allJobs) || allJobs.length === 0) {
      // no jobs — show friendly message
      if (jobListEl) {
        jobListEl.innerHTML = `<p class="text-muted">No job postings available at the moment.</p>`;
      }
      return;
    }
    render();
  } catch (err) {
    console.error("Failed to load jobs:", err);
    displayError();
    return;
  }

  function render() {
    displayJobs();
    updatePagination();
    updateResultsCount();
    updateIcons();
  }

  function displayJobs() {
    if (!jobListEl) return;
    const startIndex = (currentPage - 1) * jobsPerPage;
    const endIndex = startIndex + jobsPerPage;
    const jobsToDisplay = allJobs.slice(startIndex, endIndex);

    jobListEl.innerHTML = jobsToDisplay.map(createJobCard).join("");
    updateIcons();
  }

  function createJobCard(job) {
    // guard job fields so generation doesn't throw
    const id = job && job.id != null ? job.id : "";
    const postedTime = job && job.postedTime ? job.postedTime : "";
    const logo = job && job.logo ? job.logo : "";
    const company = job && job.company ? job.company : "";
    const title = job && job.title ? job.title : "";
    const category = job && job.category ? job.category : "";
    const type = job && job.type ? job.type : "";
    const salary = job && job.salary ? job.salary : "";
    const location = job && job.location ? job.location : "";

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

  // --- Pagination / controls ---
  function updatePagination() {
    if (!paginationEl) return;
    const totalPages = Math.ceil(allJobs.length / jobsPerPage);
    let html = "";

    if (currentPage > 1) {
      html += `<button class="btn btn-outline-secondary px-3 px-md-4 prev-btn"> <i data-lucide="chevron-left" style="width: 16px; height: 16px;"></i> Previous</button>`;
    }

    for (let i = 1; i <= totalPages; i++) {
      if (i === currentPage) {
        html += `<button class="btn btn-teal px-3 px-md-4 active-page">${i}</button>`;
      } else {
        html += `<button class="btn btn-outline-secondary px-3 px-md-4 page-btn" data-page="${i}">${i}</button>`;
      }
    }

    if (currentPage < totalPages) {
      html += `<button class="btn btn-outline-secondary px-3 px-md-4 next-btn">Next <i data-lucide="chevron-right" style="width: 16px; height: 16px;"></i></button>`;
    }

    paginationEl.innerHTML = html;
    updateIcons();

    // Attach listeners
    const prev = paginationEl.querySelector(".prev-btn");
    const next = paginationEl.querySelector(".next-btn");
    if (prev) prev.addEventListener("click", () => changePage(currentPage - 1));
    if (next) next.addEventListener("click", () => changePage(currentPage + 1));
    paginationEl.querySelectorAll(".page-btn").forEach((btn) => {
      btn.addEventListener("click", () =>
        changePage(parseInt(btn.dataset.page, 10))
      );
    });
  }

  function changePage(page) {
    currentPage = page;
    displayJobs();
    updatePagination();
    updateResultsCount();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateResultsCount() {
    if (!resultsCountEl) return;
    const startIndex = (currentPage - 1) * jobsPerPage + 1;
    const endIndex = Math.min(currentPage * jobsPerPage, allJobs.length);
    resultsCountEl.textContent = `Showing ${startIndex}-${endIndex} of ${allJobs.length} results`;
  }

  // Delegated listeners for job-list actions (bookmark, view details)
  if (jobListEl) {
    jobListEl.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const jobId = btn.dataset.jobId;
      if (!jobId) return;

      if (btn.classList.contains("view-details-btn")) {
        viewJobDetails(jobId);
        return;
      }

      // bookmark button (aria-label or presence of bookmark icon)
      if (
        btn.getAttribute("aria-label") === "bookmark" ||
        btn.querySelector('i[data-lucide="bookmark"]')
      ) {
        toggleBookmark(jobId);
      }
    });
  }
});
