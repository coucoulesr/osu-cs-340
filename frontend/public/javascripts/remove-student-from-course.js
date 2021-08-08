const removeStudentFromCourse = async (student_id, class_id) => {
  try {
    const response = await fetch("/remove-student-from-course", {
      method: "DELETE",
      body: JSON.stringify({ student_id, class_id }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      window.location.replace("/courses/" + class_id);
    } else {
      throw new Error(
        "removeStudentFromCourse response error: HTTP " + response.status
      );
    }
  } catch (e) {
    console.error("removeStudentFromCourse error: ", e.message);
  }
};

const removeButtons = document.getElementsByClassName(
  "js-remove-student-button"
);

for (button of removeButtons) {
  button.addEventListener("click", (e) => {
    let target = e.target;
    while (!target.dataset.studentId) {
      target = target.parentElement;
    }
    removeStudentFromCourse(target.dataset.studentId, target.dataset.courseId);
  });
}
