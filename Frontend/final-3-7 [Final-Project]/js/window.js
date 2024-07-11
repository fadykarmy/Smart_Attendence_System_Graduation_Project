// window.addEventListener("load", () => {
//   const loader = document.querySelector(".loader");
//   loader.classList.add("loader-hidden");
//   loader.addEventListener("transitionend", () => {
//     document.body.removeChild("loader");
//   });
// });
$(document).ready(function () {
  // Fetch courses from API
  fetch("http://kero123.runasp.net/api/Course/GetAllCourses", {
    method: "GET",
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJEb2FhYUFobWVkIiwianRpIjoiOTgxMmMyMzktN2FmYS00YzBhLTkyNTYtYjFkNjZhMThjY2RkIiwiZW1haWwiOiJkb2FhMUBnbWFpbC5jb20iLCJ1aWQiOiJjODg5YTkzMy0xNWZhLTRlMDYtOWFhMS04NmFiZGUyNjE5ZmIiLCJyb2xlcyI6IlByb2Zlc3NvciIsImV4cCI6MTcwNzYwOTI2MywiaXNzIjoiU2VjdXJlQXBpIiwiYXVkIjoiU2VjdXJlQXBpVXNlciJ9.9qsx8WU_SZecuhBfKGORdvgt0JAUKYVuwdUk77G7kCI",
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        console.log("Courses fetched successfully");
        return response.json();
      } else {
        throw new Error(
          `Failed to fetch courses: ${response.status} ${response.statusText}`
        );
      }
    })
    .then((data) => {
      // Create the header section
      const headerTemplate = `
      <thead class="block-course" >
        <tr class="lecture">
          <th scope="col">id</th>
          <th scope="col">Name</th>
          <th scope="col">Level</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody id="course-table" class="block-course"></tbody>
    `;

      // Append the header to the table
      $("#course-table").append(headerTemplate);
      // Create table rows for each course
      data.forEach((course) => {
        const courseTemplate = `
        <tr class="course" style="background-color: #ffffff8a; ">
          <td>${course.id}</td>
          <td class="name">${course.name}</td>
          <td>${course.level}</td>
          <td class="align-items center;">
            <button class="btn  rounded-pill view-course" data-id="${course.id}">
              view
            </button>
            <a href="lect-cor.html?courseId=${course.id}" class="btn btn-primary rounded-pill show-lect btn-sm mr-2">
              Show Lectures
            </a>
            <button class="btn btn-success btn-sm rounded-pill add-lect" data-id="${course.id}">
              Add Lecture
            </button>
            <button class="btn btn-info btn-sm rounded-pill updateBtn" data-id="${course.id}">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="btndelete btn-sm rounded-pill js-delete" data-id="${course.id}">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </td>
        </tr>
      `;
        $("#course-table").append(courseTemplate);
      });

      // var divbutton = document.getElementById("#container1");
      // // Create the header section
      // const buttonTemplate = `
      //   <button
      //   class="submit-btn-contact rounded-pill js-delete"
      //   style="width: 160px;"
      //   >Delete All</button
      //  >
      // `;
      // // Append the header to the table
      // $("#container1").append(buttonTemplate);
    })
    .catch((error) => {
      console.error("Error:", error);
    });

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

  // Event listener for the "View Course" button
  $(document).on("click", ".view-course", function () {
    var btn = $(this);
    var courseId = btn.data("id");

    // Redirect to the course.html page with the courseId as a query parameter
    window.location.href = `course.html?courseId=${courseId}`;
  });

  $(document).on("click", ".add-lect", function () {
    var btn = $(this);
    var courseId = btn.data("id");

    // Redirect to the course.html page with the courseId as a query parameter
    window.location.href = `create_lecture.html?courseId=${courseId}`;
  });

  $(document).on("click", ".js-delete", function () {
    var btn = $(this);
    var courseId = btn.data("id");

    // Show confirmation dialog before deleting
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
            url: `http://kero123.runasp.net/api/Course/${courseId}`,
            method: "DELETE",
            success: function () {
              // Display success message
              swal.fire("Deleted!", "Course has been deleted.", "success");
              // Remove the deleted lecture from the DOM
              btn.closest("tr").fadeOut();
              // btn.parents("tr").fadeOut();
            },
            error: function () {
              // Display error message
              swal.fire("Oops..", "Something went wrong!", "error");
            },
          });
        }
      });
  });

  // $(document).on("click", ".js-delete", function () {
  //   var btn = $(this);

  //   // Show confirmation dialog before deleting
  //   const swal = Swal.mixin({
  //     customClass: {
  //       confirmButton: "btn btn-danger mx-2 pe-2",
  //       cancelButton: "btn btn-light mx-3",
  //     },
  //     buttonsStyling: false,
  //   });

  //   swal
  //     .fire({
  //       title: "Are you sure you want to delete?",
  //       text: "You won't be able to revert this!",
  //       icon: "warning",
  //       showCancelButton: true,
  //       confirmButtonText: "Yes, delete!",
  //       cancelButtonText: "No, cancel!",
  //       reverseButtons: true,
  //     })
  //     .then((result) => {
  //       if (result.isConfirmed) {
  //         // Send AJAX request to delete all courses
  //         $.ajax({
  //           url: `http://kero123.runasp.net/api/Course/DeleteAllCourses`,
  //           method: "DELETE",
  //           success: function () {
  //             // Remove all <tr> elements within <tbody> from the DOM
  //             $("tbody").empty();

  //             // Display success message
  //             swal
  //               .fire(
  //                 "Deleted!",
  //                 "All courses and lectures have been deleted.",
  //                 "success"
  //               )
  //               .then(() => {
  //                 // Show another alert after deletion
  //                 swal.fire(
  //                   "Alert",
  //                   `<span style="color: red; font-weight: bold;">Make refresh to load page</span>`,
  //                   "info"
  //                 );
  //               });
  //           },
  //           error: function () {
  //             // Display error message
  //             swal.fire("Oops..", "Something went wrong!", "error");
  //           },
  //         });
  //       }
  //     });
  // });
});

//worrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrk الاصلى
// fetch(
//   "http://yasmeen84983.runasp.net/api/Course/GetAllCourses",
//   {
//     method: "GET",
//     headers: {
//       Authorization:
//         "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJEb2FhYUFobWVkIiwianRpIjoiOTgxMmMyMzktN2FmYS00YzBhLTkyNTYtYjFkNjZhMThjY2RkIiwiZW1haWwiOiJkb2FhMUBnbWFpbC5jb20iLCJ1aWQiOiJjODg5YTkzMy0xNWZhLTRlMDYtOWFhMS04NmFiZGUyNjE5ZmIiLCJyb2xlcyI6IlByb2Zlc3NvciIsImV4cCI6MTcwNzYwOTI2MywiaXNzIjoiU2VjdXJlQXBpIiwiYXVkIjoiU2VjdXJlQXBpVXNlciJ9.9qsx8WU_SZecuhBfKGORdvgt0JAUKYVuwdUk77G7kCI",
//       "Content-Type": "application/json",
//     },
//     // body: JSON.stringify(requestData),
//   }
// )
//   .then((response) => {
//     if (response.ok) {
//       console.log("Course added successfully");
//       return response.json(); // Parse response body as JSON
//     } else {
//       throw new Error(
//         `Failed to add course: ${response.status} ${response.statusText}`
//       );
//     }
//   })
//   .then((data) => {
//     // Create the header section
//     const headerTemplate = `
//       <thead class="block-course">
//         <tr class="lecture">
//           <th scope="col">id</th>
//           <th scope="col">Name</th>
//           <th scope="col">Level</th>
//           <th scope="col">Action</th>
//         </tr>
//       </thead>
//       <tbody id="course-table" class="block-course"></tbody>
//     `;

//     // Append the header to the table
//     $("#course-table").append(headerTemplate);

//     // Iterate over each course data and create table rows
//     data.forEach((course) => {
//       const courseTemplate = `
//       <tr class="course">
//         <td>${course.id}</td>
//         <td class="name">${course.name}</td>
//         <td>${course.level}</td>
//         <td class="align-items center;">
//           <button class="btn  rounded-pill view-course" data-id="${course.id}">
//             view
//           </button>
//           <button class="btn  rounded-pill show-lect" data-id="${course.id}">
//             show lect
//           </button>
//           <button class="btn  rounded-pill add-lect" data-id="${course.id}">
//             Add lectutre
//           </button>
//           <button class="btn rounded-pill update-lec" data-id="${course.id}">
//             <i class="fa-solid fa-pen-to-square"></i>
//           </button>
//           <button class="btn deleteBtn rounded-pill js-delete" data-id="${course.id}">
//             <i class="fa-regular fa-trash-can"></i>
//           </button>

//         </td>
//       </tr>
//     `;

//       // Append the table row to the table body
//       $("#course-table").append(courseTemplate);
//     });
//   })
// .catch((error) => {
//   console.error("Error:", error);
// });

// "use strict";
// let showModal = document.querySelectorAll(".showModal");
// let closeWindow = document.querySelector(".closeWindow");
// let modal = document.querySelector(".modal");
// let overlay = document.querySelector(".overlay");

