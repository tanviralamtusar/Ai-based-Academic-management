let currentUser = "";
let activeShell = null;
let openCourseId = null;
let openAssignmentId = null;
let openSubmissionId = null;


function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}


/* MOCK DATA */

const COURSES = {

    "web-eng": {
        title: "Web Engineering",
        teacher: "Mr. Rahman",
        term: "Fall 2026",
        syllabus: "This course covers modern front-end and back-end web development: HTML/CSS fundamentals, JavaScript, responsive design, REST APIs, and deployment. Weekly labs, a midterm, and a final group project.",
        materials: [
            {
                title: "Lecture 05 - Responsive Layouts",
                text: "Responsive layouts adapt to different screen sizes using flexible grids, relative units, and media queries. Flexbox and CSS Grid are the two main layout tools for building responsive interfaces. Media queries let you apply different styles below or above a given viewport width. Mobile-first design starts with the smallest screen and adds complexity as the viewport grows. Testing across real devices catches issues that a resized browser window can miss."
            },
            {
                title: "Lecture 06 - JavaScript DOM Basics",
                text: "The DOM represents an HTML document as a tree of nodes that JavaScript can read and modify. Methods like querySelector and addEventListener are the most common way to select elements and respond to user interaction. Changing an element's classList is usually safer than rewriting its style attribute directly. Event delegation lets a single listener handle events for many child elements, which is useful for dynamically created content. Keeping DOM updates batched avoids unnecessary layout recalculation."
            }
        ],
        announcements: [
            { title: "Midterm moved to next week", date: "Aug 15" },
            { title: "Lab 5 solutions posted", date: "Aug 10" }
        ],
        grades: [
            { item: "Assignment 1", score: "18/20" },
            { item: "Quiz 1", score: "9/10" },
            { item: "Midterm", score: "42/50" }
        ]
    },

    "db-mgmt": {
        title: "Database Management",
        teacher: "Ms. Akter",
        term: "Fall 2026",
        syllabus: "An introduction to relational database design and SQL: normalization, indexing, transactions, and query optimization. Includes a semester-long lab project building and querying a multi-table database.",
        materials: [
            {
                title: "Lecture 03 - Normalization",
                text: "Normalization reduces data redundancy by organizing tables around a single, well-defined purpose. First normal form removes repeating groups so every column holds a single value. Second normal form removes partial dependencies on part of a composite key. Third normal form removes columns that depend on other non-key columns rather than the key itself. Over-normalizing can hurt read performance, so real schemas often balance normalization with practical query needs."
            },
            {
                title: "Lecture 04 - SQL Joins",
                text: "Joins combine rows from two or more tables based on a related column, usually a foreign key. An inner join returns only rows that match in both tables. A left join returns every row from the left table plus matching rows from the right, filling unmatched columns with null. Understanding join order and indexing is essential for query performance on large tables. Common mistakes include joining on the wrong column or forgetting a join condition entirely, which produces a cartesian product."
            }
        ],
        announcements: [
            { title: "Lab 3 deadline extended by 2 days", date: "Aug 12" }
        ],
        grades: [
            { item: "Lab 1", score: "15/15" },
            { item: "Lab 2", score: "13/15" },
            { item: "Quiz 1", score: "8/10" }
        ]
    },

    "comp-net": {
        title: "Computer Networks",
        teacher: "Mr. Hasan",
        term: "Fall 2026",
        syllabus: "Covers the OSI and TCP/IP models, routing, switching, and network security fundamentals. Includes hands-on labs using packet capture tools to inspect real traffic.",
        materials: [
            {
                title: "Lecture 02 - TCP/IP Fundamentals",
                text: "The TCP/IP model organizes network communication into four layers: link, internet, transport, and application. TCP provides reliable, ordered delivery through acknowledgments and retransmission, while UDP trades reliability for lower overhead. IP addresses identify hosts on a network, and subnetting divides a network into smaller routable segments. Ports let a single IP address host many independent services at once. Understanding this layering is essential for diagnosing where a network problem is actually occurring."
            }
        ],
        announcements: [
            { title: "Midterm examination schedule updated", date: "Aug 9" }
        ],
        grades: [
            { item: "Assignment 1", score: "17/20" },
            { item: "Quiz 1", score: "9/10" }
        ]
    }

};

