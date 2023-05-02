import React from "react";
import { render, screen, waitFor} from "@testing-library/react";
import fetchMock from 'fetch-mock';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event'
import {act} from "react-dom/test-utils";
import Friends from "./friends";

// Adam Eichman

beforeEach(() => {
  fetchMock
    .get('/request_view/6789',
      [{
        userid: '6789',
        status: 'accepted',
        time: '12:00',
        friendid: '1234',
        friend_email: 'age2890@uncw.edu',
        friend_fName: 'Adam',
        friend_lName: 'Eichman',
        user_email: 'abc1234@uncw.edu',
        user_fName: 'John',
        user_lName: 'Smith'
      }],
    )

    .get('/current_user', {
      email: 'abc1234@uncw.edu',
      id: '6789',
    })
});

afterEach(() => {
  fetchMock.restore();
});

test('Able to remove a friend', async () => {
 const { getByText, getByPlaceholderText } = render(
    <MemoryRouter>
      <Friends />
    </MemoryRouter>
  );

  await waitFor(() => screen.findByText('Adam Eichman'));

  await waitFor(() => screen.findByTestId('delete-icon'));
  const icon = screen.getByTestId('delete-icon');
  expect(icon).toBeInTheDocument();

  // Click on the friend element
  act(() => {
    userEvent.click(icon);
  });

  // Check if friend was removed
  let friend;

    try {
      await waitFor(() => screen.findByText('Adam Eichman'));
      friend = screen.getByText('Adam Eichman');
      expect(friend).toBeInTheDocument();
    } catch (error) {
      // If "CSC 450" is not found, set startTime to null
      friend = null;
    }

    expect(friend).toBeNull();
    });