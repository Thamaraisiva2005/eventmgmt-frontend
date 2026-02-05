const BASE_URL = "https://eventmgmt-api.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  checkLogin();
  loadEvents();
});

/* 🔐 CHECK LOGIN */
function checkLogin() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please login first");
    window.location.href = "index.html";
  }
}

/* 📅 LOAD EVENTS */
async function loadEvents() {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/api/events`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    if (!res.ok) throw new Error("Failed to fetch events");

    const events = await res.json();
    const container = document.getElementById("events-container");
    container.innerHTML = "";

    if (!events.length) {
      container.innerHTML = "<p>No events available</p>";
      return;
    }

    events.forEach(e => {
      const card = document.createElement("div");
      card.className = "event-card";

      card.innerHTML = `
        <h3>${e.title}</h3>
        <p>${e.description}</p>
        <p><b>Date:</b> ${new Date(e.date).toLocaleDateString()}</p>
        <p><b>Location:</b> ${e.location}</p>
        <p><b>Price:</b> ₹${e.price || 0}</p>

        <button onclick="goToBooking('${e._id}', '${e.title}', ${e.price || 0})">
          Book Now
        </button>
      `;

      container.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    alert("Unable to load events");
  }
}

/* 🎟️ GO TO BOOKING PAGE */
function goToBooking(eventId, title, price) {
  localStorage.setItem("bookingEventId", eventId);
  localStorage.setItem("bookingEventTitle", title);
  localStorage.setItem("bookingEventPrice", price);

  window.location.href = "booking.html";
}

/* 🚪 LOGOUT */
function logout() {
  localStorage.removeItem("token");
  alert("Logged out successfully");
  window.location.href = "index.html";
}
