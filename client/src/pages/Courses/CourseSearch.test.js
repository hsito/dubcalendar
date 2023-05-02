import React from "react";
import { render, screen, waitFor} from "@testing-library/react";
import CourseSearch from "./CourseSearch";
import fetchMock from 'fetch-mock';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event'
import {act} from "react-dom/test-utils";



beforeEach(() => {
  fetchMock
    .get('/classes',
      [{
        className: 'Software Engineering',
        subject: 'CSC',
        classNum: '450',
        section: '800',
        days: 'MW',
        startTime: '10:00',
        endTime: '11:30',
      },
          {
            className: 'Object Oriented Programming',
            subject: 'CSC',
            classNum: '340',
            section: '800',
            days: 'TR',
            startTime: '10:00',
            endTime: '11:30',
          }],
    )
    .get('/current_user', {
      email: 'user@example.com',
      id: '1',
    })
    .get('/user_classes/user@example.com', []);
});

afterEach(() => {
  fetchMock.restore();
});

test('search function works correctly', async () => {
 const { getByText, getByPlaceholderText } = render(
    <MemoryRouter>
      <CourseSearch />
    </MemoryRouter>
  );

  await waitFor(() => screen.findByText('Software Engineering: CSC 450 800'));

  const courseElement = screen.getByText('Software Engineering: CSC 450 800');
  expect(courseElement).toBeInTheDocument();

  // Click on the course element
   act(() => {
    userEvent.click(courseElement);
  });

  // Check if the course details are displayed
  await waitFor(() => screen.findByText('Start Time: 10:00'));
  const startTime = screen.getByText('Start Time: 10:00');
  expect(startTime).toBeInTheDocument();
});



