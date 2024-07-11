$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get("courseId");
  let courseName = "";

  if (courseId) {
    $.get(
      "http://kero123.runasp.net/api/Course/GetAllCourses",
      function (data) {
        data.forEach(function (course) {
          if (course.id.toString() === courseId) {
            $("#courseSelect").append(
              "<option selected value='" +
                course.id +
                "'>" +
                course.name +
                "</option>"
            );
          }
        });
      }
    );
  } else {
    $.get("http://kero123.runasp.net/api/Course/SelectCourse", function (data) {
      data.forEach(function (course) {
        $("#courseSelect").append(
          `<option value="${course.id}">${course.name}</option>`
        );
      });
    });
  }

  // Add a submit event listener to handle form submission
  $("#lectureForm").submit(function (event) {
    event.preventDefault();

    // Get the selected course ID from the select list
    var courseId = $("#courseSelect").val();
    var lectureName = $("#lectureName").val();
    var lectureTime = $("#lectureTime").val();
    var lectureDate = $("#lectureDate").val();
    var lectureLocation = $("#lectureLocation").val();
    var lectureNotes = $("#lectureNotes").val();

    // Check if all required fields are filled
    let isValid = true;

    if (!courseId) {
      $("#courseSelect").css("border", "2px solid red");
      $("#coursename").css({ color: " red", "font-weight": "bold" });
      isValid = false;
    } else {
      $("#courseSelect").css("border", "");
    }

    if (!lectureName) {
      $("#lectureName").css("border", "2px solid red");
      $("#coursename").css({ color: " red", "font-weight": "bold" });
      isValid = false;
    } else {
      $("#lectureName").css("border", "");
    }

    if (!lectureTime) {
      $("#lectureTime").css("border", "2px solid red");
      $("#time").css({ color: " red", "font-weight": "bold" });
      isValid = false;
    } else {
      $("#lectureTime").css("border", "");
    }

    if (!lectureDate) {
      $("#lectureDate").css("border", "2px solid red");
      $("#date").css({ color: " red", "font-weight": "bold" });

      isValid = false;
    } else {
      $("#lectureDate").css("border", "");
    }

    if (!lectureLocation) {
      $("#lectureLocation").css("border", "2px solid red");
      $("#location").css({ color: " red", "font-weight": "bold" });
      isValid = false;
    } else {
      $("#lectureLocation").css("border", "");
    }

    if (!isValid) {
      alert("Please fill out all required fields.");
      return;
    }

    // Prepare the data to send to the API
    var lectureData = {
      CourseId: courseId,
      Name: lectureName,
      Date: lectureDate,
      Time: lectureTime,
      Location: lectureLocation,
      LectureNotes: lectureNotes,
    };

    $.ajax({
      url: "http://kero123.runasp.net/api/Lecture/AddLecture",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(lectureData),
      success: function (response) {
        window.location.href = "Allcourses.html";
      },
      error: function (xhr, status, error) {
        console.error("Error adding lecture:", error);
      },
    });
  });
});



// document.getElementById('lectureForm').addEventListener('submit', function(event) {
//     event.preventDefault(); // Prevent default form submission

//     // Function to check if element exists
//     function checkElement(id) {
//         const element = document.getElementById(id);
//         if (!element) {
//             return false;
//         }
//         return true;
//     }

//     // Check if the elements with required IDs exist
//     const lectureNameExists = checkElement('lectureName');
//     const lectureTimeExists = checkElement('lectureTime');
//     const lectureDateExists = checkElement('lectureDate');
//     const lectureLocationExists = checkElement('lectureLocation');

//     // If any of the required elements are missing, highlight them in red
//     if (!lectureNameExists) {
//         document.getElementById('lectureName').style.borderColor = 'red';
//     } else {
//         document.getElementById('lectureName').style.borderColor = '';
//     }

//     if (!lectureTimeExists) {
//         document.getElementById('lectureTime').style.borderColor = 'red';
//     } else {
//         document.getElementById('lectureTime').style.borderColor = '';
//     }

//     if (!lectureDateExists) {
//         document.getElementById('lectureDate').style.borderColor = 'red';
//     } else {
//         document.getElementById('lectureDate').style.borderColor = '';
//     }

