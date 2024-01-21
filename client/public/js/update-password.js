/****************************************************/
// Listening to the Click on Submit button
/****************************************************/
const submit = document.querySelector(".submit");
const login = document.querySelector(".login");
const form = document.querySelector(".form-group");
//function to display custom alert message
const customAlert = document.getElementById("custom-alert");
const customMessage = document.getElementById("custom-message");
const customOkButton = document.getElementById("custom-ok-button");

submit.addEventListener("click", async function (e) {
  e.preventDefault();

  //trying to fetch link id from url
  const currentURL = window.location.href; // Get the current URL
  const urlSegments = currentURL.split("/"); // Split the URL by '/'
  const linkParams = urlSegments[urlSegments.length - 1];

  const pass = document.getElementById("password");
  const confirmPass = document.getElementById("confirm-password");
  if (pass.value === "" || confirmPass.value === "") {
    showAlert("Please Enter Valid Values!");
    customOkButton.addEventListener("click", function () {
      customAlert.style.display = "none";
    });
    pass.value = "";
    confirmPass.value = "";
    return;
  }

  if (pass.value !== confirmPass.value) {
    showAlert("MisMatched Passwords!");
    customOkButton.addEventListener("click", function () {
      customAlert.style.display = "none";
    });
    pass.value = "";
    confirmPass.value = "";
    return;
  } else {
    try {
      const response = await axios.post("resetpassword", {
        pass: pass.value,
        confirmPass: confirmPass.value,
        linkId: linkParams,
      });

      showAlert(response.data.message);
      customOkButton.addEventListener("click", function () {
        customAlert.style.display = "none";

        window.location.href = "/login-page";
      });
    } catch (error) {
      showAlert(error.response.data.message);
      customOkButton.addEventListener("click", function () {
        customAlert.style.display = "none";
      });
      pass.value = "";
      confirmPass.value = "";
    }
  }
});

function showAlert(message) {
  customMessage.textContent = message;
  customAlert.style.display = "block";
}