const TEACHER_COURSES = [
    { id: "web-eng", title: "Web Engineering", term: "Fall 2026", students: 32, description: "Modern front-end and back-end web development." },
    { id: "db-mgmt", title: "Database Management", term: "Fall 2026", students: 28, description: "Relational database design, SQL, and query optimization." }
];

const ASSIGNMENTS = [
    {
        id: "a1",
        title: "Web Engineering Assignment 2",
        course: "Web Engineering",
        due: "in 2 days",
        status: "not-started",
        description: "Build a responsive navigation bar component using CSS Flexbox that collapses into a menu on small screens."
    },
    {
        id: "a2",
        title: "Database Lab Report",
        course: "Database Management",
        due: "in 5 days",
        status: "not-started",
        description: "Write up your findings from Lab 3, including your normalized schema and three sample queries."
    },
    {
        id: "a3",
        title: "AI Project Proposal",
        course: "AI Fundamentals",
        due: "in 1 week",
        status: "not-started",
        description: "Submit a one-page proposal describing the problem, dataset, and approach for your term project."
    },
    {
        id: "a4",
        title: "Networks Quiz Reflection",
        course: "Computer Networks",
        due: "Aug 10",
        status: "graded",
        description: "Short reflection on the TCP/IP quiz results.",
        grade: "9/10"
    },
    {
        id: "a5",
        title: "Web Engineering Assignment 1",
        course: "Web Engineering",
        due: "Aug 5",
        status: "submitted",
        description: "Build a static landing page using semantic HTML."
    }
];

const GRADING_QUEUE = [
    { id: "s1", student: "Fahim Rahman", assignment: "Assignment 2", course: "Web Engineering", status: "pending" },
    { id: "s2", student: "Nusrat Jahan", assignment: "Assignment 2", course: "Web Engineering", status: "pending" },
    { id: "s3", student: "Tanvir Alam", assignment: "Lab 3 Report", course: "Database Management", status: "pending" },
    { id: "s4", student: "Mehrab Ahmed", assignment: "Lab 3 Report", course: "Database Management", status: "returned" }
];

const ANNOUNCEMENTS = [
    { title: "Midterm schedule posted", body: "Check the course page for your midterm date and room assignment.", audience: "All Classes", date: "Aug 9" }
];


/* GREETING */

function getGreeting() {

    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";

    return "Good evening";
}


/* HELPERS */

function statusLabel(status) {

    const labels = {
        "not-started": "Not Started",
        submitted: "Submitted",
        graded: "Graded"
    };

    return labels[status] || status;
}

function emptyStateHtml(title, message) {

    return `
        <div class="empty-state">
            <svg class="icon"><use href="#icon-clipboard"></use></svg>
            <strong>${escapeHtml(title)}</strong>
            <p>${escapeHtml(message)}</p>
        </div>
    `;
}

