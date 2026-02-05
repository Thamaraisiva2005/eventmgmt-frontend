const BASE_URL = "https://eventmgmt-api.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  checkLogin();
  loadEventDetails();
});

function checkLogin() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please login first");
    window.location.href = "index.html";
  }
}

function loadEventDetails() {
  const title = localStorage.getItem("bookingEventTitle");
  const price = localStorage.getItem("bookingEventPrice");

  document.getElementById("event-details").innerHTML = `
    <p><b>Event:</b> ${title}</p>
    <p><b>Price per Ticket:</b> ₹${price}</p>
  `;
}

async function confirmBooking() {
  const eventId = localStorage.getItem("bookingEventId");
  const tickets = document.getElementById("tickets").value;
  const token = localStorage.getItem("token");

  if (!tickets || tickets <= 0) {
    alert("Enter valid number of tickets");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ eventId, tickets })
    });

    const data = await res.json();

    if (res.ok) {
      alert("🎉 Booking Successful!");
      window.location.href = "my-bookings.html";
    } else {
      alert(data.msg || "Booking failed");
    }

  } catch (err) {
    console.error(err);
    alert("Booking failed. Try again.");
  }
}
