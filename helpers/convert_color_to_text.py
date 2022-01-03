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

def parse_obj(lines, new_tex, number_of_colors):
  out = ""
  step_tex = 1/number_of_colors
  text_x = step_tex/2
  for _ in range(number_of_colors):
    out += "vt " + extend_str(str(round(float(text_x), 6)), 8) + " 0.500000\n"
    text_x += step_tex
  
  text_counter = 0
  for line in lines:
    elements = line.split(' ')
    if elements[0] == 'usemtl':
      text_counter += 1
    if (elements[0] == 'vt'):
      continue
    elif elements[0] == 'f':
      new_face = "f "
      for i in range(3):
        new_triangle = elements[i + 1].split('/')
        new_triangle[1] = str(text_counter)
        new_triangle = '/'.join(new_triangle)
        new_face += new_triangle
        if (i < 2):
          new_face += " "
      out += new_face
    else:
      out += line
      
  out = "usemtl "+ new_tex + '\n' + out
  return out


#for i in range(41):
#  write_file("filtered/"+ str(i) + ".obj", parse_obj(read_file("raw/" + str(i) + ".obj"), "Dragon_Texture", 6))

write_file("ClownFish.obj", parse_obj(read_file("raw/ClownFish.obj"), "ClownFish_Texture", 3))
