const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

async function search(location) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=7d77b96c972b4d119a3151101212704&q=${location}&days=3`);
        if (response.ok) {
            const data = await response.json();
            displayCurrent(data.location, data.current);
            displayAnother(data.forecast.forecastday);
        } else {
            console.error("Error fetching weather data:", response.status);
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

function displayCurrent(location, current) {
    const date = new Date(current.last_updated.replace(" ", "T"));
    const html = `
        <div class="today forecast">
            <div class="forecast-header" id="today">
                <div class="day">${days[date.getDay()]}</div>
                <div class="date">${date.getDate()} ${monthNames[date.getMonth()]}</div>
            </div>
            <div class="forecast-content" id="current">
                <div class="location">${location.name}</div>
                <div class="degree">
                    <div class="num">${current.temp_c}<sup>o</sup>C</div>
                    <div class="forecast-icon">
                        <img src="https:${current.condition.icon}" alt="" width="90">
                    </div>
                </div>
                <div class="custom">${current.condition.text}</div>
                <span><img src="images/icon-umberella.png" alt="">20%</span>
                <span><img src="images/icon-wind.png" alt="">18km/h</span>
                <span><img src="images/icon-compass.png" alt="">East</span>
            </div>
        </div>`;
    document.getElementById("forecast").innerHTML = html;
}

function displayAnother(forecastDays) {
    const forecastHTML = forecastDays.slice(1).map(day => {
        const date = new Date(day.date.replace(" ", "T"));
        return `
            <div class="forecast">
                <div class="forecast-header">
                    <div class="day">${days[date.getDay()]}</div>
                </div>
                <div class="forecast-content">
                    <div class="forecast-icon">
                        <img src="https:${day.day.condition.icon}" alt="" width="48">
                    </div>
                    <div class="degree">${day.day.maxtemp_c}<sup>o</sup>C</div>
                    <small>${day.day.mintemp_c}<sup>o</sup></small>
                    <div class="custom">${day.day.condition.text}</div>
                </div>
            </div>`;
    }).join("");
    document.getElementById("forecast").innerHTML += forecastHTML;
}

document.getElementById("search").addEventListener("keyup", (e) => {
    if (e.key === "Enter") search(e.target.value);
});
document.getElementById("submit").addEventListener("click", () => {
    const query = document.getElementById("search").value;
    search(query);
});

document.addEventListener("DOMContentLoaded", () => {
    // Clone main navigation for mobile menu
    const mobileNav = document.querySelector(".mobile-navigation");
    const mainMenu = document.querySelector(".main-navigation .menu").cloneNode(true);
    mobileNav.appendChild(mainMenu);

    // Toggle mobile menu
    document.querySelector(".menu-toggle").addEventListener("click", () => {
        mobileNav.classList.toggle("open");
    });
});

// Initial search for a default location
search("Cairo");
