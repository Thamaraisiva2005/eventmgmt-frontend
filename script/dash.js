const BASE_URL = "https://eventmgmt-api.onrender.com";

function authHeaders() {
  return {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + localStorage.getItem("token")
  };
}

let editingEventId = null;

window.onload = loadEvents;

/* ---------------- ADD / UPDATE EVENT ---------------- */
function addEvent() {
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const date = document.getElementById("date").value;
  const location = document.getElementById("location").value.trim();

  if (!title || !date || !location) {
    alert("Please fill all required fields");
    return;
  }

  const method = editingEventId ? "PUT" : "POST";
  const url = editingEventId
    ? `${BASE_URL}/api/events/${editingEventId}`
    : `${BASE_URL}/api/events/add`;

  fetch(url, {
    method,
    headers: authHeaders(),
    body: JSON.stringify({ title, description, date, location })
  })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Action failed");
      return data;
    })
    .then(data => {
      alert(data.msg || "Event processed successfully");
      clearForm();
      loadEvents();
    })
    .catch(err => {
      console.error(err);
      alert(err.message);
    });
}

/* ---------------- LOAD EVENTS ---------------- */
function loadEvents() {
  const role = localStorage.getItem("role");

  fetch(`${BASE_URL}/api/events`, { headers: authHeaders() })
    .then(async res => {
      if (res.status === 401 || res.status === 403) {
        alert("Session expired. Please login again.");
        logout();
        return [];
      }
      return res.json();
    })
    .then(events => {
      const container = document.getElementById("events-container");
      container.innerHTML = "";

      if (!events.length) {
        container.innerHTML = "<p>No events available</p>";
        return;
      }

      events.forEach(event => {
        const div = document.createElement("div");
        div.className = "event-card";
        div.id = `event-${event._id}`;

        div.innerHTML = `
          <h4>${event.title}</h4>
          <p class="desc">${event.description || ""}</p>
          <p class="date"><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
          <p class="location"><strong>Location:</strong> ${event.location}</p>
          ${role === "admin" ? `
          <div class="event-actions">
            <button onclick="prepareEdit('${event._id}')">Edit</button>
            <button onclick="deleteEvent('${event._id}')">Delete</button>
          </div>` : ""}
        `;
        container.appendChild(div);
      });
    })
    .catch(err => {
      console.error(err);
      alert("Failed to load events");
    });
}

/* ---------------- DELETE EVENT ---------------- */
function deleteEvent(id) {
  if (!confirm("Are you sure you want to delete this event?")) return;

  fetch(`${BASE_URL}/api/events/${id}`, {
    method: "DELETE",
    headers: authHeaders()
  })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Delete failed");
      return data;
    })
    .then(data => {
      alert(data.msg);
      loadEvents();
    })
    .catch(err => {
      console.error(err);
      alert(err.message);
    });
}

/* ---------------- PREPARE EDIT ---------------- */
function prepareEdit(id) {
  editingEventId = id;
  const eventDiv = document.getElementById(`event-${id}`);

  document.getElementById("title").value = eventDiv.querySelector("h4").innerText;
  document.getElementById("description").value = eventDiv.querySelector(".desc").innerText;
  document.getElementById("date").value = new Date(
    eventDiv.querySelector(".date").innerText.replace("Date:", "").trim()
  ).toISOString().split("T")[0];
  document.getElementById("location").value = eventDiv.querySelector(".location").innerText.replace("Location:", "").trim();

  document.querySelector(".create-event button").innerText = "Update Event";
}

/* ---------------- CLEAR FORM ---------------- */
function clearForm() {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("date").value = "";
  document.getElementById("location").value = "";
  editingEventId = null;

  document.querySelector(".create-event button").innerText = "Add Event";
}

/* ---------------- LOGOUT ---------------- */
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}