// let open = function () {
//   // e.preventDefault();
//   console.log("Modal:", modal);
//   modal.classList.remove("hidden");
//   overlay.classList.remove("hidden");
// };
// let close = function () {
//   modal.classList.add("hidden");
//   overlay.classList.add("hidden");
// };

// closeWindow.addEventListener("click", close);
// overlay.addEventListener("click", close);

// document.addEventListener("click", function (e) {
//   if (e.target.classList.contains("showModal")) {
//     open();
//   }

// });

// document.addEventListener("keydown", function (e) {
//   if (e.key === "Escape" && !modal.classList.contains("hidden")) close();
// });
// document.addEventListener("keydown", function (e) {
//   if (e.key === "Escape" && !modal.classList.contains("hidden")) close();
// });

// impppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp

// let allLectures = {};

// // Fetch all courses
// fetch(
//   "http://yasmeen84983.runasp.net/api/Course/GetAllCourses",
//   {
//     method: "GET",
//     headers: {
//       Authorization:
//         "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJEb2FhYUFobWVkIiwianRpIjoiOTgxMmMyMzktN2FmYS00YzBhLTkyNTYtYjFkNjZhMThjY2RkIiwiZW1haWwiOiJkb2FhMUBnbWFpbC5jb20iLCJ1aWQiOiJjODg5YTkzMy0xNWZhLTRlMDYtOWFhMS04NmFiZGUyNjE5ZmIiLCJyb2xlcyI6IlByb2Zlc3NvciIsImV4cCI6MTcwNzYwOTI2MywiaXNzIjoiU2VjdXJlQXBpIiwiYXVkIjoiU2VjdXJlQXBpVXNlciJ9.9qsx8WU_SZecuhBfKGORdvgt0JAUKYVuwdUk77G7kCI",
//       "Content-Type": "application/json",
//     }
//   }
// )
//   .then(response => {
//     if (response.ok) {
//       return response.json(); // Parse response body as JSON
//     } else {
//       throw new Error(`Failed to fetch courses: ${response.status} ${response.statusText}`);
//     }
//   })
//   .then(courses => {
//     // Create the header section
//     const headerTemplate = `
//       <thead class="block-course">
//         <tr class="lecture">
//           <th scope="col">id</th>
//           <th scope="col">Name</th>
//           <th scope="col">Level</th>
//           <th scope="col">Action</th>
//         </tr>
//       </thead>
//       <tbody id="course-table" class="block-course"></tbody>
//     `;

//     // Append the header to the table
//     $("#course-table").append(headerTemplate);

//     // Iterate over each course data and create table rows
//     courses.forEach(course => {
//       const courseTemplate = `
//       <tr class="course">
//         <td>${course.id}</td>
//         <td class="name">${course.name}</td>
//         <td>${course.level}</td>
//         <td class="align-items center;">
//           <button class="btn rounded-pill view-course" data-id="${course.id}">
//             view
//           </button>
//           <button class="btn rounded-pill show-lect" data-id="${course.id}">
//             show lect
//           </button>
//           <button class="btn rounded-pill add-lect" data-id="${course.id}">
//             Add lecture
//           </button>
//           <button class="btn rounded-pill update-lec" data-id="${course.id}">
//             <i class="fa-solid fa-pen-to-square"></i>
//           </button>
//           <button class="btn deleteBtn rounded-pill js-delete" data-id="${course.id}">
//             <i class="fa-regular fa-trash-can"></i>
//           </button>
//         </td>
//       </tr>
//       <tr class="lectures" id="lectures-${course.id}" style="display:none;">
//         <td colspan="4">
//           <table class="table">
//             <thead>
//               <tr>
//                 <th scope="col">Lecture ID</th>
//                 <th scope="col">Lecture name</th>
//                 <th scope="col">Lecture time</th>
//                 <th scope="col">Lecture date</th>
//                 <th scope="col">Lecture location</th>
//                 <th scope="col">Lecture lectureNotes</th>
//               </tr>
//             </thead>
//             <tbody class="lecture-list" id="lecture-list-${course.id}">
//             </tbody>
//           </table>
//         </td>
//       </tr>
//       `;

//       // Append the table row to the table body
//       $("#course-table").append(courseTemplate);
//     });

