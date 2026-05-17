import Image from "next/image";

type TaxNestLogoProps = {
  width?: number;
  height?: number;
};

export default function TaxNestLogo({
  width = 220,
  height = 60,
}: TaxNestLogoProps) {

  return (
    <Image
      src="/taxnest-logo.png"
      alt="TaxNest"
      width={width}
      height={height}
      priority
      className="object-contain"
    />
  );
}