// Function to fetch lectures from API
function fetchLectures(courseId) {
  // Fetch all lectures
  fetch("http://kero123.runasp.net/api/Lecture/GetAllLectures")
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Failed to fetch lectures: ${response.status} ${response.statusText}`
        );
      }
      return response.json();
    })
    .then((lectures) => {
      // Fetch all courses to map courseId to courseName
      fetch("http://kero123.runasp.net/api/Course/GetAllCourses")
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((courses) => {
          // Clear previous content in lecture table
          var lectureTable = document.getElementById("lecture-table");
          if (lectureTable) {
            lectureTable.innerHTML = "";

            // Iterate through lectures to render them
            lectures.forEach((lecture) => {
              // Find the course name corresponding to lecture's courseId
              const course = courses.find((c) => c.id === lecture.courseId);
              const courseName = course ? course.name : "Unknown"; // Handle if course name not found
              const formattedDate = dayjs("2024-06-30T00:00:00Z").format(
                "MMM DD, YYYY"
              );
              // Construct HTML for each lecture
              var lectureHtml = `
                <tr>
                  <td>${lecture.id}</td>
                  <td>${courseName}</td> <!-- Display course name here -->
                  <td>${lecture.name}</td>
                  <td>${lecture.time}</td>
                  <td>${formattedDate}</td>
                  <td>${lecture.location}</td>
                  <td>${lecture.lectureNotes}</td>
                  <td>
                    <button class="generateBtn btn btn-primary rounded-pill mr-2" data-id="${lecture.id}">Generate QR</button>
                    <button class="showModal btn btn-info rounded-pill mr-2" data-id="${lecture.id}">
                      <i class="fa-solid fa-qrcode"></i>
                    </button>
                    <button class="showStud btn rounded-pill mr-2" data-id="${lecture.id}">
                      <i class="fa-solid fa-users"></i>                            
                    </button>
                    <button class="updateBtn btn btn-warning rounded-pill mr-2" data-id="${lecture.id}">
                      <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="deleteBtn btn btn-danger rounded-pill" data-id="${lecture.id}">
                      <i class="fa-regular fa-trash-can"></i>
                    </button>


                    <button class="absAll btn rounded-pill" data-id="${lecture.id}">
                      <i class="fa-solid fa-users"></i>
                    </button>


                  </td>
                </tr>
              `;
              // Append lecture HTML to table
              lectureTable.insertAdjacentHTML("beforeend", lectureHtml);
            });
          } else {
            throw new Error(`Element with id 'lecture-table' not found.`);
          }
        })
        .catch((error) => {
          console.error("Error fetching course data:", error);
        });
    })
    .catch((error) => {
      console.error("Error fetching lectures:", error);
    });
}

// Call fetchLectures with your courseId parameter inside $(document).ready()
$(document).ready(function () {
  var courseId = getUrlParameter("courseId");
  fetchLectures(courseId);
});


// document.addEventListener("DOMContentLoaded", function () {
//     // Function to fetch course name from API
//     function fetchCourseName(courseId) {
//         fetch("http://kero123.runasp.net/api/Course/GetAllCourses")
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}`);
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 data.forEach(course => {
//                     if (course.id.toString() === courseId) {
//                         document.querySelector(".course-name").textContent = course.name;
//                     }
//                 });
//             })
//             .catch(error => {
//                 console.error("Error fetching course:", error);
//             });
//     }

//     // Function to fetch lectures from API
//     fetch("http://kero123.runasp.net/api/Lecture/GetAllLectures", {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//         },
//     })
//     .then(response => {
//         if (response.ok) {
//             return response.json(); // Parse response body as JSON
//         } else {
//             throw new Error(
//                 `Failed to fetch lectures: ${response.status} ${response.statusText}`
//             );
//         }
//     })
//     .then(data => {
//         const lectureTable = document.getElementById("lecture-table");
//         // Create the header section
//         const headerTemplate = `
//             <thead class="block-course">
//                 <tr class="lecture">
//                     <th scope="col">id</th>
//                     <th scope="col">Name</th>
//                     <th scope="col">Time</th>
//                     <th scope="col">Date</th>
//                     <th scope="col">Location</th>
//                     <th scope="col">Notes</th>

//                     <th scope="col">Action</th>
//                 </tr>
//             </thead>
//             <tbody id="lecture-table" class="block-course"></tbody>
//         `;

//         // Append the header to the table
//         lectureTable.innerHTML = headerTemplate;

//         // Iterate over each lecture data and create table rows
//         data.forEach(lecture => {
//             const courseTemplate = `
//                 <tr class="lecture">
//                     <td>${lecture.id}</td>
//                     <td>${lecture.name}</td>
//                     <td>${lecture.time}</td>
//                     <td>${lecture.date}</td>
//                     <td>${lecture.location}</td>
//                     <td>${lecture.lectureNotes}</td>
//                     <td class="align-items center;">

//                         <button class="generateBtn btn btn-primary rounded-pill mr-2" data-id="${lecture.id}">Generate QR</button>
//                         <button class="showModal btn btn-info rounded-pill mr-2" data-id="${lecture.id}">
//                             <i class="fa-solid fa-qrcode"></i>
//                         </button>

//                         <button class="showStud btn rounded-pill mr-2" data-id="${lecture.id}">
//                             <i class="fa-solid fa-users"></i>
//                         </button>

//                         <button class="updateBtn btn btn-warning rounded-pill mr-2" data-id="${lecture.id}">
//                                     <i class="fa-solid fa-pen-to-square"></i>
//                         </button>
//                         <button class="deleteBtn btn rounded-pill js-delete" data-id="${lecture.id}">
//                             <i class="fa-regular fa-trash-can"></i>
//                         </button>
//                     </td>
//                 </tr>
//             `;

//             // Append the table row to the table body
//             lectureTable.insertAdjacentHTML("beforeend", courseTemplate);
//         });
//     })
//     .catch(error => {
//         console.error("Error:", error);
//         // Handle errors, such as displaying an error message to the user
//     });

// Event delegation for generating QR code
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
});