//     // Fetch all lectures
//     return fetch(
//       "http://yasmeen84983.runasp.net/api/Lecture/GetAllLectures",
//       {
//         method: "GET",
//         headers: {
//           Authorization:
//             "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJEb2FhYUFobWVkIiwianRpIjoiOTgxMmMyMzktN2FmYS00YzBhLTkyNTYtYjFkNjZhMThjY2RkIiwiZW1haWwiOiJkb2FhMUBnbWFpbC5jb20iLCJ1aWQiOiJjODg5YTkzMy0xNWZhLTRlMDYtOWFhMS04NmFiZGUyNjE5ZmIiLCJyb2xlcyI6IlByb2Zlc3NvciIsImV4cCI6MTcwNzYwOTI2MywiaXNzIjoiU2VjdXJlQXBpIiwiYXVkIjoiU2VjdXJlQXBpVXNlciJ9.9qsx8WU_SZecuhBfKGORdvgt0JAUKYVuwdUk77G7kCI",
//           "Content-Type": "application/json",
//         }
//       }
//     );
//   })
//   .then(response => {
//     if (response.ok) {
//       return response.json(); // Parse response body as JSON
//     } else {
//       throw new Error(`Failed to fetch lectures: ${response.status} ${response.statusText}`);
//     }
//   })
//   .then(lectures => {
//     // Organize lectures by course ID
//     lectures.forEach(lecture => {
//       if (!allLectures[lecture.courseId]) {
//         allLectures[lecture.courseId] = [];
//       }
//       allLectures[lecture.courseId].push(lecture);
//     });

//     // Event listener for show lecture button
//     $(".show-lect").on("click", function () {
//       const courseId = $(this).data("id");
//       displayLectures(courseId);
//     });
//   })
//   .catch(error => {
//     console.error(error.message);
//   });

// // Function to display lectures for a specific course
// function displayLectures(courseId) {
//   // Clear the existing lectures for the course
//   $(`#lecture-list-${courseId}`).empty();

//   // Get lectures for the specific course
//   const lectures = allLectures[courseId] || [];

//   // Append each lecture to the lecture list
//   lectures.forEach(lecture => {
//     const lectureTemplate = `
//       <tr>
//         <td>${lecture.id}</td>
//         <td>${lecture.name}</td>
//         <td>${lecture.time}</td>
//         <td>${lecture.date}</td>
//         <td>${lecture.location}</td>
//         <td>${lecture.lectureNotes}</td>
//       </tr>
//     `;
//     $(`#lecture-list-${courseId}`).append(lectureTemplate);
//   });

//   // Toggle the lecture display
//   $(`#lectures-${courseId}`).toggle();
// }

// .then((data) => {
//   console.log("Data received:", data); // Handle response data
//   // Create a template for the "block-course" element
//   const coursesSection = document.getElementById("courses-section");
//   coursesSection.textContent = "";
//   data.forEach((course) => {
//     const courseTemplate = `

//     `;
//     console.log(data);
//     coursesSection.insertAdjacentHTML("beforeend", courseTemplate);
//   });
// })

// Handle errors, such as displaying an error message to the user

// Event binding for delete buttons
// $(document).on("click", ".js-delete", function () {
//   var btn = $(this);
//   var lectureId = btn.data("id");

//   // Debugging: Check if lectureId is properly retrieved
//   console.log("lectureId:", lectureId);

//   if (lectureId) {
//     // Your delete logic here
//     console.log("Deleting lecture with ID:", lectureId);
//   } else {
//     // Handle case where lectureId is undefined
//     console.error("Error: Lecture ID is undefined");
//     // Optionally, display an error message to the user
//     alert("Error: Lecture ID is undefined. Please try again later.");
//   }

// $(document).on("click", ".js-delete", function () {
//   var btn = $(this);
//   var lectureId = btn.data("id");

//   // Debugging: Check if lectureId is properly retrieved
//   console.log("lectureId:", lectureId);

//   if (lectureId) {
//     // Your delete logic here
//     console.log("Deleting lecture with ID:", lectureId);
//   } else {
//     // Handle case where lectureId is undefined
//     console.error("Error: Lecture ID is undefined");
//     // Optionally, display an error message to the user
//     alert("Error: Lecture ID is undefined. Please try again later.");
//   }

// $(document).ready(function (){
//   $(".js-delete").on("click", function () {
//     var btn = $(this);
//     // console.log(btn.data('id'));
//     const swal = Swal.mixin({
//       customClass: {
//         confirmButton: "btn btn-danger mx-2 pe-2",
//         cancelButton: "btn btn-light mx-2",
//       },
//       buttonsStyling: false,
//     });

