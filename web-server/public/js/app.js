console.log("Client side javascript is loaded.");

const weatherForm = document.querySelector("form");
const search = document.querySelector("input");
const forecastMessage = document.querySelector("#message-1");
const locationMessage = document.querySelector("#message-2");

weatherForm.addEventListener("submit", (e) => {
  e.preventDefault();
  fetch(`/weather?address=${search.value}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.error)
        throw new Error("Unable to find location. Try another search");
      forecastMessage.textContent = data.forecast;
      locationMessage.textContent = data.location;
    })
    .catch((err) => (forecastMessage.textContent = err.message));
});
// Hey
