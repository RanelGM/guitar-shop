import { MouseEvent, useState } from 'react';
import { KeyboardKey } from 'utils/const';

type ModalResult = [boolean, React.Dispatch<React.SetStateAction<boolean>>, ModalHandlerGroup];
type SucceesCallback = () => void;

export type ModalHandlerGroup = {
  handleCloseBtnClick: () => void,
  handleOverlayClick: (evt: MouseEvent) => void,
  handleModalDidMount: () => void,
  handleModalDidUnmount: () => void,
  handleSuccessEvent: () => void,
};

export default function useModal(onSuccessCallback?: SucceesCallback): ModalResult {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalClose = () => {
    setIsModalOpen(false);
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

  const handleSuccessEvent = () => {
    if (!onSuccessCallback) { return; }

    onSuccessCallback();
  };

  const handlerGroup = {
    handleCloseBtnClick,
    handleOverlayClick,
    handleModalDidMount,
    handleModalDidUnmount,
    handleSuccessEvent,
  };

  return [isModalOpen, setIsModalOpen, handlerGroup];
}
