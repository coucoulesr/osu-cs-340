const deleteComment = async (id) => {
  try {
    const response = await fetch("/delete-comment/" + id, {
      method: "DELETE",
    });
    if (response.ok) {
      window.location.reload();
    } else {
      throw new Error("deleteComment response error: HTTP " + response.status);
    }
  } catch (e) {
    console.error(e);
  }
};

const deleteButtons = document.getElementsByClassName(
  "js-delete-comment-button"
);

for (button of deleteButtons) {
  button.addEventListener("click", (e) => {
    let target = e.target;
    while (!target.dataset.commentId) {
      target = target.parentElement;
    }
    deleteComment(target.dataset.commentId);
  });
}