function showToast(message) {

    const container = document.getElementById("toastContainer");

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => toast.classList.add("toast-visible"), 10);

    setTimeout(() => {
        toast.classList.remove("toast-visible");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}


/* LOGIN / LOGOUT */

function login() {

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;
    const message = document.getElementById("loginMessage");

    if (!username || !password) {
        message.innerText = "Please enter username and password.";
        return;
    }

    message.innerText = "";
    currentUser = username;

    if (role === "admin") {
        document.getElementById("loginPage").classList.add("hidden");
        document.getElementById("adminPlaceholder").classList.remove("hidden");
        return;
    }

    activeShell = document.getElementById(role === "teacher" ? "teacherApp" : "studentApp");

    document.getElementById("loginPage").classList.add("hidden");
    activeShell.classList.remove("hidden");

    activeShell.querySelector(".user-role").textContent =
        role.charAt(0).toUpperCase() + role.slice(1);

    activeShell.querySelector(".user-avatar").textContent =
        username.charAt(0).toUpperCase();

    if (role === "teacher") {
        renderGradingQueue();
        renderAnnouncements();
        renderTeacherDashboardSubmissions();
    } else {
        renderAssignments();
    }

    showPage("dashboard");
}

function logout() {

    document.querySelectorAll(".app").forEach(el => el.classList.add("hidden"));
    document.getElementById("adminPlaceholder").classList.add("hidden");
    document.getElementById("loginPage").classList.remove("hidden");

    document.getElementById("username").value = "";
    document.getElementById("password").value = "";

    activeShell = null;
}


/* PAGE NAVIGATION */

function showPage(pageName, options) {

    if (!activeShell) return;

    options = options || {};

    activeShell.querySelectorAll(".page").forEach(page => {
        page.classList.add("hidden");
    });

    const target = activeShell.querySelector(`.page[data-page="${pageName}"]`);
    if (target) target.classList.remove("hidden");

    const navItems = activeShell.querySelectorAll(".nav-item[data-page]");
    const hasNavMatch = Array.from(navItems).some(btn => btn.dataset.page === pageName);

    if (hasNavMatch) {
        navItems.forEach(btn => {
            btn.classList.toggle("active", btn.dataset.page === pageName);
        });
    }

    const titleEl = activeShell.querySelector(".page-title");
    const subtitleEl = activeShell.querySelector(".welcome-text");

    if (pageName === "dashboard" && !options.title) {

        titleEl.textContent = `${getGreeting()}, ${currentUser} `;

        const wave = document.createElement("span");
        wave.className = "wave";
        wave.textContent = "👋";
        titleEl.appendChild(wave);

        subtitleEl.textContent = "Here's what's happening today.";

    } else {

        const navItem = activeShell.querySelector(`.nav-item[data-page="${pageName}"]`);

        titleEl.textContent = options.title || (navItem ? navItem.dataset.title : "");
        subtitleEl.textContent = options.subtitle || ("Welcome, " + currentUser + "!");
    }
}


/* COURSE DETAIL + AI SUMMARIZER */

function openCourseDetail(courseId) {

    const course = COURSES[courseId];
    if (!course) return;

    openCourseId = courseId;

    activeShell.querySelector(".course-detail-title").textContent = course.title;
    activeShell.querySelector(".course-detail-meta").textContent = `${course.teacher} • ${course.term}`;
    activeShell.querySelector(".course-detail-syllabus").textContent = course.syllabus;

    activeShell.querySelector(".course-detail-materials").innerHTML =
        course.materials.map((material, index) => `
            <div class="material-block">
                <div class="material">
                    <span class="material-name">
                        <svg class="icon"><use href="#icon-materials"></use></svg>
                        ${escapeHtml(material.title)}
                    </span>
                    <button class="btn btn-ghost" data-action="summarizeMaterial" data-material-index="${index}">
                        <svg class="icon"><use href="#icon-ai"></use></svg>
                        Summarize with AI
                    </button>
                </div>
                <div class="material-summary hidden" data-material-index="${index}"></div>
            </div>
        `).join("");

    activeShell.querySelector(".course-detail-announcements").innerHTML =
        course.announcements.map(a => `
            <div class="notification">
                <svg class="icon"><use href="#icon-megaphone"></use></svg>
                <div>
                    <strong>${escapeHtml(a.title)}</strong>
                    <div class="meta">${escapeHtml(a.date)}</div>
                </div>
            </div>
        `).join("");

    activeShell.querySelector(".course-detail-grades").innerHTML = `
        <table>
            <thead><tr><th>Item</th><th>Score</th></tr></thead>
            <tbody>
                ${course.grades.map(g => `<tr><td>${escapeHtml(g.item)}</td><td>${escapeHtml(g.score)}</td></tr>`).join("")}
            </tbody>
        </table>
    `;

    const tabsWrapper = activeShell.querySelector(".tabs-wrapper");
    tabsWrapper.querySelectorAll("[data-action=\"switchTab\"]").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.tab === "syllabus");
    });
    tabsWrapper.querySelectorAll("[data-tab-content]").forEach(content => {
        content.classList.toggle("hidden", content.dataset.tabContent !== "syllabus");
    });

    showPage("course-detail", { title: course.title, subtitle: "Syllabus, materials, and grades" });
}

function summarizeMaterial(btn) {

    const index = btn.dataset.materialIndex;
    const material = COURSES[openCourseId].materials[index];
    const summaryEl = btn.closest(".material-block").querySelector(".material-summary");

    summaryEl.classList.remove("hidden");
    summaryEl.innerHTML = `<p class="summary-loading">Generating summary...</p>`;

    setTimeout(() => renderMaterialSummary(summaryEl, material, "short"), 700);
}