//     swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes, delete it!",
//       cancelButtonText: "No, cancel!",
//       reverseButtons: true
//     }).then((result) => {
//       //console.log(result.isConfirmed);
//       if (result.isConfirmed) {
//         $.ajax({
//           url: `http://testyasmeenasp2-001-site1.etempurl.com/api/Course/${btn.data('id')}`,
//           method: "DELETE",
//           success: function () {
//             // alert('success');
//             swal.fire({
//               title: "Deleted!",
//               text: "Your file has been deleted.",
//               icon: "success"
//             });
//             // Display success message
//                        // swal.fire("Deleted!", "Lecture has been deleted.", "success");
//             // Remove the deleted lecture from the DOM
//                        // btn.closest("tr").fadeOut();
//             // btn.parents("tr").fadeOut();
//           },
//           error: function () {
//             swal.fire({
//               title: "ooops!",
//               text: "fail.",
//               icon: "error"
//             });
//             // alert('error');
//             // Display error message
//                         // swal.fire("Oops..", "Something went wrong!", "error");
//           },
//         });

//       }

//     });

//   });

// });

// <h6 class="level"><span>level: </span>${course.level}</h6>

// fetch(
//   "http://testyasmeenasp2-001-site1.etempurl.com/api/Course/ViewCourseDetails",
//   {
//     method: "GET",
//     headers: {
//       Authorization:
//         "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJEb2FhYUFobWVkIiwianRpIjoiOTgxMmMyMzktN2FmYS00YzBhLTkyNTYtYjFkNjZhMThjY2RkIiwiZW1haWwiOiJkb2FhMUBnbWFpbC5jb20iLCJ1aWQiOiJjODg5YTkzMy0xNWZhLTRlMDYtOWFhMS04NmFiZGUyNjE5ZmIiLCJyb2xlcyI6IlByb2Zlc3NvciIsImV4cCI6MTcwNzYwOTI2MywiaXNzIjoiU2VjdXJlQXBpIiwiYXVkIjoiU2VjdXJlQXBpVXNlciJ9.9qsx8WU_SZecuhBfKGORdvgt0JAUKYVuwdUk77G7kCI",
//       "Content-Type": "application/json",
//     },
//     // body: JSON.stringify(requestData),
//   }
// )
//   .then((response) => {
//     if (response.ok) {
//       console.log("show details successfully");
//       return response.json(); // Parse response body as JSON
//     } else {
//       throw new Error(
//         `Failed to add course: ${response.status} ${response.statusText}`
//       );
//     }
//   })
//   .then((data) => {
//     console.log("Data received:", data); // Handle response data
//     // Create a template for the "block-course" element
//     const coursesSection = document.getElementById("modal hidden qrShow");
//     coursesSection.textContent = "";
//     data.forEach((course) => {
//       const courseTemplate = `
//       <img
//       class="course-img"
//       src="../img/vecteezy_universe-lettering-with-sun_6071564.jpg"
//       alt="${course.name}"
//       />

//       < class="course-content">

//           <h5 class="title-page">${course.name}</h5>
//           <div class="details" id="Level">
//               <h3 class="text-course text-capitalize">Level: <span>${course.level}</span></h3>
//           </div>
//           <div class="details" id="Semester">
//               <h3 class="text-course text-capitalize">Semester: <span>${course.Semester}</span></h3>
//           </div>
//           <div class="details" id="credit_hours">
//               <h3 class="text-course text-capitalize">Credit hours: <span>${course.CreditHours}</span></h3>
//           </div>
//           <div class="details" id="Departement">
//               <h3 class="text-course text-capitalize">
//                 Departement: <span>${course.Departement}</span>
//               </h3>
//           </div>
//           <div class="details" id="LowestAttendanceRate">
//               <h3 class="text-course text-capitalize">
//                 LowestAttendanceRate: <span>${course.LowestAttendanceRate}</span>
//               </h3>
//           </div>
//           <div class="details" id="AttendanceInstruction">
//               <h3 class="text-course text-capitalize">
//                 AttendanceInstruction: <span>${course.AttendanceInstruction}</span>
//               </h3>
//           </div>

//           <div class="btn-footer">
//             <a href="create_lecture.html" class="course-button rounded-pill">Add Lecture</a>
//             <a href="Allcourses.html" class="course-button rounded-pill">Back</a>
//             <a href="Allcourses.html" class="course-button rounded-pill"><i class="fa-solid fa-pen-to-square"></i></a>
//             <a href="javascript:;" class="course-button rounded-pill col-md-3 ms-2 js-delete"><i class="fa-regular fa-trash-can"></i></a>
//           </div>
//       </div>
//       `;
//       console.log(data);
//       coursesSection.insertAdjacentHTML("beforeend", courseTemplate);
//     });
//   })
//   .catch((error) => {
//     console.error("Error:", error);
//     // Handle errors, such as displaying an error message to the user
