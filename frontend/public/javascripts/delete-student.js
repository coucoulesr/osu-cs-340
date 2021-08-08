const deleteStudent = async (id) => {
  try {
    const response = await fetch("/delete-student/" + id, {
      method: "DELETE",
    });
    if (response.ok) {
      window.location.replace("/students");
    } else {
      throw new Error("deleteStudent response error: HTTP ", response.status);
    }
  } catch (e) {
    console.error("deleteStudent error: ", e.message);
  }
};

const deleteButtons = document.getElementsByClassName(
  "js-delete-student-button"
);

for (button of deleteButtons) {
  button.addEventListener("click", (e) => {
    let target = e.target;
    while (!target.dataset.studentId) {
      target = target.parentElement;
    }
    deleteStudent(target.dataset.studentId);
  });
}
