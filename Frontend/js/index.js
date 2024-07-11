function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
  if (!event.target.matches(".dropbtn")) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
};

const date = document.querySelector(".date");
async function updateTimeAsync() {
  while (true) {
    const now = new Date();
    const formattedTime = now.toLocaleString("en-US", {
      timeZone: "Africa/Cairo",
    }); // Adjust timeZone as needed
    date.innerHTML = formattedTime; // Or display it in a UI element

    await new Promise((resolve) => setTimeout(resolve, 1000)); // Update every 1 second
  }
}

updateTimeAsync(); // Start the asynchronous time update

fetch("http://kero123.runasp.net/api/Course/GetAllCourses", {
  method: "GET",
  headers: {
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJEb2FhYUFobWVkIiwianRpIjoiOTgxMmMyMzktN2FmYS00YzBhLTkyNTYtYjFkNjZhMThjY2RkIiwiZW1haWwiOiJkb2FhMUBnbWFpbC5jb20iLCJ1aWQiOiJjODg5YTkzMy0xNWZhLTRlMDYtOWFhMS04NmFiZGUyNjE5ZmIiLCJyb2xlcyI6IlByb2Zlc3NvciIsImV4cCI6MTcwNzYwOTI2MywiaXNzIjoiU2VjdXJlQXBpIiwiYXVkIjoiU2VjdXJlQXBpVXNlciJ9.9qsx8WU_SZecuhBfKGORdvgt0JAUKYVuwdUk77G7kCI",
    "Content-Type": "application/json",
  },
  // body: JSON.stringify(requestData),
})
  .then((response) => {
    if (response.ok) {
      console.log("Course added successfully");
      return response.json(); // Parse response body as JSON
    } else {
      throw new Error(
        `Failed to add course: ${response.status} ${response.statusText}`
      );
    }
  })
  .then((data) => {
    console.log("Data received:", data); // Handle response data
    // Create a template for the "block-course" element
    const coursesSection = document.getElementById("courses-section");
    coursesSection.textContent = "";
    data.forEach((course) => {
      const courseTemplate = `
      <div class="block-course showModal">
      
        <img
        class="img-courses"
        src="../img/vecteezy_universe-lettering-with-sun_6071564.jpg"
        alt="${course.name}"
        />
        <br/>
        <h5 class="title">${course.name}</h5>
        
        
        <button class="view-course rounded-pill" data-id="${course.id}">
            view
        </button>
       
      </div>
      `;
      console.log(data);
      coursesSection.insertAdjacentHTML("beforeend", courseTemplate);
    });
  })
  .catch((error) => {
    console.error("Error:", error);
    // Handle errors, such as displaying an error message to the user
  });

// JavaScript Code
$(document).on("click", ".view-course", function () {
  var btn = $(this);
  var courseId = btn.data("id");
  console.log("Clicked on course with ID:", courseId);
  // Redirect to the course.html page with the courseId as a query parameter
  // Replace 'course.html' with your actual page name
  window.location.href = `course.html?courseId=${courseId}`;
});