//     if (!lectureLocationExists) {
//         document.getElementById('lectureLocation').style.borderColor = 'red';
//     } else {
//         document.getElementById('lectureLocation').style.borderColor = '';
//     }

//     // If any of the required elements are missing, prevent form submission
//     if (!lectureNameExists || !lectureTimeExists || !lectureDateExists || !lectureLocationExists) {
//         console.log('Please fill in all required fields.');
//         return;
//     }

//     // Proceed with form submission if all required fields are present
//     // Add your code here to submit the form data

//   function generateQRCode() {
//       // Generate a random string (you can replace this logic as needed)
//       var randomString = Math.random().toString(36).substring(7);

//       // Redirect to the QR code page with the random string as a parameter
//       window.location.href = 'qrcode.html?data=' + randomString;
//   }

//   // Collect requestData
//   const requestData = {
//     Name: document.getElementById("lectureName").value,
//     time: document.getElementById("lectureTime").value,
//     date: document.getElementById("lectureDate").value,
//     location: document.getElementById("lectureLocation").value,
//     lectureNotes: document.getElementById("lectureNotes").value
//   };

//   // Send data to the API
//   fetch(
//     "http://testyasmeenasp2-001-site1.etempurl.com/api/Lecture/AddLecture",
//     {
//       method: "POST",
//       headers: {
//         Authorization:
//           "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJEb2FhYUFobWVkIiwianRpIjoiOTgxMmMyMzktN2FmYS00YzBhLTkyNTYtYjFkNjZhMThjY2RkIiwiZW1haWwiOiJkb2FhMUBnbWFpbC5jb20iLCJ1aWQiOiJjODg5YTkzMy0xNWZhLTRlMDYtOWFhMS04NmFiZGUyNjE5ZmIiLCJyb2xlcyI6IlByb2Zlc3NvciIsImV4cCI6MTcwNzYwOTI2MywiaXNzIjoiU2VjdXJlQXBpIiwiYXVkIjoiU2VjdXJlQXBpVXNlciJ9.9qsx8WU_SZecuhBfKGORdvgt0JAUKYVuwdUk77G7kCI",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(requestData),
//     }
//   )
//     .then((response) => {
//       if (response.ok) {
//         //console.log("Course added successfully");
//         window.location.href = "lecture.html";
//         return response.json(); // Parse response body as JSON
//       } else {
//         throw new Error(
//           `Failed to add course: ${response.status} ${response.statusText}`
//         );
//       }
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//       // Handle errors, such as displaying an error message to the user
//     });
// });

// $(document).ready(function () {
//   const urlParams = new URLSearchParams(window.location.search);
//   const courseId = urlParams.get('courseId');
//   let courseName = '';

//   if(courseId){
//     $.get(
//       "http://yasmeen84983.runasp.net/api/Course/GetAllCourses",
//       function (data) {
//         data.forEach(function (course) {
//           // Check if the course ID matches the one from the URL
//           if (course.id.toString() === courseId) {
//             // Set the input field value to the course name
//             $("#courseSelect").append(
//               "<option value='" + course.id + "'>" + course.name + "</option>"
//             );
//           }
//         });
//       }
//     );
//   } else {
//     $.get("http://yasmeen84983.runasp.net/api/Course/SelectCourse", function(data) {
//       // Iterate over the courses and populate the select list
//       data.forEach(function(course) {
//         $("#courseSelect").append(`<option value="${course.id}">${course.name}</option>`);
//       });
//     });
//   }

//   // Add a submit event listener to handle form submission
//   $("#lectureForm").submit(function (event) {
//     event.preventDefault();

//     // Get the selected course ID from the select list
//     var courseId = $("#courseSelect").val();
//     var lectureName = $("#lectureName").val();
//     var lectureTime = $("#lectureTime").val();
//     var lectureDate = $("#lectureDate").val();
//     var lectureLocation = $("#lectureLocation").val();
//     var lectureNotes = $("#lectureNotes").val();

//     // Check if all required fields are filled
//     if (!courseId || !lectureName || !lectureTime || !lectureDate || !lectureLocation) {
//       alert("Please fill out all required fields.");
//       return;
//     }

