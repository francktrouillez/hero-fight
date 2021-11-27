async function read_file(file) {
  const response = await fetch(file);
  const text = await response.text();
  return text;
}