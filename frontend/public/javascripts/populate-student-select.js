const createOption = ({ id, pin, first_name, last_name }) => {
  const output = document.createElement("option");
  output.innerHTML = `${pin} - ${first_name} ${last_name}`;
  output.setAttribute("value", id);
  return output;
};

const populateStudentSelect = async (selectElement) => {
  try {
    const response = await fetch("/students-list");
    if (response.ok) {
      const students = await response.json();
      for (let student of students) {
        selectElement.appendChild(createOption(student));
      }
    } else {
      throw new Error(
        "populateStudentSelect response error: HTTP" + response.status
      );
    }
  } catch (e) {
    console.error(e);
  }
};

const selectElement = document.getElementById("add-student-select");
populateStudentSelect(selectElement);
