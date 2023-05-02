import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import httpClient from '../../httpClient';
import { toast } from 'react-toastify';
import ChangePassword from './ChangePassword';
import {MemoryRouter} from "react-router-dom";

// Mock the httpClient
jest.mock('../../httpClient');

// Mock the toast function
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
  },
}));

describe('ChangePassword', () => {
  test('displays an error message when an error occurs', async () => {
    // Set up mock response from httpClient
    const error = new Error('Something went wrong');
    error.response = { data: { error: 'Password change failed' } };
    httpClient.post.mockRejectedValueOnce(error);

    // Render the component
    const { getByLabelText, getByText, getByRole } = render(<MemoryRouter><ChangePassword /></MemoryRouter>);
    const newPasswordInput = getByLabelText('New Password');
    const submitButton = getByText('Submit');

    // Fill in the form and submit it
    fireEvent.change(newPasswordInput, { target: { value: 'newpassword' } });
    fireEvent.click(submitButton);

    // Wait for the error message to be displayed
    await waitFor(() => {
      expect(getByRole('alert')).toHaveTextContent('Password change failed');
    });
  });

  test('displays a success message when password is updated', async () => {
    // Set up mock response from httpClient
    httpClient.post.mockResolvedValueOnce({ data: {} });

    // Render the component
    const { getByLabelText, getByText } = render(<MemoryRouter><ChangePassword /></MemoryRouter>);
    const newPasswordInput = getByLabelText('New Password');
    const submitButton = getByText('Submit');

    // Fill in the form and submit it
    fireEvent.change(newPasswordInput, { target: { value: 'newpassword' } });
    fireEvent.click(submitButton);

    // Wait for the success message to be displayed
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Password updated successfully!');
    });
  });
});
