const deleteAssignment = async (id) => {
  try {
    const response = await fetch("/delete-assignment/" + id, {
      method: "DELETE",
    });
    if (response.ok) {
      window.location.reload();
    } else {
      throw new Error(
        "deleteAssignment response error: HTTP " + response.status
      );
    }
  } catch (e) {
    console.error(e);
  }
};

const deleteButtons = document.getElementsByClassName(
  "js-delete-assignment-button"
);

for (button of deleteButtons) {
  button.addEventListener("click", (e) => {
    let target = e.target;
    while (!target.dataset.assignmentId) {
      target = target.parentElement;
    }
    deleteAssignment(target.dataset.assignmentId);
  });
}
