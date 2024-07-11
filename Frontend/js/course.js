document.addEventListener("DOMContentLoaded", function () {
  // Extract the courseId from the URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get("courseId");

  // Log the courseId to verify it
  console.log("Course ID:", courseId);

  // Fetch course data from the server
  fetch(`http://kero123.runasp.net/api/Course/${courseId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        console.log("Show course successfully");
        return response.json(); // Parse response body as JSON
      } else {
        throw new Error(
          `Failed to fetch course: ${response.status} ${response.statusText}`
        );
      }
    })
    .then((data) => {
      console.log("Data received:", data); // Log the data received
      const coursesSection = document.getElementById("course");
      coursesSection.textContent = "";
      // Check if data is an array
      if (Array.isArray(data)) {
        data.forEach((course) => {
          const courseTemplate = createCourseTemplate(course);
          coursesSection.insertAdjacentHTML("beforeend", courseTemplate);
        });
      } else if (typeof data === "object") {
        // Check if data is an object
        const courseTemplate = createCourseTemplate(data);
        coursesSection.insertAdjacentHTML("beforeend", courseTemplate);
      } else {
        throw new Error("Received data is not in the expected format.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      // Display an error message on the webpage
      const errorMessage = document.createElement("div");
      errorMessage.textContent =
        "An error occurred while fetching course data.";
      errorMessage.style.color = "red";
      document.body.appendChild(errorMessage);
    });

  // Function to create HTML template for a single course
  function createCourseTemplate(course) {
    return `
    <div class="container" id="details_course">
    <img src="./img/courseView.jpg" alt="" srcset="" class="courseView" />
      <div class="course-content mt-5">
        <h1 class="title">${course.name}</h1>
        <div class="details" id="Level">
          <span>Level: </span>
          <h3 class="text-course text-capitalize">${course.level}</h3>
        </div>
        <div class="details" id="Semester">
          <span>Semester: </span>
          <h3 class="text-course text-capitalize">${course.semester}</h3>
        </div>
        <div class="details" id="Departement">
          <span>Departement: </span>
          <h3 class="text-course text-capitalize">${course.departement}</h3>
        </div>
        <div class="details" id="credit_hours">
          <span>Credit hours: </span>
          <h3 class="text-course text-capitalize">${course.creditHours}</h3>
        </div>
        <div class="details" id="LowestAttendanceRate">
          <span>LowestAttendanceRate: </span>
          <h3 class="text-course text-capitalize">${course.lowestAttendanceRate}</h3>
        </div>
        <div class="details" id="AttendanceInstruction">
          <span>AttendanceInstruction: </span>
          <h3 class="text-course text-capitalize">${course.attendanceInstruction}</h3>
        </div>
        <br />
        <a href="lect-cor.html?courseId=${courseId}" class="course-button rounded-pill show-lect btn-sm mr-2">
              Show Lectures
        </a>
        <button class="course-button rounded-pill add-cour" id="addLectureButton" data-id="${courseId}">Add Lecture</button>
        <button class="course-button rounded-pill updateBtn" id="updateBtn" data-id="${courseId}"><i class="fa-solid fa-pen-to-square"></i></button>
        <a href="Allcourses.html" class="course-button rounded-pill" id="backallcourse">Back</a>
      </div>
    </div>
  `;
  }

  // Event listener for the "Add Lecture" button
  $(document).on("click", ".add-cour", function () {
    // var btn = $(this);
    // var courseId = btn.data("id");

    // Redirect to the update lecture page
    window.location.href = `create_lecture.html?courseId=${courseId}`;
  });

  // Event listener for the "Back" button
  // const backButton = document.getElementById("backallcourse");
  // if (backButton) {
  //   backButton.addEventListener("click", function() {
  //     // Redirect to Allcourses.html
  //     window.location.href = 'Allcourses.html';
  //   });
  // }

  // Event listener for the "Update" button
  // $(document).on("click", ".update-cour", function () {
  //   var btn = $(this);
  //   var courseId = btn.data("id");

  //   // Redirect to the update lecture page
  //   window.location.href = `update_course.html?courseId=${courseId}`;
  // });
});

$(document).ready(function () {
  // Get courseId from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get("courseId");

  // Check if courseId is not null or undefined
  if (courseId) {
    // Fetch lecture data by courseId
    fetch("http://kero123.runasp.net/api/Course/" + courseId)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch course");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched course data:", data); // Log the fetched course data

        // Check if input fields exist before populating them
        if ($("#courseName").length) $("#courseName").val(data.name);
        if ($("#level").length) $("#level").val(data.level);
        if ($("#semester").length) $("#semester").val(data.semester);
        if ($("#departement").length) $("#departement").val(data.departement);
        if ($("#creditHours").length) $("#creditHours").val(data.creditHours);
        if ($("#rate").length) $("#rate").val(data.lowestAttendanceRate);
        if ($("#courseNotes").length)
          $("#courseNotes").val(data.attendanceInstruction);

        // Check if courseId is not undefined
        if (data.courseId !== undefined) {
          // Fetch all courses and set the course name
          fetch("http://kero123.runasp.net/api/Course/GetAllCourses")
            .then((response) => {
              if (!response.ok) {
                throw new Error("Failed to fetch courses");
              }
              return response.json();
            })
            .then((courses) => {
              console.log("Fetched course data:", courses); // Log the fetched course data
            })
            .catch((error) => console.error("Error fetching courses:", error));
        }
      })
      .catch((error) => console.error("Error:", error));
  }

  // Update lecture data on form submission
  $("#updateForm").submit(function (event) {
    event.preventDefault();

    // Get updated lecture data from input fields
    const updatedLecture = {
      name: $("#courseName").val(),
      level: +$("#level").val(),
      semester: +$("#semester").val(), // Ensure 'Semester' matches the expected key
      departement: $("#departement").val(),
      creditHours: +$("#creditHours").val(),
      lowestAttendanceRate: +$("#rate").val(),
      attendanceInstruction: $("#courseNotes").val(),
    };

    // Log the updated lecture data for debugging
    console.log("Updated lecture data:", updatedLecture);

    // Send updated lecture data to the server
    fetch("http://kero123.runasp.net/api/Course/" + courseId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedLecture),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to update lecture: ${response.status} ${response.statusText}`
          );
        }
        // Actions to perform after successful update
        // For example, redirecting to another page
        window.location.href = "../Allcourses.html";
      })
      .catch((error) => console.error("Error:", error));
  });

  // Event listener for the update-lec button
  $(document).on("click", ".updateBtn", function () {
    const courseId = $(this).data("id");
    window.location.href = `update_course.html?courseId=${courseId}`;
  });
});
