export default class FormHelper {
  static openWindow(verb, url, data) {
    var form = document.createElement("form");
    form.action = url;
    form.method = verb;
    form.target = "_blank";
    if (data) {
      for (var key in data) {
        var input = document.createElement("input");
        input.name = key;
        input.value = typeof data[key] === "object" ? JSON.stringify(data[key]) : data[key];
        form.appendChild(input);
      }
    }
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }

  static downloadFile(filePath) {
    // this.openWindow("GET", filePath, null);
    let link = document.createElement("a");
    link.href = filePath;
    link.download = filePath.substr(filePath.lastIndexOf("/") + 1);
    link.click();
  }
}