from PIL import Image
import os

src = os.path.join('assets', 'truthmode_logo.jpg')
img = Image.open(src).convert('RGBA')

# Square-crop to centre (logo is already square but ensure it)
w, h = img.size
side = min(w, h)
left = (w - side) // 2
top  = (h - side) // 2
img  = img.crop((left, top, left + side, top + side))

# High-quality 512 master for PNG use in HTML
img_512 = img.resize((512, 512), Image.LANCZOS)
img_512.save(os.path.join('assets', 'icon.png'))

# ICO with all standard Windows sizes
img.save(
    os.path.join('assets', 'icon.ico'),
    sizes=[(16,16),(32,32),(48,48),(64,64),(128,128),(256,256)]
)

# Also save a clean 256 PNG for embedding in the HTML
img_256 = img.resize((256, 256), Image.LANCZOS)
img_256.save(os.path.join('assets', 'logo256.png'))

print('Icon and logo saved successfully.')
