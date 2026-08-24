import Spline from '@splinetool/react-spline/next';

export default function Planet() {
  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden isolate transform-gpu select-none">
      {/* 
        By scaling the inner container up with viewport-tailored ratios:
        1. The 404 Planet 3D model size is scaled responsively according to screen size (xs, sm, md, lg).
        2. The offset (ml-8 to ml-12) keeps the 3D model optically centered.
        3. The "Built with Spline" watermark (bottom-right) is pushed completely outside 
           the parent container's bounding box and clipped cleanly by overflow-hidden on all screen sizes.
      */}
      <div className="w-full h-full scale-[1.75] xs:scale-[1.65] sm:scale-[1.5] md:scale-[1.4] lg:scale-[1.4] flex items-center justify-center origin-center">
        <Spline
          scene="https://prod.spline.design/YcsAlwKt2xDu2z5M/scene.splinecode" 
          className="w-full h-full items-center justify-center ml-8 xs:ml-10 md:ml-12"
        />
      </div>
    </div>
  );
}
