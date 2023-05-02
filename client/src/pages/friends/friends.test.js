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
      },
          {
            userid: '6789',
            status: 'pending',
            time: '12:00',
            friendid: '3456',
            friend_email: 'xyz1234@uncw.edu',
            friend_fName: 'Sarah',
            friend_lName: 'Johnson',
            user_email: 'abc1234@uncw.edu',
            user_fName: 'John',
            user_lName: 'Smith'
          }],
    )

    .get('/current_user', {
      email: 'abc1234@uncw.edu',
      id: '6789',
    })
    .get('/user_classes/age2890@uncw.edu', [{
         className: 'Software Engineering',
        subject: 'CSC',
        classNum: '450',
        section: '800',
        days: 'MW',
        startTime: '1000',
        endTime: '1130'
    }]);
});

afterEach(() => {
  fetchMock.restore();
});

test('Able to view friends Courses', async () => {
 const { getByText, getByPlaceholderText } = render(
    <MemoryRouter>
      <Friends />
    </MemoryRouter>
  );

  await waitFor(() => screen.findByText('Adam Eichman'));

  const friendElement = screen.getByText('Adam Eichman');
  expect(friendElement).toBeInTheDocument();

  // Click on the friend element
  act(() => {
    userEvent.click(friendElement);
  });

  // Check if friend's courses are displaying
  await waitFor(() => screen.findByText('CSC 450'));
  const startTime = screen.getByText('CSC 450');
  expect(startTime).toBeInTheDocument();
});