const deleteCourse = async (id) => {
  try {
    const response = await fetch("/delete-course/" + id, {
      method: "DELETE",
    });
    if (response.ok) {
      window.location.replace("/");
    } else {
      throw new Error("deleteCourse response error: HTTP ", response.status);
    }
  } catch (e) {
    console.error("deleteCourse error: ", e.message);
  }
};

const deleteButtons = document.getElementsByClassName(
  "js-delete-course-button"
);

for (button of deleteButtons) {
  button.addEventListener("click", () => {
    deleteCourse(button.dataset.courseId);
  });
}
