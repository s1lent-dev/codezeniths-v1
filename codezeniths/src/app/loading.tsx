import { Loader } from '@codezeniths/components';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-background-light dark:bg-background-dark">
      <Loader />
    </div>
  );
}