function toggleSummaryLength(btn) {

    const summaryEl = btn.closest(".material-summary");
    const material = COURSES[openCourseId].materials[summaryEl.dataset.materialIndex];
    const nextLength = summaryEl.dataset.length === "detailed" ? "short" : "detailed";

    renderMaterialSummary(summaryEl, material, nextLength);
}

function renderMaterialSummary(summaryEl, material, length) {

    const sentences = material.text.split(".").filter(sentence => sentence.trim().length > 0);
    const count = length === "detailed" ? 5 : 2;
    const summary = sentences.slice(0, count).join(". ") + ".";

    summaryEl.dataset.length = length;

    summaryEl.innerHTML = `
        <strong>AI Summary</strong>
        <span class="tag tag--purple">${length === "detailed" ? "Detailed" : "Short"}</span>
        <br><br>
        ${escapeHtml(summary)}
        <div class="summary-actions">
            <button class="btn btn-ghost btn-sm" data-action="toggleSummaryLength">
                Show ${length === "detailed" ? "shorter" : "more detailed"} summary
            </button>
        </div>
    `;
}

function switchTab(btn) {

    const wrapper = btn.closest(".tabs-wrapper");

    wrapper.querySelectorAll("[data-action=\"switchTab\"]").forEach(b => {
        b.classList.toggle("active", b === btn);
    });

    wrapper.querySelectorAll("[data-tab-content]").forEach(content => {
        content.classList.toggle("hidden", content.dataset.tabContent !== btn.dataset.tab);
    });
}


/* ASSIGNMENTS */

function renderAssignments() {

    const container = activeShell.querySelector(".assignments-list");
    if (!container) return;

    if (ASSIGNMENTS.length === 0) {
        container.innerHTML = emptyStateHtml("No assignments yet", "Your teacher hasn't posted any assignments.");
        return;
    }

    container.innerHTML = ASSIGNMENTS.map(a => `
        <button class="list-row" data-action="viewAssignment" data-assignment-id="${a.id}">
            <div class="list-row-main">
                <div class="title">${escapeHtml(a.title)}</div>
                <div class="meta">${escapeHtml(a.course)} • Due ${escapeHtml(a.due)}</div>
            </div>
            <span class="badge badge--${a.status}">${statusLabel(a.status)}</span>
        </button>
    `).join("");
}

function openAssignmentDetail(id) {

    const assignment = ASSIGNMENTS.find(a => a.id === id);
    if (!assignment) return;

    openAssignmentId = id;

    const content = activeShell.querySelector(".assignment-detail-content");

    if (assignment.status === "not-started") {

        content.innerHTML = `
            <h3>${escapeHtml(assignment.title)}</h3>
            <p class="meta">${escapeHtml(assignment.course)} • Due ${escapeHtml(assignment.due)}</p>
            <p>${escapeHtml(assignment.description)}</p>

            <div class="field-group">
                <label for="assignmentAnswer">Your answer</label>
                <textarea class="field" id="assignmentAnswer" placeholder="Write your answer here..."></textarea>
            </div>

            <div class="field-group">
                <label for="assignmentFile">Attach a file (optional)</label>
                <input class="field" type="file" id="assignmentFile">
            </div>

            <button class="btn btn-primary" data-action="submitAssignment">Submit Assignment</button>
        `;

    } else {

        const statusText = assignment.status === "graded"
            ? `Graded — ${escapeHtml(assignment.grade || "")}`
            : "Your submission has been received and is awaiting grading.";

        content.innerHTML = `
            <h3>${escapeHtml(assignment.title)}</h3>
            <p class="meta">${escapeHtml(assignment.course)} • Due ${escapeHtml(assignment.due)}</p>
            <span class="badge badge--${assignment.status}">${statusLabel(assignment.status)}</span>
            <p style="margin-top: var(--space-4);">${statusText}</p>
        `;
    }

    showPage("assignment-detail", { title: assignment.title, subtitle: assignment.course });
}

function submitAssignment() {

    const assignment = ASSIGNMENTS.find(a => a.id === openAssignmentId);
    if (!assignment) return;

    assignment.status = "submitted";

    showToast("Assignment submitted");
    renderAssignments();
    openAssignmentDetail(openAssignmentId);
}


