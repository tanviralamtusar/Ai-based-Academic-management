let currentUser = "";


function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}


/* LOGIN */

function login() {

    const username =
        document.getElementById("username").value;

    const password =
        document.getElementById("password").value;

    const role =
        document.getElementById("role").value;

    const message =
        document.getElementById("loginMessage");


    if (!username || !password) {

        message.innerText =
            "Please enter username and password.";

        return;
    }

    message.innerText = "";


    currentUser = username;

    document.getElementById("loginPage")
        .classList.add("hidden");

    document.getElementById("app")
        .classList.remove("hidden");


    document.getElementById("userRole")
        .innerText =
        role.charAt(0).toUpperCase() +
        role.slice(1);

    document.getElementById("userAvatar")
        .innerText =
        username.charAt(0).toUpperCase();


    showPage("dashboard");
}


/* GREETING */

function getGreeting() {

    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";

    return "Good evening";
}


/* PAGE NAVIGATION */

function showPage(pageName) {

    const pages =
        document.querySelectorAll(".page");

    pages.forEach(page => {

        page.classList.add("hidden");

    });


    document
        .getElementById(pageName)
        .classList.remove("hidden");


    document
        .querySelectorAll("[data-page]")
        .forEach(button => {
            button.classList.toggle(
                "active",
                button.dataset.page === pageName
            );
        });


    const titles = {

        dashboard: "Dashboard",

        courses: "Courses",

        progress: "Student Progress",

        materials: "Study Materials",

        ai: "AI Study Assistant",

        roommate: "Roommate Finder",

        notifications: "Notifications"

    };


    const pageTitle =
        document.getElementById("pageTitle");

    const welcomeText =
        document.getElementById("welcomeText");


    if (pageName === "dashboard") {

        pageTitle.textContent =
            `${getGreeting()}, ${currentUser} `;

        const wave = document.createElement("span");
        wave.className = "wave";
        wave.textContent = "👋";
        pageTitle.appendChild(wave);

        welcomeText.textContent =
            "Here's what's happening with your studies today.";

    } else {

        pageTitle.textContent = titles[pageName];

        welcomeText.textContent =
            "Welcome, " + currentUser + "!";
    }
}


/* LOGOUT */

function logout() {

    document
        .getElementById("app")
        .classList.add("hidden");

    document
        .getElementById("loginPage")
        .classList.remove("hidden");

    document
        .getElementById("username")
        .value = "";

    document
        .getElementById("password")
        .value = "";
}


/* AI SUMMARIZER DEMO */

function summarize() {

    const text =
        document.getElementById("studyText").value;

    const result =
        document.getElementById("summary");


    if (!text) {

        result.innerText =
            "Please enter study material first.";

        return;
    }


    /*
        This is only a frontend demo.

        Later this function will send the text
        to your backend and then to an AI API.
    */


    const sentences =
        text.split(".")
            .filter(sentence =>
                sentence.trim().length > 0
            );


    const summary =
        sentences.slice(0, 3).join(". ") + ".";


    result.innerHTML =
        "<strong>AI Summary:</strong><br><br>" +
        escapeHtml(summary);
}


/* ROOMMATE FINDER */

function findRoommate() {

    const location =
        document.getElementById("location").value;

    const preference =
        document.getElementById(
            "studyPreference"
        ).value;


    const result =
        document.getElementById(
            "roommateResult"
        );


    if (!location) {

        result.innerHTML =
            "<p>Please enter hostel/location.</p>";

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


/* EVENT WIRING */

function initNav() {

    document
        .querySelectorAll("[data-page]")
        .forEach(button => {
            button.addEventListener("click", () =>
                showPage(button.dataset.page)
            );
        });
}

function initActions() {

    const actions = {
        login: login,
        logout: logout,
        summarize: summarize,
        findRoommate: findRoommate
    };

    document
        .querySelectorAll("[data-action]")
        .forEach(el => {
            const handler = actions[el.dataset.action];

            if (handler) {
                el.addEventListener("click", handler);
            }
        });
}

document.addEventListener("DOMContentLoaded", () => {
    initNav();
    initActions();
});
