document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM Loaded");

  const addCourseBtn = document.getElementById("add-course");
  if (!addCourseBtn) {
    console.error("Add Course button not found");
    return;
  }

  addCourseBtn.addEventListener("click", function (event) {
    event.preventDefault();
    console.log("Hello from listener");

    // Validate form fields
    const courseName = document.getElementById("courseName").value.trim();
    const level = document.getElementById("level").value.trim();
    const semester = document.getElementById("Semester").value.trim();

    // Highlight required fields if empty
    if (!courseName) {
      document.getElementById("courseName").style.borderColor = "red";
      document.getElementById("coursename").style.color = "red";
      document.getElementById("coursename").style.fontWeight = "bold";
    } else {
      document.getElementById("courseName").style.borderColor = "";
    }

    if (!level) {
      document.getElementById("level").style.borderColor = "red";
      document.getElementById("Level").style.color = "red";
      document.getElementById("Level").style.fontWeight = "bold";
    } else {
      document.getElementById("level").style.borderColor = "";
    }

    if (!semester) {
      document.getElementById("Semester").style.borderColor = "red";
      document.getElementById("semester").style.color = "red";
      document.getElementById("semester").style.fontWeight = "bold";
    } else {
      document.getElementById("Semester").style.borderColor = "";
    }

    // If any required field is missing, display error and return
    if (!courseName || !level || !semester) {
      alert("Please fill in all required fields.");
      return;
    }

    // Submit the form if all fields are filled
    addSingleCourse();
  });

  // Define a function to add a single course
  function addSingleCourse() {
    const requestData = {
      Name: document.getElementById("courseName").value.trim(),
      Level: +document.getElementById("level").value.trim(),
      Semester: +document.getElementById("Semester").value.trim(),
      Departement: document.getElementById("departement").value.trim(),
      CreditHours: +document.getElementById("creditHours").value.trim(),
      LowestAttendanceRate: +document.getElementById("rate").value.trim(),
      AttendanceInstruction: document
        .getElementById("courseNotes")
        .value.trim(),
    };

    fetch("http://kero123.runasp.net/api/Course/AddCourse", {
      method: "POST",
      headers: {
        // Authorization: "Bearer <your_token_here>",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Course added successfully");
          window.location.href = "Allcourses.html"; // Redirect to Allcourses.html on success
          return response.json();
        } else {
          throw new Error(
            `Failed to add course: ${response.status} ${response.statusText}`
          );
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
});
