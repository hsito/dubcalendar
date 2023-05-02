import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import httpClient from '../../httpClient';
import { toast } from 'react-toastify';
import DeleteAccount from './DeleteAccount';
import {MemoryRouter} from "react-router-dom";

jest.mock('../../httpClient');
jest.mock('react-toastify');

describe('DeleteAccount', () => {
  it('should render DeleteAccount component', () => {
    render(<MemoryRouter><DeleteAccount /></MemoryRouter>);
    expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Account' })).toBeInTheDocument();
  });

  it('should call httpClient.post and redirect to home page when Delete button is clicked', async () => {
    const postMock = jest.spyOn(httpClient, 'post').mockResolvedValue({});
    const successMock = jest.spyOn(toast, 'success');
    const hrefMock = jest.spyOn(window.location, 'href', 'set');

    render(<MemoryRouter><DeleteAccount /></MemoryRouter>);
    const deleteButton = screen.getByRole('button', { name: 'Delete' });
    fireEvent.click(deleteButton);

    expect(postMock).toHaveBeenCalledWith('/DeleteAccount', {});
    expect(successMock).toHaveBeenCalledWith('Password updated successfully!');
    expect(hrefMock).toHaveBeenCalledWith('/');
  });
});
