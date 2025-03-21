import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

export default function LoadingProgress() {
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const ref = useRef(0);

  useEffect(() => {
    let timeoutId = -1;
    const handleStart = () => {
      const reqId = ref.current;

      timeoutId = setTimeout(() => {
        if (reqId === ref.current) {
          setProgress(0.8);
        }
      }, 300);
    };

    const handleFinish = () => {
      ref.current++;
      setProgress(0);
    };

    const handleError = (event) => {
      if (event.cancelled) {
        ref.current++;
        setProgress(0);
      }
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleFinish);
    router.events.on('routeChangeError', handleError);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleFinish);
      router.events.off('routeChangeError', handleError);
      clearTimeout(timeoutId);
    };
  }, [router.events]);

  return (
    <div
      style={{
        transform: `scaleX(${progress})`,
      }}
      className={'absolute left-0 top-0 h-[4px] w-full origin-left bg-red-600'}
    ></div>
  );
}
