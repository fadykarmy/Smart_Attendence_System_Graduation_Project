$(document).ready(function () {
  // Function to fetch course name from API
  function fetchCourseName(courseId) {
    fetch("http://yasmeenkhaled4543.runasp.net/api/Course/GetAllCourses")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        data.forEach((course) => {
          if (course.id.toString() === courseId) {
            document.querySelector(".course-name").textContent = course.name;
          }
        });
      })
      .catch((error) => {
        console.error("Error fetching course:", error);
      });
  }

  // Function to fetch lectures from API
  function fetchLectures() {
    fetch("http://yasmeenkhaled4543.runasp.net/api/Lecture/GetAllLectures")
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to fetch lectures: ${response.status} ${response.statusText}`
          );
        }
        return response.json();
      })
      .then((data) => {
        var courseId = getUrlParameter("courseId");
        console.log("CourseId: " + courseId);

        // Filter lectures by courseId
        var filteredLectures = data.filter(
          (lecture) => lecture.courseId == courseId
        );

        // Render filtered lectures
        var lectureTable = document.getElementById("lecture-table");
        // lectureTable.innerHTML = ''; // Clear previous content

        filteredLectures.forEach((lecture) => {
          var lectureHtml = `
                        <tr>
                            <td>${lecture.id}</td>
                            <td>${lecture.name}</td>
                            <td>${lecture.time}</td>
                            <td>${lecture.date}</td>
                            <td>${lecture.location}</td>
                            <td>${lecture.lectureNotes}</td>
                            <td>
                                <button class="generateBtn btn btn-primary rounded-pill mr-2" data-id="${lecture.id}">Generate QR</button>
                                <button class="showModal btn btn-info rounded-pill mr-2" data-id="${lecture.id}">
                                    <i class="fa-solid fa-qrcode"></i>
                                </button>
                                <button class="updateBtn btn btn-warning rounded-pill mr-2" data-id="${lecture.id}">
                                    <i class="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button class="deleteBtn btn btn-danger rounded-pill" data-id="${lecture.id}">
                                    <i class="fa-regular fa-trash-can"></i>
                                </button>
                            </td>
                        </tr>

                    `;
          lectureTable.insertAdjacentHTML("beforeend", lectureHtml);
        });
      })
      .catch((error) => {
        console.error("Error fetching lectures:", error);
      });
  }

  // Fetch lectures when the document is ready
  fetchLectures();

  // Event delegation for generating QR code, showing modal, updating and deleting lectures
  document.addEventListener("click", function (event) {
    // Generate QR code button
    if (event.target.classList.contains("generateBtn")) {
      event.preventDefault();
      const id = event.target.getAttribute("data-id");
      sendLectureData(id, "POST")
        .then(() => {
          alert("Data sent successfully.");
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Failed to generate QR code: " + error.message);
        });
    }

    // Show modal button
    if (event.target.classList.contains("showModal")) {
      const id = event.target.getAttribute("data-id");
      openModal(id);
    }

    // Update lecture button
    if (event.target.classList.contains("updateBtn")) {
      const id = event.target.getAttribute("data-id");
      // Implement update functionality here
      console.log("Update button clicked for lecture ID:", id);
      // Redirect or perform update operation
    }

    // Delete lecture button
    if (event.target.classList.contains("deleteBtn")) {
      const id = event.target.getAttribute("data-id");
      // Implement delete functionality here
      console.log("Delete button clicked for lecture ID:", id);
      // Show confirmation dialog and send delete request
    }
  });

  // Function to send lecture data to backend and receive QR code image
  function sendLectureData(id, method) {
    return new Promise(function (resolve, reject) {
      fetch(`http://yasmeenkhaled4543.runasp.net/api/Attendance/${id}`, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Failed to send data: ${response.status} ${response.statusText}`
            );
          }
          const contentType = response.headers.get("content-type");
          if (
            contentType &&
            (contentType.includes("application/json") ||
              contentType.includes("image/png") ||
              contentType.includes("image/jpeg") ||
              contentType.includes("image/bmp"))
          ) {
            return response;
          } else {
            throw new Error("Unsupported content type: " + contentType);
          }
        })
        .then((response) => {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            return response.json();
          } else {
            return response.blob();
          }
        })
        .then((data) => {
          if (typeof data === "object") {
            resolve(data);
          } else {
            const url = URL.createObjectURL(data);
            resolve(url);
          }
        })
        .catch((error) => {
          reject(new Error("Failed to send data: " + error.message));
        });
    });
  }

  // Function to fetch QR code image
  function getQRCode(id) {
    return new Promise(function (resolve, reject) {
      fetch(`http://yasmeenkhaled4543.runasp.net/api/Attendance/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "image/bmp",
        },
      })
        .then((response) => {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("image/bmp")) {
            return response;
          } else {
            throw new Error("Unsupported content type: " + contentType);
          }
        })
        .then((response) => response.blob())
        .then((data) => {
          const url = URL.createObjectURL(data);
          resolve(url);
        })
        .catch((error) => {
          reject(new Error("Failed to fetch QR code: " + error.message));
        });
    });
  }

  // Function to open modal and fetch QR code image
  function openModal(id) {
    console.log("Opening modal for ID:", id);
    const modal = document.querySelector(".modal.qrShow");
    const overlay = document.querySelector(".overlay");

    console.log("Modal:", modal);
    console.log("Overlay:", overlay);

    if (modal && overlay) {
      modal.classList.remove("hidden");
      overlay.classList.remove("hidden");

      getQRCode(id)
        .then((imgData) => {
          const img = document.createElement("img");
          img.src = imgData;
          img.alt = "QR Code";
          document.getElementById("qrCode").innerHTML = "";
          document.getElementById("qrCode").appendChild(img);
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Failed to fetch QR code: " + error.message);
        });
    } else {
      console.error("Modal or overlay element not found.");
    }
  }

  // Function to close modal
  document.querySelectorAll(".closeWindow, .overlay").forEach((element) => {
    element.addEventListener("click", function () {
      const modal = document.querySelector(".modal");
      const overlay = document.querySelector(".overlay");

      modal.classList.add("hidden");
      overlay.classList.add("hidden");
    });
  });

  // Function to get URL parameter by name
  function getUrlParameter(name) {
    name = name.replace(/[[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(location.search);
    return results === null
      ? ""
      : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  // Delete functionality
  $(document).on("click", ".deleteBtn", function () {
    var btn = $(this);
    var lectureId = btn.data("id");

    const swal = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-danger mx-2 pe-2",
        cancelButton: "btn btn-light mx-3",
      },
      buttonsStyling: false,
    });

    swal
      .fire({
        title: "Are you sure you want to delete?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          // Send AJAX request to delete the lecture
          $.ajax({
            url: `http://yasmeenkhaled4543.runasp.net/api/Lecture/${lectureId}`,
            method: "DELETE",
            success: function () {
              // Display success message
              swal.fire("Deleted!", "Lecture has been deleted.", "success");
              // Remove the deleted lecture from the DOM
              btn.closest("tr").fadeOut();
            },
            error: function () {
              // Display error message
              swal.fire("Oops..", "Something went wrong!", "error");
            },
          });
        }
      });
  });

  // Get lectureId from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const lectureId = urlParams.get("lectureId");

  // Check if lectureId is not null or undefined
  if (lectureId) {
    // Fetch lecture data by lectureId
    fetch("http://yasmeenkhaled4543.runasp.net/api/Lecture/" + lectureId)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch lecture");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched lecture data:", data); // Log the fetched lecture data

        // Check if input fields exist before populating them
        if ($("#lectureName").length) $("#lectureName").val(data.name);
        if ($("#lectureTime").length) $("#lectureTime").val(data.time);

        // Parse and format the date
        const dateValue = new Date(data.date);
        const formattedDate = dateValue.toISOString().split("T")[0];
        if ($("#lectureDate").length) $("#lectureDate").val(formattedDate);

        if ($("#lectureLocation").length)
          $("#lectureLocation").val(data.location);
        if ($("#lectureNotes").length)
          $("#lectureNotes").val(data.lectureNotes);

        // Check if courseId is not undefined
        if (data.courseId !== undefined) {
          // Fetch all courses and set the course name
          fetch("http://yasmeenkhaled4543.runasp.net/api/Course/GetAllCourses")
            .then((response) => {
              if (!response.ok) {
                throw new Error("Failed to fetch courses");
              }
              return response.json();
            })
            .then((courses) => {
              console.log("Fetched course data:", courses); // Log the fetched course data

              // Check if the select element exists
              const courseSelect = $("#courseSelect");
              if (courseSelect.length) {
                // Clear previous options
                courseSelect.empty();
                // Append a default option
                courseSelect.append(
                  '<option value="">Select a course</option>'
                );

                // Append fetched courses as options
                courses.forEach((course) => {
                  console.log(
                    `Course ID: ${course.id}, Course Name: ${course.name}`
                  );
                  const isSelected =
                    course.id.toString() === data.courseId.toString()
                      ? "selected"
                      : "";
                  courseSelect.append(
                    `<option value="${course.id}" ${isSelected}>${course.name}</option>`
                  );
                });

                // Check if the selected course option is present
                const selectedCourse = courses.find(
                  (course) => course.id.toString() === data.courseId.toString()
                );
                if (selectedCourse) {
                  console.log("Matched course:", selectedCourse); // Log the matched course
                } else {
                  console.log(
                    "No matching course found for courseId:",
                    data.courseId
                  ); // Log if no course matched
                }
              } else {
                console.error(
                  "The course select element does not exist in the DOM."
                );
              }
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
      name: $("#lectureName").val(),
      time: $("#lectureTime").val(),
      date: $("#lectureDate").val(),
      location: $("#lectureLocation").val(),
      courseId: $("#courseSelect").val(),
      lectureNotes: $("#lectureNotes").val(),
    };

    // Send updated lecture data to the server
    fetch("http://yasmeenkhaled4543.runasp.net/api/Lecture/" + lectureId, {
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
    const lectureId = $(this).data("id");
    window.location.href = `update_lect.html?lectureId=${lectureId}`;
  });
});
