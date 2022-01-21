import { Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';

import Card from './card';
import { getGuitarMock } from 'utils/mocks';
import { TabGroup } from 'utils/const';


const expandedGuitar = getGuitarMock();

const history = createMemoryHistory();

const mockComponent = (
  <Router history={history}>
    <Card product={expandedGuitar} />
  </Router>
);

describe('Card component', () => {
  it('should render component', () => {
    render(mockComponent);

    expect(screen.getByText(expandedGuitar.name)).toBeInTheDocument();
    expect(screen.getByText(expandedGuitar.vendorCode)).toBeInTheDocument();
    expect(screen.getByText(/Количество струн:/i)).toBeInTheDocument();
    expect(screen.getByText(/Добавить в корзину/i)).toBeInTheDocument();
  });

  it('should switch tabs when clicking on it', () => {
    render(mockComponent);

    const charTab = screen.getByText(TabGroup.Characteristics.label);
    const descriptionTab = screen.getByText(TabGroup.Description.label);

    userEvent.click(charTab);
    expect(charTab.classList.contains('button--black-border')).toBe(false);
    expect(descriptionTab.classList.contains('button--black-border')).toBe(true);

    userEvent.click(descriptionTab);
    expect(charTab.classList.contains('button--black-border')).toBe(true);
    expect(descriptionTab.classList.contains('button--black-border')).toBe(false);
  });
});
