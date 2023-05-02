import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import httpClient from '../../httpClient';
import UploadProfilePic from './UploadProfilePic';
import {MemoryRouter} from "react-router-dom";

jest.mock('../../httpClient');

describe('UploadProfilePic', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should upload profile picture', async () => {
    const successResponse = { success: 'Profile picture uploaded successfully!' };
    httpClient.post.mockResolvedValue({ data: successResponse });

    const { getByLabelText, getByText } = render(<MemoryRouter><UploadProfilePic /></MemoryRouter>);

    const fileInput = getByLabelText('Choose file');
    const file = new File(['profile picture'], 'profile.png', { type: 'image/png' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    const uploadButton = getByText('Upload');
    fireEvent.click(uploadButton);

    await waitFor(() => expect(httpClient.post).toHaveBeenCalled());

    expect(getByText(successResponse.success)).toBeInTheDocument();
    expect(window.location.href).toBe('/account');
  });

  it('should display error message when failed to upload profile picture', async () => {
    const errorResponse = { response: { data: { error: 'Failed to upload profile picture' } } };
    httpClient.post.mockRejectedValue(errorResponse);

    const { getByLabelText, getByText } = render(<MemoryRouter><UploadProfilePic /></MemoryRouter>);

    const fileInput = getByLabelText('Choose file');
    const file = new File(['profile picture'], 'profile.png', { type: 'image/png' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    const uploadButton = getByText('Upload');
    fireEvent.click(uploadButton);

    await waitFor(() => expect(httpClient.post).toHaveBeenCalled());

    expect(getByText(errorResponse.response.data.error)).toBeInTheDocument();
  });
});