//     // Prepare the data to send to the API
//     var lectureData = {
//       CourseId: courseId,
//       Name: lectureName,
//       Date: lectureDate,
//       Time: lectureTime,
//       Location: lectureLocation,
//       LectureNotes: lectureNotes,
//     };

//     $.ajax({
//       url: "http://yasmeen84983.runasp.net/api/Lecture/AddLecture",
//       type: "POST",
//       contentType: "application/json",
//       data: JSON.stringify(lectureData),
//       success: function (response) {
//         window.location.href = "lecture.html";
//       },
//       error: function (xhr, status, error) {
//         console.error("Error adding lecture:", error);
//       },
//     });
//   });
// });

// wooooooooooooooooooooooooork
// $(document).ready(function () {
//   // Make a GET request to fetch the list of courses
//   // Make a GET request to fetch the list of courses
//   const urlParams = new URLSearchParams(window.location.search);
//   const courseId = urlParams.get('courseId');
//   let courseName = '';
// if(courseId){
//   $.get(
//     "http://yasmeen84983.runasp.net/api/Course/GetAllCourses",
//     function (data) {
//       data.forEach(function (course) {
//         // Check if the course ID matches the one from the URL
//         if (course.id.toString() === courseId) {
//           // Set the input field value to the course name
//           $("#courseSelect").append(
//             "<option value='" + course.id + "'>" + course.name + "</option>"
//           )
//           // $("#courseSelect").val(course.name);
//           // courseName = course.name;
//         }
//       });
//     }
//   );
// }
// else{
//     $.get("http://yasmeen84983.runasp.net/api/Course/SelectCourse", function(data) {
//         // Iterate over the courses and populate the select list
//       data.forEach(function(course) {
//       $("#courseSelect").append(`<option value="${course.id}">${course.name}</option>`);
//     });
//     });
// }

//   // Add a submit event listener to handle form submission
//   $("#lectureForm").submit(function (event) {
//     event.preventDefault();

//     // Get the selected course ID from the select list
//     var courseId = $("#courseSelect").val();
//     var lectureName = $("#lectureName").val();
//     var lectureTime = $("#lectureTime").val();
//     var lectureDate = $("#lectureDate").val();
//     var lectureLocation = $("#lectureLocation").val();
//     var lectureNotes = $("#lectureNotes").val();

//     // Prepare the data to send to the API
//     var lectureData = {
//       CourseId: courseId,
//       Name: lectureName,
//       Date: lectureDate,
//       Time: lectureTime,
//       Location: lectureLocation,
//       LectureNotes: lectureNotes,
//     };

//     $.ajax({
//       url: "http://yasmeen84983.runasp.net/api/Lecture/AddLecture",
//       type: "POST",
//       contentType: "application/json",
//       data: JSON.stringify(lectureData),
//       success: function (response) {
//         window.location.href = "lecture.html";
//         // console.log("Added Lecture:", response);
//         // Handle success response here
//       },
//       error: function (xhr, status, error) {
//         console.error("Error adding lecture:", error);
//         // Handle error response here
//       },
//     });
//   });
// });

//   $(document).ready(function() {
//     // Make a GET request to fetch the list of courses
//     $.get("http://testyasmeenasp2-001-site1.etempurl.com/api/Course/SelectCourse", function(data) {
//         // Iterate over the courses and populate the select list
//         data.forEach(function(course) {
//             $("#courseSelect").append(`<option value="${course.Id}">${course.Name}</option>`);
//         });
//     });

//     // Add a submit event listener to handle form submission
//     $("#lectureForm").submit(function(event) {
//         event.preventDefault();

//         // Get the selected course ID from the select list
//         var courseId = $("#courseSelect").val();

//         // Perform other actions like submitting the lecture data to the API
//         // Collect requestData
//     const requestData = {
//       Name: document.getElementById('lectureName').value,
//       Date: document.getElementById('lectureDate').value,
//       Time: document.getElementById('lectureTime').value,
//       Location: document.getElementById('lectureLocation').value,
//       LectureNotes: document.getElementById('lectureNotes').value,
//       CourseId: document.getElementById('course').value
//     };

