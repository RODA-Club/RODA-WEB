// Logo principal (brand/roda-logo.svg), inline para no pedir un archivo extra.
const SPOKES = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

export function Logo({ className }: { className?: string }) {
  return (
    <svg role="img" aria-label="RODA" viewBox="-52.0 -828.3 3279.6 1076.6" className={className}>
      <path
        d="M28 0 149 688H570Q640 688 686.0 664.0Q732 640 754.5 600.5Q777 561 777 512Q777 448 757.5 401.0Q738 354 703.5 321.5Q669 289 623 268L711 0H466L402 231H290L249 0ZM317 384H462Q482 384 502.0 395.5Q522 407 535.0 427.0Q548 447 548 473Q548 499 534.0 515.0Q520 531 497 531H342Z"
        fill="#FFFFFF"
        transform="scale(1 -1)"
      />
      <g transform="translate(1251.0 -343.0) scale(16.945)">
        <g stroke="#FFFFFF" strokeWidth="0.9" strokeLinecap="round">
          {SPOKES.map((deg) => (
            <line key={deg} x1="0" y1="-2.4" x2="0" y2="-23" transform={`rotate(${deg})`} />
          ))}
        </g>
        <circle r="23.6" fill="none" stroke="#C6FE04" strokeWidth="3" />
        <circle r="2.8" fill="#FFFFFF" />
      </g>
      <path
        d="M28 0 149 688H437Q592 688 674.0 623.5Q756 559 756 425Q756 404 754.5 381.5Q753 359 748 334Q728 220 675.5 146.0Q623 72 540.5 36.0Q458 0 346 0ZM278 165H351Q388 165 416.0 175.0Q444 185 464.0 204.0Q484 223 497.0 251.0Q510 279 516 314Q523 352 526.0 371.5Q529 391 530.0 400.5Q531 410 531 416Q531 450 518.5 474.0Q506 498 480.5 510.5Q455 523 414 523H341Z"
        fill="#FFFFFF"
        transform="translate(1656.0 0) scale(1 -1)"
      />
      <path
        d="M-37 0 337 688H594L722 0H495L483 97H241L195 0ZM314 251H464L451 361L447 395Q445 412 442.5 428.5Q440 445 438 462L434 496H430Q420 474 409.0 451.5Q398 429 387.5 406.5Q377 384 366 361Z"
        fill="#FFFFFF"
        transform="translate(2424.0 0) scale(1 -1)"
      />
      <polygon fill="#C6FE04" points="19.6,122.3 3167.6,122.3 3156.0,188.3 8.0,188.3" />
    </svg>
  );
}
