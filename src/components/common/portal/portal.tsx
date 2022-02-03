import { useEffect } from 'react';
import { createPortal } from 'react-dom';

type PortalProps = {
  children: JSX.Element
}

export default function Portal({ children }: PortalProps) {
  const container = document.createElement('div');

  useEffect(() => {
    const addContainer = () => {
      document.body.appendChild(container);
    };

    const removeContainer = () => {
      document.body.removeChild(container);
    };

    addContainer();

    return () => removeContainer();
  }, [container]);

  return createPortal(children, container);
}