//     // Send data to the API
//     fetch(
//       "http://testyasmeenasp2-001-site1.etempurl.com/api/Lecture/AddLecture",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(requestData),
//       }
//     )
//       .then((response) => {
//         if (response.ok) {
//           //console.log("Course added successfully");
// window.location.href = "lecture.html";
//           return response.json(); // Parse response body as JSON
//         } else {
//           throw new Error(
//             `Failed to add course: ${response.status} ${response.statusText}`
//           );
//         }
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//         // Handle errors, such as displaying an error message to the user
//       });
//     });
// });

// "use strict";
// console.log("before anything");
// document
//   .getElementById("add-lecture")
//   .addEventListener("click", function (event) {
//     event.preventDefault(); // Prevent default form submission
//     console.log("Hello from listener");

//     // Function to check if element exists
//     function checkElement(id) {
//       const element = document.getElementById(id);
//       if (!element) {
//         return false;
//       }
//       return true;
//     }

//     // Check if the elements with required IDs exist
//     const lectureNameExists = checkElement('lectureName');
//     const lectureTimeExists = checkElement('lectureTime');
//     const lectureDateExists = checkElement('lectureDate');
//     const lectureLocationExists = checkElement('lectureLocation');

//     // If any of the required elements are missing, highlight them in red
//     if (!lectureNameExists) {
//         document.getElementById('lectureName').style.borderColor = 'red';
//     } else {
//         document.getElementById('lectureName').style.borderColor = '';
//     }

//     if (!lectureTimeExists) {
//         document.getElementById('lectureTime').style.borderColor = 'red';
//     } else {
//         document.getElementById('lectureTime').style.borderColor = '';
//     }

//     if (!lectureDateExists) {
//         document.getElementById('lectureDate').style.borderColor = 'red';
//     } else {
//         document.getElementById('lectureDate').style.borderColor = '';
//     }

//     if (!lectureLocationExists) {
//         document.getElementById('lectureLocation').style.borderColor = 'red';
//     } else {
//         document.getElementById('lectureLocation').style.borderColor = '';
//     }

//     // If any of the required elements are missing, prevent form submission
//     if (!lectureNameExists || !lectureTimeExists || !lectureDateExists || !lectureLocationExists) {
//         console.log('Please fill in all required fields.');
//         return;
//     }

//     // Collect requestData
//     const requestData = {
//         name: document.getElementById("lectureName").value,
//         time: document.getElementById("lectureTime").value,
//         date: document.getElementById("lectureDate").value,
//         location: document.getElementById("lectureLocation").value,
//         lectureNotes: document.getElementById("lectureNotes").value
//       };

//     // Send data to the API
//     fetch(
//         "http://testyasmeenasp2-001-site1.etempurl.com/api/Lecture/AddLecture",
//         {
//           method: "POST",
//           headers: {
//             Authorization:
//               "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJEb2FhYUFobWVkIiwianRpIjoiOTgxMmMyMzktN2FmYS00YzBhLTkyNTYtYjFkNjZhMThjY2RkIiwiZW1haWwiOiJkb2FhMUBnbWFpbC5jb20iLCJ1aWQiOiJjODg5YTkzMy0xNWZhLTRlMDYtOWFhMS04NmFiZGUyNjE5ZmIiLCJyb2xlcyI6IlByb2Zlc3NvciIsImV4cCI6MTcwNzYwOTI2MywiaXNzIjoiU2VjdXJlQXBpIiwiYXVkIjoiU2VjdXJlQXBpVXNlciJ9.9qsx8WU_SZecuhBfKGORdvgt0JAUKYVuwdUk77G7kCI",
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(requestData),
//         }
//       )
//         .then((response) => {
//           if (response.ok) {
//             console.log("Done Add lecture");
//             // window.location.href = "lecture.html";
//             return response.json(); // Parse response body as JSON
//           } else {
//             throw new Error(
//               `Failed to add course: ${response.status} ${response.statusText}`
//             );
//           }
//         })
//         .catch((error) => {
//           console.error("Error:", error);
//           // Handle errors, such as displaying an error message to the user
//         });

//     // Proceed with form submission if all required fields are present
//     // Add your code here to submit the form data

//     function generateQRCode() {
//         // Generate a random string (you can replace this logic as needed)
//         var randomString = Math.random().toString(36).substring(7);

//         // Redirect to the QR code page with the random string as a parameter
//         window.location.href = 'qrcode.html?data=' + randomString;
//     }
// });
