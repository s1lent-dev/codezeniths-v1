import Spline from '@splinetool/react-spline/next';

export default function Planet() {
  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden isolate transform-gpu">
      {/* 
        By scaling the inner container up, we solve two problems instantly:
        1. It massively increases the size of the 404 Planet Spline scene.
        2. It pushes the "Built with Spline" watermark (which sits at the bottom right) 
           completely outside the parent's bounding box, where it gets clipped and hidden!
      */}
      <div className="w-full h-full scale-[1.25] md:scale-[1.4] flex items-center justify-center origin-center">
        <Spline
          scene="https://prod.spline.design/YcsAlwKt2xDu2z5M/scene.splinecode" 
          className="w-full h-full items-center justify-center ml-12"
        />
      </div>
    </div>
  );
}
