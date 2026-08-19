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


    currentUser = username;

    document.getElementById("loginPage")
        .classList.add("hidden");

    document.getElementById("app")
        .classList.remove("hidden");


    document.getElementById("userRole")
        .innerText =
        role.charAt(0).toUpperCase() +
        role.slice(1);


    document.getElementById("welcomeText")
        .innerText =
        "Welcome, " + username + "!";


    showPage("dashboard");
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


    const titles = {

        dashboard: "Dashboard",

        courses: "Courses",

        progress: "Student Progress",

        materials: "Study Materials",

        ai: "AI Study Assistant",

        roommate: "Roommate Finder",

        notifications: "Notifications"

    };


    document.getElementById("pageTitle")
        .innerText =
        titles[pageName];
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

            <button>
                Send Request
            </button>

        </div>

    `;
}