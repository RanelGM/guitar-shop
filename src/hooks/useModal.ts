import { MouseEvent, useState } from 'react';
import { KeyboardKey } from 'utils/const';

type modalStateType = {
  [isModalOpen: string]: boolean
}

export type useModalType = ReturnType<typeof useModal>;

export default function useModal(modalState: modalStateType, successModalKey?: string) {
  const [openedModal, setOpenedModal] = useState(modalState);

  const handleModalClose = () => {
    const keys = Object.keys(openedModal);

    const state = keys.reduce((result, key) => {
      result[key] = false;
      return result;
    }, {} as modalStateType);

    setOpenedModal(state);
  };

  const handleSuccessEvent = () => {
    if (!successModalKey) { return; }

    const keys = Object.keys(openedModal);

    const state = keys.reduce((result, key) => {
      result[key] = key === successModalKey;
      return result;
    }, {} as modalStateType);

    setOpenedModal(state);
  };

  const handleCloseBtnClick = () => {
    handleModalClose();
  };

  const handleOverlayClick = (evt: MouseEvent) => {
    const isOverlay = (evt.target as HTMLDivElement).closest('.modal__overlay') !== null;

    if (!isOverlay) { return; }

    handleModalClose();
  };

  const handleEscKeydown = (evt: KeyboardEvent) => {
    if (evt.key === KeyboardKey.Esc) {
      handleModalClose();
    }
  };

  const handleModalDidMount = () => {
    document.addEventListener('keydown', handleEscKeydown);
    document.body.classList.add('scroll-lock');
  };

  const handleModalDidUnmount = () => {
    document.removeEventListener('keydown', handleEscKeydown);
    document.body.classList.remove('scroll-lock');
  };

  return { openedModal, setOpenedModal, handleCloseBtnClick, handleSuccessEvent, handleOverlayClick, handleModalDidMount, handleModalDidUnmount };
}