/* TEACHER: COURSE BUILDER */

function editCourse(courseId) {

    const course = TEACHER_COURSES.find(c => c.id === courseId);
    if (!course) return;

    const form = activeShell.querySelector(".course-builder-form");
    form.classList.remove("hidden");

    form.querySelector("#courseTitle").value = course.title;
    form.querySelector("#courseTerm").value = course.term;
    form.querySelector("#courseDescription").value = course.description;

    form.scrollIntoView({ behavior: "smooth", block: "nearest" });
}


/* TEACHER: GRADING */

function renderGradingQueue() {

    const container = activeShell.querySelector(".grading-queue");
    if (!container) return;

    if (GRADING_QUEUE.length === 0) {
        container.innerHTML = emptyStateHtml("Queue is empty", "Nothing waiting to be graded right now.");
        return;
    }

    container.innerHTML = GRADING_QUEUE.map(g => `
        <div class="list-row-wrapper">
            <input type="checkbox" class="grading-checkbox" data-submission-id="${g.id}">
            <button class="list-row-main" data-action="openGrading" data-submission-id="${g.id}">
                <div class="title">${escapeHtml(g.student)}</div>
                <div class="meta">${escapeHtml(g.assignment)} • ${escapeHtml(g.course)}</div>
            </button>
            <span class="badge badge--${g.status === "returned" ? "graded" : "pending"}">
                ${g.status === "returned" ? "Returned" : "Pending"}
            </span>
        </div>
    `).join("");
}

function openGradingDetail(id) {

    const submission = GRADING_QUEUE.find(g => g.id === id);
    if (!submission) return;

    openSubmissionId = id;

    const content = activeShell.querySelector(".grading-detail-content");

    content.innerHTML = `
        <h3>${escapeHtml(submission.student)}</h3>
        <p class="meta">${escapeHtml(submission.assignment)} • ${escapeHtml(submission.course)}</p>

        <div class="rubric">
            <div class="rubric-row">
                <span>Content &amp; Accuracy</span>
                <input class="field rubric-input" type="number" min="0" max="10" value="8">
            </div>
            <div class="rubric-row">
                <span>Code Quality</span>
                <input class="field rubric-input" type="number" min="0" max="10" value="7">
            </div>
            <div class="rubric-row">
                <span>Presentation</span>
                <input class="field rubric-input" type="number" min="0" max="5" value="4">
            </div>
        </div>

        <div class="field-group">
            <label for="gradingFeedback">Feedback</label>
            <textarea class="field" id="gradingFeedback" placeholder="Leave feedback for the student..."></textarea>
        </div>

        <button class="btn btn-primary" data-action="returnGrade">Return Grade</button>
    `;

    showPage("grading-detail", { title: submission.student, subtitle: submission.assignment });
}

function returnGrade() {

    const submission = GRADING_QUEUE.find(g => g.id === openSubmissionId);
    if (!submission) return;

    submission.status = "returned";

    showToast("Grade returned to " + submission.student);
    renderGradingQueue();
    showPage("grading");
}

function bulkReturn() {

    const checked = activeShell.querySelectorAll(".grading-checkbox:checked");

    if (checked.length === 0) {
        showToast("Select at least one submission first");
        return;
    }

    checked.forEach(checkbox => {
        const submission = GRADING_QUEUE.find(g => g.id === checkbox.dataset.submissionId);
        if (submission) submission.status = "returned";
    });

    showToast(`${checked.length} grade(s) returned`);
    renderGradingQueue();
}

function renderTeacherDashboardSubmissions() {

    const container = activeShell.querySelector(".teacher-dashboard-submissions");
    if (!container) return;

    const pending = GRADING_QUEUE.filter(g => g.status === "pending");

    if (pending.length === 0) {
        container.innerHTML = emptyStateHtml("All caught up", "No submissions are waiting on you right now.");
        return;
    }

    container.innerHTML = pending.map(g => `
        <div class="activity-item">
            <span class="activity-icon activity-icon--blue">
                <svg class="icon"><use href="#icon-clipboard"></use></svg>
            </span>
            <div class="activity-body">
                <div class="title">${escapeHtml(g.student)} submitted ${escapeHtml(g.assignment)}</div>
                <div class="meta">${escapeHtml(g.course)}</div>
            </div>
        </div>
    `).join("");
}


