import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import httpClient from '../../httpClient';
import Sign_Up from './Sign-up';
import {MemoryRouter} from "react-router-dom";

// Mock the http client module
jest.mock('../../httpClient');

describe('Sign_Up', () => {
  it('renders the registration form', () => {
      // eslint-disable-next-line react/jsx-pascal-case
    const { getByLabelText, getByText } = render(<MemoryRouter><Sign_Up /></MemoryRouter>);
    expect(getByLabelText('Email:')).toBeInTheDocument();
    expect(getByLabelText('Password:')).toBeInTheDocument();
    expect(getByLabelText('First Name:')).toBeInTheDocument();
    expect(getByLabelText('Last Name:')).toBeInTheDocument();
    expect(getByText('Submit')).toBeInTheDocument();
  });

  it('submits the registration form', async () => {
      // eslint-disable-next-line react/jsx-pascal-case
    const { getByLabelText, getByText } = render(<MemoryRouter><Sign_Up /></MemoryRouter>);
    const emailInput = getByLabelText('Email:');
    const passwordInput = getByLabelText('Password:');
    const fNameInput = getByLabelText('First Name:');
    const lNameInput = getByLabelText('Last Name:');
    const submitButton = getByText('Submit');

    const emailValue = 'test@example.com';
    const passwordValue = 'password123';
    const fNameValue = 'John';
    const lNameValue = 'Doe';

    fireEvent.change(emailInput, { target: { value: emailValue } });
    fireEvent.change(passwordInput, { target: { value: passwordValue } });
    fireEvent.change(fNameInput, { target: { value: fNameValue } });
    fireEvent.change(lNameInput, { target: { value: lNameValue } });
    fireEvent.click(submitButton);

    // Wait for the HTTP request to resolve
    await waitFor(() => {
      expect(httpClient.post).toHaveBeenCalledWith('/sign-up', {
        email: emailValue,
        password: passwordValue,
        fName: fNameValue,
        lName: lNameValue,
      });
    });

    // Check that the page redirected to the home page
    expect(window.location.href).toBe('/');
  });

  it('displays an error message if registration fails', async () => {
    const errorMessage = 'Registration failed';
    // Mock the HTTP client to throw an error
    httpClient.post.mockRejectedValue({ response: { data: { error: errorMessage } } });

      // eslint-disable-next-line react/jsx-pascal-case
    const { getByLabelText, getByText } = render(<MemoryRouter><Sign_Up /></MemoryRouter>);
    const emailInput = getByLabelText('Email:');
    const passwordInput = getByLabelText('Password:');
    const fNameInput = getByLabelText('First Name:');
    const lNameInput = getByLabelText('Last Name:');
    const submitButton = getByText('Submit');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(fNameInput, { target: { value: 'John' } });
    fireEvent.change(lNameInput, { target: { value: 'Doe' } });
    fireEvent.click(submitButton);

    // Wait for the error message to be displayed
    await waitFor(() => {
      expect(getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
