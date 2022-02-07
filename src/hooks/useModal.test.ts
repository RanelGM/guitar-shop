import { renderHook, act } from '@testing-library/react-hooks';
import useModal from './useModal';

describe('Custom hook: useModal', () => {
  it('should return array with 3 elements with corresponding types', () => {
    const { result } = renderHook(() => useModal());

    const [isModalOpen, setIsModalOpen, modalHandlerGroup] = result.current;

    expect(result.current).toHaveLength(3);
    expect(isModalOpen).toEqual(expect.any(Boolean));
    expect(setIsModalOpen).toEqual(expect.any(Function));
    expect(modalHandlerGroup).toEqual(expect.any(Object));
  });

  it('should correctly change state', () => {
    const { result } = renderHook(() => useModal());

    const [, setIsModalOpen] = result.current;
    let [isModalOpen] = result.current;

    expect(isModalOpen).toBe(false);

    act(() => setIsModalOpen(true));
    [isModalOpen] = result.current;
    expect(isModalOpen).toBe(true);
  });

  it('should call Success callback if provided', () => {
    const successCallabck = jest.fn();
    const { result } = renderHook(() => useModal(successCallabck));

    const [, , modalHandlerGroup] = result.current;
    const { handleSuccessEvent } = modalHandlerGroup;

    expect(successCallabck).not.toBeCalled();
    handleSuccessEvent();
    expect(successCallabck).toBeCalled();
  });
});
