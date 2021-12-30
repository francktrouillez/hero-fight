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

def parse_obj(lines):
  out = ""
  for line in lines:
    elements = line.split(' ')
    if elements[0] == 'usemtl':
      continue
    elif elements[0] == 'f':
      new_face = "f "
      for i in range(3):
        new_triangle = elements[i + 1].split('/')
        new_triangle[1] = new_triangle[0]
        new_triangle = '/'.join(new_triangle)
        new_face += new_triangle
        if (i < 2):
          new_face += " "
      out += new_face
    else:
      out += line
  return out


#for i in range(41):
#  write_file("filtered/"+ str(i) + ".obj", parse_obj(read_file("raw/" + str(i) + ".obj"), "Dragon_Texture", 6))

write_file("Disk.obj", parse_obj(read_file("raw/Disk.obj")))
