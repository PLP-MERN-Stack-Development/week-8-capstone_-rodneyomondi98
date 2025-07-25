import { render, screen } from '@testing-library/react';
import Dashboard from '../Dashboard';
import * as api from '../../api/courses';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../../api/courses');

describe('Dashboard', () => {
  it('shows loading, then courses', async () => {
    api.fetchCourses.mockResolvedValue([
      { _id: '1', title: 'Course 1', instructor: { name: 'Inst' }, description: 'Desc', enrolled: false },
    ]);
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    const course = await screen.findByText(/Course 1/);
    expect(course).toBeInTheDocument();
  });

  it('shows error on fetch failure', async () => {
    api.fetchCourses.mockRejectedValue(new Error('fail'));
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    const error = await screen.findByText(/failed to load courses/i);
    expect(error).toBeInTheDocument();
  });
}); 