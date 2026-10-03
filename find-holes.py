from PIL import Image

# Load the user's template
img = Image.open('/Users/user/.gemini/antigravity/brain/357dcb77-d5aa-4b4c-85a6-6ea6853e2b33/.user_uploaded/media_1790637770083.png')
pixels = img.load()
width, height = img.size

# Find all fully transparent pixels (alpha == 0)
transparent_pixels = []
for y in range(height):
    for x in range(width):
        if pixels[x, y][3] == 0:
            transparent_pixels.append((x, y))

# Group them into contiguous boxes roughly
# Just find min/max Y for x around 150 (middle of first column)
col0_y = [y for (x,y) in transparent_pixels if 100 < x < 200]
print(f"Col 0 Transparent Y values range: {min(col0_y)} to {max(col0_y)}")

# Find min/max X for y around 200 (middle of first row)
row0_x = [x for (x,y) in transparent_pixels if 150 < y < 250 and x < width/2]
print(f"Row 0 Transparent X values range: {min(row0_x)} to {max(row0_x)}")

# Let's get the exact box height
print(f"Exact Box Height: {max(col0_y)} - {min(col0_y)} + 1 = {max(col0_y) - min(col0_y) + 1}")
print(f"Exact Box Width: {max(row0_x)} - {min(row0_x)} + 1 = {max(row0_x) - min(row0_x) + 1}")