/* TEACHER: ANNOUNCEMENTS */

function sendAnnouncement() {

    const titleInput = document.getElementById("announcementTitle");
    const bodyInput = document.getElementById("announcementBody");
    const audienceInput = document.getElementById("announcementAudience");

    if (!titleInput.value || !bodyInput.value) {
        showToast("Please fill in a title and message");
        return;
    }

    ANNOUNCEMENTS.unshift({
        title: titleInput.value,
        body: bodyInput.value,
        audience: audienceInput.value,
        date: "Just now"
    });

    titleInput.value = "";
    bodyInput.value = "";

    renderAnnouncements();
    showToast("Announcement sent");
}

function renderAnnouncements() {

    const container = activeShell.querySelector(".announcements-sent");
    if (!container) return;

    container.innerHTML = ANNOUNCEMENTS.map(a => `
        <div class="notification">
            <svg class="icon"><use href="#icon-megaphone"></use></svg>
            <div>
                <strong>${escapeHtml(a.title)}</strong>
                <div class="meta">${escapeHtml(a.audience)} • ${escapeHtml(a.date)}</div>
                <p>${escapeHtml(a.body)}</p>
            </div>
        </div>
    `).join("");
}


/* SETTINGS */

function saveSettings() {
    showToast("Settings saved");
}


/* AI SUMMARIZER DEMO (roommate finder uses this pattern too) */

function findRoommate() {

    const location = document.getElementById("location").value;
    const preference = document.getElementById("studyPreference").value;
    const result = document.getElementById("roommateResult");

    if (!location) {
        result.innerHTML = "<p>Please enter hostel/location.</p>";
        return;
    }

    result.innerHTML = `

        <div class="panel">

            <h3>Potential Roommate</h3>

            <p>
                <strong>Name:</strong>
                Ahmed Hasan
            </p>

            <p>
                <strong>Hostel:</strong>
                ${escapeHtml(location)}
            </p>

            <p>
                <strong>Preference:</strong>
                ${escapeHtml(preference)}
            </p>

            <br>

            <button class="btn btn-ghost">
                <svg class="icon"><use href="#icon-send"></use></svg>
                Send Request
            </button>

        </div>

    `;
}


/* DROPZONE */

function initDropzone() {

    document.querySelectorAll(".dropzone").forEach(zone => {

        zone.addEventListener("dragover", e => {
            e.preventDefault();
            zone.classList.add("dropzone-active");
        });

        zone.addEventListener("dragleave", () => {
            zone.classList.remove("dropzone-active");
        });

        zone.addEventListener("drop", e => {
            e.preventDefault();
            zone.classList.remove("dropzone-active");
            showToast("File added (demo only)");
        });
    });
}


/* ACTION ROUTING */

function handleAction(el) {

    const action = el.dataset.action;

    switch (action) {
        case "login": login(); break;
        case "logout": logout(); break;
        case "findRoommate": findRoommate(); break;
        case "viewCourse": openCourseDetail(el.dataset.courseId); break;
        case "backToCourses": showPage("courses"); break;
        case "viewAssignment": openAssignmentDetail(el.dataset.assignmentId); break;
        case "backToAssignments": showPage("assignments"); break;
        case "submitAssignment": submitAssignment(); break;
        case "saveSettings": saveSettings(); break;
        case "editCourse": editCourse(el.dataset.courseId); break;
        case "openGrading": openGradingDetail(el.dataset.submissionId); break;
        case "backToGrading": showPage("grading"); break;
        case "returnGrade": returnGrade(); break;
        case "bulkReturn": bulkReturn(); break;
        case "sendAnnouncement": sendAnnouncement(); break;
        case "switchTab": switchTab(el); break;
        case "summarizeMaterial": summarizeMaterial(el); break;
        case "toggleSummaryLength": toggleSummaryLength(el); break;
        case "switchToGradingPage": showPage("grading"); break;
    }
}

document.addEventListener("click", e => {

    const navBtn = e.target.closest(".nav-item[data-page]");

    if (navBtn) {
        showPage(navBtn.dataset.page);
        return;
    }

    const actionEl = e.target.closest("[data-action]");

    if (actionEl) {
        handleAction(actionEl);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    initDropzone();
});