//Event delegation for Showing modal
document.addEventListener("click", function (event) {
  // Show modal button
  if (event.target.classList.contains("showModal")) {
    const id = event.target.getAttribute("data-id");
    openModal(id);
  }
});
// Function to send lecture data to backend and receive QR code image
function sendLectureData(id, method) {
  return new Promise(function (resolve, reject) {
    fetch(`http://kero123.runasp.net/api/Attendance/${id}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to send data: ${response.status} ${response.statusText}`
            // `Failed to send data: ${response.status} ${response.statusText}`
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
        reject(new Error("Already exists"));
        // reject(new Error("Failed to send data: " + error.message));
      });
  });
}

// Function to fetch QR code image
function getQRCode(id) {
  return new Promise(function (resolve, reject) {
    fetch(`http://kero123.runasp.net/api/Attendance/${id}`, {
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
        img.style.height = "400px";
        img.style.width = "400px";
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

// Get lectureId from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const lectureId = urlParams.get("lectureId");

// Check if lectureId is not null or undefined
if (lectureId) {
  // Fetch lecture data by lectureId
  fetch("http://kero123.runasp.net/api/Lecture/" + lectureId)
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
      if ($("#lectureNotes").length) $("#lectureNotes").val(data.lectureNotes);

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

            // Check if the select element exists
            const courseSelect = $("#courseSelect");
            if (courseSelect.length) {
              // Clear previous options
              courseSelect.empty();
              // Append a default option
              courseSelect.append('<option value="">Select a course</option>');

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
  fetch("http://kero123.runasp.net/api/Lecture/" + lectureId, {
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
          url: `http://kero123.runasp.net/api/Lecture/${lectureId}`,
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

//Event delegation for Showing student
$(document).on("click", ".showStud", function () {
  const lectureId = $(this).data("id");
  // console.log("Go to student attendance in lectureId:", lectureId);
  window.location.href = `search.html?lectureId=${lectureId}`;
});

//Event delegation for Showing student
$(document).on("click", ".absAll", function () {
  const lectureId = $(this).data("id");
  // console.log("Go to student attendance in lectureId:", lectureId);
  window.location.href = `upload.html?lectureId=${lectureId}`;
});

// $(document).ready(function () {
//   // Function to fetch course name from API
//   function fetchCourseName(courseId) {
//       fetch("http://yasmeen84983.runasp.net/api/Course/GetAllCourses")
//           .then((response) => {
//               if (!response.ok) {
//                   throw new Error(`HTTP error! status: ${response.status}`);
//               }
//               return response.json();
//           })
//           .then((data) => {
//               data.forEach((course) => {
//                   if (course.id.toString() === courseId) {
//                       $(".course-name").text(course.name);
//                   }
//               });
//           })
//           .catch((error) => {
//               console.error("Error fetching course:", error);
//           });
//   }

//   // Function to fetch lectures from API
//   fetch("http://yasmeen84983.runasp.net/api/Lecture/GetAllLectures", {
//       method: "GET",
//       headers: {
//           "Content-Type": "application/json",
//       },
//   })
//       .then((response) => {
//           if (response.ok) {
//               return response.json(); // Parse response body as JSON
//           } else {
//               throw new Error(
//                   `Failed to fetch lectures: ${response.status} ${response.statusText}`
//               );
//           }
//       })
//       .then((data) => {
//           // Create the header section
//           const headerTemplate = `
//               <thead class="block-course">
//                   <tr class="lecture">
//                       <th scope="col">id</th>
//                       <th scope="col">Name</th>
//                       <th scope="col">Time</th>
//                       <th scope="col">Date</th>
//                       <th scope="col">Location</th>
//                       <th scope="col">Notes</th>
//                       <th scope="col">Generate</th>
//                       <th scope="col">Show</th>
//                       <th scope="col">Action</th>
//                   </tr>
//               </thead>
//               <tbody id="lecture-table" class="block-course"></tbody>
//           `;

//           // Append the header to the table
//           $("#lecture-table").append(headerTemplate);

//           // Iterate over each lecture data and create table rows
//           data.forEach((lecture) => {
//               LecId = lecture.id;
//               const courseTemplate = `
//               <tr class="lecture">
//                   <td>${lecture.id}</td>
//                   <td>${lecture.name}</td>
//                   <td>${lecture.time}</td>
//                   <td>${lecture.date}</td>
//                   <td>${lecture.location}</td>
//                   <td>${lecture.lectureNotes}</td>
//                   <td class="align-items center;">
//                       <button id="${lecture.id}" class="generateBtn btn qrBtn rounded-pill" onclick="">
//                           Generate QR
//                       </button>
//                   </td>
//                   <td>
//                       <button id="${lecture.id}" class="btn showModal qrBtn rounded-pill" onclick="">
//                           <i class="fa-solid fa-qrcode"></i>
//                       </button>
//                   </td>
//                   <td>
//                       <button class="btn rounded-pill update-lec" data-id="${lecture.id}">
//                           <i class="fa-solid fa-pen-to-square"></i>
//                       </button>
//                       <button class="deleteBtn btn rounded-pill js-delete" data-id="${lecture.id}">
//                           <i class="fa-regular fa-trash-can"></i>
//                       </button>
//                   </td>
//               </tr>
//           `;

//               // Append the table row to the table body
//               $("#lecture-table").append(courseTemplate);
//           });
//       })
//       .catch((error) => {
//           console.error("Error:", error);
//           // Handle errors, such as displaying an error message to the user
//       });

// // Function to send lecture data to backend and receive QR code image
// function sendLectureData(id, method) {
//   return new Promise(function(resolve, reject) {
//       $.ajax({
//           url: `http://yasmeen84983.runasp.net/api/Attendance/${id}`,
//           method: method,
//           contentType: "application/json",
//           success: function(data, textStatus, jqXHR) {
//               const contentType = jqXHR.getResponseHeader("content-type");
//               if (contentType && contentType.includes("application/json")) {
//                   resolve(data);
//               } else if (contentType && (contentType.includes("image/png") || contentType.includes("image/jpeg") || contentType.includes("image/bmp"))) {
//                   const blob = new Blob([data], { type: contentType });
//                   const url = URL.createObjectURL(blob);
//                   resolve(url);
//               } else {
//                   reject(new Error("Unsupported content type: " + contentType));
//               }
//           },
//           error: function(jqXHR, textStatus, errorThrown) {
//               reject(new Error("Failed to send data: " + errorThrown));
//           }
//       });
//   });
// }
// function GetLectureData(id, method) {
//   return new Promise(function(resolve, reject) {
//       $.ajax({
//           url: `http://yasmeen84983.runasp.net/api/Attendance/${id}`,
//           method: method,
//           contentType: "image/bmp",
//           success: function(data, textStatus, jqXHR) {
//               const contentType = jqXHR.getResponseHeader("content-type");
//               if (contentType && contentType.includes("image/bmp")) {
//                   resolve(data);
//               } else if (contentType && (contentType.includes("image/png") || contentType.includes("image/jpeg") || contentType.includes("image/bmp"))) {
//                   const blob = new Blob([data], { type: contentType });
//                   const url = URL.createObjectURL(blob);
//                   resolve(url);
//               } else {
//                   reject(new Error("Unsupported content type: " + contentType));
//               }
//           },
//           error: function(jqXHR, textStatus, errorThrown) {
//               reject(new Error("Failed to send data: " + errorThrown));
//           }
//       });
//   });
// }

// // Event listener for generating QR code
// $(document).on("click", ".generateBtn", function(e) {
//   e.preventDefault();
//   const id = $(this).attr("id");
//   sendLectureData(id, "POST")
//       .then(function() {
//           alert("Data sent successfully.");
//       })
//       .catch(function(error) {
//           console.error("Error:", error);
//           alert(error.message);
//       });
// });

// // Function to open modal and fetch QR code image
// let showModal = $(".qrShow");
// let closeWindow = $(".closeWindow");
// let modal = $(".modal");
// let overlay = $(".overlay");

// let open = function (id) {
//   modal.removeClass("hidden");
//   overlay.removeClass("hidden");
//   GetLectureData(id, "GET")
//       .then(function(imgData) {
//           const img = $("<img>").attr("src", imgData).attr("alt", "QR Code");
//           $("#qrCode").empty().append(img);
//       })
//       .catch(function(error) {
//           console.error("Error:", error);
//           alert("Failed to fetch QR code: " + error.message);
//       });
// };
// let close = function () {
//   modal.addClass("hidden");
//   overlay.addClass("hidden");
// };

// closeWindow.on("click", close);
// overlay.on("click", close);

// /* show modal */
// $(document).on("click", ".showModal", function() {
//   const id = $(this).attr("id");
//   open(id);
// });

// // // Function to send lecture data to backend and receive QR code image
// // function sendLectureData(id, method) {
// //   return new Promise(function(resolve, reject) {
// //       $.ajax({
// //           url: `http://yasmeen84983.runasp.net/api/Attendance/${id}`,
// //           method: method,
// //           contentType: "application/json",
// //           success: function(data, textStatus, jqXHR) {
// //               const contentType = jqXHR.getResponseHeader("content-type");
// //               if (contentType && contentType.includes("application/json")) {
// //                   resolve(data);
// //               } else if (contentType && (contentType.includes("image/png") || contentType.includes("image/jpeg") || contentType.includes("image/bmp"))) {
// //                   const blob = new Blob([data], { type: contentType });
// //                   const url = URL.createObjectURL(blob);
// //                   resolve(url);
// //               } else {
// //                   reject(new Error("Unsupported content type: " + contentType));
// //               }
// //           },
// //           error: function(jqXHR, textStatus, errorThrown) {
// //               reject(new Error("Failed to send data: " + errorThrown));
// //           }
// //       });
// //   });
// // }

// // // Event listener for generating QR code
// // $(document).on("click", ".generateBtn", function(e) {
// //   e.preventDefault();
// //   const id = $(this).attr("id");
// //   sendLectureData(id, "POST")
// //       .then(function() {
// //           alert("Data sent successfully.");
// //       })
// //       .catch(function(error) {
// //           console.error("Error:", error);
// //           alert(error.message);
// //       });
// // });

// // // Function to open modal and fetch QR code image
// // let showModal = $(".qrShow");
// // let closeWindow = $(".closeWindow");
// // let modal = $(".modal");
// // let overlay = $(".overlay");

// // let open = function (id) {
// //   modal.removeClass("hidden");
// //   overlay.removeClass("hidden");
// //   sendLectureData(id, "GET")
// //       .then(function(imgData) {
// //           const img = $("<img>").attr("src", imgData);
// //           $("#qrCode").empty().append(img);
// //       })
// //       .catch(function(error) {
// //           console.error("Error:", error);
// //           alert("Failed to fetch QR code: " + error.message);
// //       });
// // };
// // let close = function () {
// //   modal.addClass("hidden");
// //   overlay.addClass("hidden");
// // };

// // closeWindow.on("click", close);
// // overlay.on("click", close);

// // /* show modal */
// // $(document).on("click", ".showModal", function() {
// //   const id = $(this).attr("id");
// //   open(id);
// // });

//   // Function to delete lecture
//   $(document).on("click", ".js-delete", function () {
//       var btn = $(this);
//       var lectureId = btn.data("id");

//       const swal = Swal.mixin({
//           customClass: {
//               confirmButton: "btn btn-danger mx-2 pe-2",
//               cancelButton: "btn btn-light mx-2",
//           },
//           buttonsStyling: false,
//       });

//       swal
//           .fire({
//               title: "Are you sure you want to delete?",
//               text: "You won't be able to revert this!",
//               icon: "warning",
//               showCancelButton: true,
//               confirmButtonText: "Yes, delete!",
//               cancelButtonText: "No, cancel!",
//               reverseButtons: true,
//           })
//           .then((result) => {
//               if (result.isConfirmed) {
//                   $.ajax({
//                       url: `http://yasmeen84983.runasp.net/api/Lecture/${lectureId}`,
//                       method: "DELETE",
//                       success: function () {
//                           swal.fire("Deleted!", "Lecture has been deleted.", "success");
//                           btn.closest("tr").fadeOut();
//                       },
//                       error: function () {
//                           swal.fire("Oops..", "Something went wrong!", "error");
//                       },
//                   });
//               }
//           });
//   });
// });

//   document.querySelectorAll(".js-delete").forEach(btn => {
//       btn.addEventListener("click", function () {
//           var lectureId = this.getAttribute("data-id");

//           const swal = Swal.mixin({
//               customClass: {
//                   confirmButton: "btn btn-danger mx-2 pe-2",
//                   cancelButton: "btn btn-light mx-2",
//               },
//               buttonsStyling: false,
//           });

//           swal.fire({
//               title: "Are you sure you want to delete?",
//               text: "You won't be able to revert this!",
//               icon: "warning",
//               showCancelButton: true,
//               confirmButtonText: "Yes, delete!",
//               cancelButtonText: "No, cancel!",
//               reverseButtons: true,
//           }).then(result => {
//               if (result.isConfirmed) {
//                   fetch(`http://yasmeen84983.runasp.net/api/Lecture/${lectureId}`, {
//                       method: "DELETE"
//                   })
//                   .then(() => {
//                       swal.fire("Deleted!", "Lecture has been deleted.", "success");
//                       btn.closest("tr").remove();
//                   })
//                   .catch(() => {
//                       swal.fire("Oops..", "Something went wrong!", "error");
//                   });
//               }
//           });
//       });
//   });

// $(document).ready(function () {
//     // Get lectureId from URL parameter
//     const urlParams = new URLSearchParams(window.location.search);
//     const lectureId = urlParams.get('lectureId');

//     // Check if lectureId is not null or undefined
//     if (lectureId) {
//         // Fetch lecture data by lectureId
//         fetch("http://yasmeen84983.runasp.net/api/Lecture/" + lectureId)
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch lecture');
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 console.log("Fetched lecture data:", data); // Log the fetched lecture data
//                 // Populate input fields with lecture data
//                 $('#lectureName').val(data.name);
//                 $('#lectureTime').val(data.time);

//                 // Parse and format the date
//                 const dateValue = new Date(data.date);
//                 const formattedDate = dateValue.toISOString().split('T')[0];
//                 $('#lectureDate').val(formattedDate);

//                 $('#lectureLocation').val(data.location);
//                 $('#lectureNotes').val(data.lectureNotes);

//                 // Check if courseId is not undefined
//                 if (data.courseId !== undefined) {
//                     // Fetch all courses and set the course name
//                     fetch("http://yasmeen84983.runasp.net/api/Course/GetAllCourses")
//                         .then(response => {
//                             if (!response.ok) {
//                                 throw new Error('Failed to fetch courses');
//                             }
//                             return response.json();
//                         })
//                         .then(courses => {
//                             console.log("Fetched course data:", courses); // Log the fetched course data

//                             // Clear previous options
//                             $('#courseSelect').empty();
//                             // Append a default option
//                             $('#courseSelect').append('<option value="">Select a course</option>');

//                             // Append fetched courses as options
//                             courses.forEach(course => {
//                                 console.log(`Course ID: ${course.id}, Course Name: ${course.name}`);
//                                 const isSelected = course.id.toString() === data.courseId.toString() ? 'selected' : '';
//                                 $('#courseSelect').append(`<option value="${course.id}" ${isSelected}>${course.name}</option>`);
//                             });

//                             // Check if the selected course option is present
//                             const selectedCourse = courses.find(course => course.id.toString() === data.courseId.toString());
//                             if (selectedCourse) {
//                                 console.log("Matched course:", selectedCourse); // Log the matched course
//                             } else {
//                                 console.log("No matching course found for courseId:", data.courseId); // Log if no course matched
//                             }
//                         })
//                         .catch(error => console.error('Error fetching courses:', error));
//                 }
//             })
//             .catch(error => console.error('Error:', error));
//     }

//     // Update lecture data on form submission
//     $('#update-form').submit(function (event) {
//         event.preventDefault();

//         // Get updated lecture data from input fields
//         const updatedLecture = {
//             name: $('#lectureName').val(),
//             time: $('#lectureTime').val(),
//             date: $('#lectureDate').val(),
//             location: $('#lectureLocation').val(),
//             Selectcourse: $('#courseSelect').val(),
//             lectureNotes: $('#lectureNotes').val()
//         };

//         // Send updated lecture data to the server
//         fetch("http://yasmeen84983.runasp.net/api/Lecture/" + lectureId, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(updatedLecture)
//         })
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error(`Failed to update lecture: ${response.status} ${response.statusText}`);
//                 }
//                 // Actions to perform after successful update
//                 // For example, redirecting to another page
//                 window.location.href = 'lecture.html';
//             })
//             .catch(error => console.error('Error:', error));
//     });

//     // Event listener for the update-lec button
//     $(document).on('click', '.update-lec', function () {
//         const lectureId = $(this).data('id');
//         window.location.href = `update_lect.html?lectureId=${lectureId}`;
//     });
// });

// $(document).ready(function () {
//     // Get lectureId from URL parameter
//     const urlParams = new URLSearchParams(window.location.search);
//     const lectureId = urlParams.get('lectureId');

//     // Check if lectureId is not null or undefined
//     if (lectureId) {
//         // Fetch lecture data by lectureId
//         fetch("http://yasmeen84983.runasp.net/api/Lecture/" + lectureId)
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch lecture');
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 console.log("Fetched lecture data:", data); // Log the fetched lecture data
//                 // Populate input fields with lecture data
//                 $('#lectureName').val(data.name);
//                 $('#lectureTime').val(data.time);

//                 // Parse and format the date
//                 const dateValue = new Date(data.date);
//                 const formattedDate = dateValue.toISOString().split('T')[0];
//                 $('#lectureDate').val(formattedDate);

//                 $('#lectureLocation').val(data.location);
//                 $('#lectureNotes').val(data.lectureNotes);

//                 // Check if courseId is not undefined
//                 if (data.courseId !== undefined) {
//                     // Fetch all courses and set the course name
//                     fetch("http://yasmeen84983.runasp.net/api/Course/GetAllCourses")
//                         .then(response => {
//                             if (!response.ok) {
//                                 throw new Error('Failed to fetch courses');
//                             }
//                             return response.json();
//                         })
//                         .then(courses => {
//                             console.log("Fetched course data:", courses); // Log the fetched course data
//                             const course = courses.find(course => course.id.toString() === data.courseId.toString());
//                             if (course) {
//                                 console.log("Matched course:", course); // Log the matched course
//                                 $('#courseSelect').append(`<option value="${course.id}" selected>${course.name}</option>`);
//                             } else {
//                                 console.log("No matching course found for courseId:", data.courseId); // Log if no course matched
//                             }
//                         })
//                         .catch(error => console.error('Error fetching courses:', error));
//                 }
//             })
//             .catch(error => console.error('Error:', error));
//     }

//     // Update lecture data on form submission
//     $('#update-form').submit(function (event) {
//         event.preventDefault();

//         // Get updated lecture data from input fields
//         const updatedLecture = {
//             name: $('#lectureName').val(),
//             time: $('#lectureTime').val(),
//             date: $('#lectureDate').val(),
//             location: $('#lectureLocation').val(),
//             Selectcourse: $('#courseSelect').val(),
//             lectureNotes: $('#lectureNotes').val()
//         };

//         // Send updated lecture data to the server
//         fetch("http://yasmeen84983.runasp.net/api/Lecture/" + lectureId, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(updatedLecture)
//         })
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error(`Failed to update lecture: ${response.status} ${response.statusText}`);
//                 }
//                 // Actions to perform after successful update
//                 // For example, redirecting to another page
//                 window.location.href = 'lecture.html';
//             })
//             .catch(error => console.error('Error:', error));
//     });

//     // Event listener for the update-lec button
//     $(document).on('click', '.update-lec', function () {
//         const lectureId = $(this).data('id');
//         window.location.href = `update_lect.html?lectureId=${lectureId}`;
//     });
// });
