const socket = io();

// Elements
const messageForm = document.querySelector("#message--form");
const messageBtn = messageForm.querySelector("button");
const locationBtn = document.querySelector("#send-location");
const messages = document.querySelector("#messages");

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

// Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const autoScroll = () => {
  const newMessage = messages.lastElementChild;

  const newMessageStyles = getComputedStyle(newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = newMessage.offsetHeight + newMessageMargin;

  const visibleHeight = messages.offsetHeight;

  const containerHeight = messages.scrollHeight;

  const scrollOffset = messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset)
    messages.scrollTop = messages.scrollHeight;
};

socket.on("message", (message) => {
  const html = Mustache.render(messageTemplate, {
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a"),
    username: message.username,
  });
  messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

socket.on("locationMessage", (locationUrl) => {
  const html = Mustache.render(locationTemplate, {
    username: location.username,
    locationUrl: locationUrl.text,
    createdAt: moment(locationUrl.createdAt).format("h:mm a"),
    username: locationUrl.username,
  });
  messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, { room, users });
  document.querySelector("#sidebar").innerHTML = html;
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  messageBtn.setAttribute("disabled", "disabled");

  const inputMsg = e.target.elements.message;
  socket.emit("sendMessage", inputMsg.value, (error) => {
    messageBtn.removeAttribute("disabled");
    if (error) return alert(error);
    console.log("message is delivered");
  });
  inputMsg.value = "";
});

locationBtn.addEventListener("click", () => {
  locationBtn.setAttribute("disabled", "disabled");
  if (!navigator.geolocation) {
    locationBtn.removeAttribute("disabled");
    return alert("Your browser does not support this feature!");
  }
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "sendLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      () => {
        locationBtn.removeAttribute("disabled");
        console.log("Your location is sent!");
      }
    );
  });
});
