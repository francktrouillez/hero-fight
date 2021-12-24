def read_file(file):
  f = open(file)
  lines = f.readlines()
  f.close()
  return lines

def write_file(file, text):
  f = open(file, "w")
  f.write(text)
  f.close()

def extend_str(str, end_value):
  while (len(str) < end_value):
    str += "0"
  return str

def parse_obj(lines, new_tex, first_tex_counter):
  out = ""
  for line in lines:
    elements = line.split(' ')
    if elements[0] == 'usemtl':
      first_tex_counter -= 1
    elif elements[0] != 'vt':
      out += line
      continue
    else:
      if (first_tex_counter > 0):
        new_elements = []
        new_elements.append(extend_str(str(round(float(elements[1])/2, 6)), 8))
        new_elements.append(elements[2])
        out += "vt " + ' '.join(new_elements)
      else:
        new_elements = []
        new_elements.append(extend_str(str(0.5 + round(float(elements[1])/2, 6)), 8))
        new_elements.append(elements[2])
        out += "vt " + ' '.join(new_elements)
  out = "usemtl "+ new_tex + '\n' + out
  return out

def parse_frame(lines):
  out = ""
  for line in lines:
    elements = line.split(' ')
    if elements[0] == 'v' or elements[0] == "vn":
      out += line
  return out

for i in range(41):
  write_file("idle/"+ str(i) + ".obj", parse_frame(read_file("raw/" + str(i) + ".obj")), )
