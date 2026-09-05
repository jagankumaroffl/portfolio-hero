Drop the real portrait here (exact name, case-sensitive):

- portrait.jpg

Until it's present, the About section falls back to its existing gradient
placeholder — no stock photo, no AI-generated image, nothing that reads
"placeholder" on the live site.

The component (components/about/Portrait.tsx) crops it with object-fit:
cover inside the existing composition, so any reasonably portrait-oriented
photo will work without distortion on desktop or mobile.