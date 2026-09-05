/**
 * The same JK mark used in the full-screen Loader (components/loader/Loader.tsx),
 * rendered here as a plain static (fully-drawn, non-animated) SVG for the
 * Hero nav's brand mark.
 *
 * The path data below is copied verbatim from Loader.tsx's two filled J/K
 * shapes — same geometry, same fill. Only the mask/stroke-draw animation is
 * dropped, since the nav mark should already be fully drawn and settled,
 * not looping. This keeps the loader's own animation file completely
 * untouched while making sure the Hero shows the *same* logo rather than a
 * different placeholder mark.
 */
export default function JKMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 320 230"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M183.6,30.8 Q182.0,24.0 175.0,23.8 L107.0,22.2 Q100.0,22.0 95.5,27.4
           L80.5,45.6 Q76.0,51.0 83.0,51.3 L140.0,53.7 Q147.0,54.0 144.8,60.6
           L107.4,173.8 Q106.0,178.0 102.8,181.2 L102.2,181.8 Q99.0,185.0 94.5,185.0
           L60.9,185.0 Q58.0,185.0 56.2,182.8 L55.8,182.2 Q54.0,180.0 54.9,177.3
           L63.7,151.6 Q66.0,145.0 59.0,145.6 L49.0,146.4 Q42.0,147.0 36.6,151.5
           L35.4,152.5 Q30.0,157.0 27.7,163.6 L18.3,191.4 Q16.0,198.0 18.2,204.6
           L18.8,206.4 Q21.0,213.0 28.0,213.2 L105.4,214.9 Q112.0,215.0 117.8,211.8
           L119.2,211.2 Q125.0,208.0 127.3,201.8 L183.6,47.6 Q186.0,41.0 184.4,34.2
           L183.6,30.8 Z"
      />
      <path
        fill="currentColor"
        d="M297.3,27.1 Q302.0,22.0 295.0,22.0 L266.6,22.0 Q263.0,22.0 259.9,23.8
           L259.1,24.2 Q256.0,26.0 253.6,28.7 L178.0,114.4 Q174.0,119.0 172.2,124.8
           L171.8,126.2 Q170.0,132.0 176.1,132.0 L186.1,132.0 Q189.0,132.0 191.2,133.8
           L191.8,134.2 Q194.0,136.0 195.2,138.6 L222.2,199.6 Q225.0,206.0 231.8,207.8
           L256.2,214.2 Q263.0,216.0 260.3,209.6 L221.7,118.4 Q219.0,112.0 223.7,106.9
           L297.3,27.1 Z"
      />
    </svg>
  );
}