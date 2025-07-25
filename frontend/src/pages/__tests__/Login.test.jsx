import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../Login';
import { AuthContext } from '../../context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

describe('Login Page', () => {
  it('renders and submits form', async () => {
    const login = jest.fn().mockResolvedValue();
    render(
      <AuthContext.Provider value={{ login }}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </AuthContext.Provider>
    );
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(login).toHaveBeenCalledWith('test@example.com', 'password');
  });

  it('shows error on failed login', async () => {
    const login = jest.fn().mockRejectedValue({ response: { data: { error: 'Login failed' } } });
    render(
      <AuthContext.Provider value={{ login }}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </AuthContext.Provider>
    );
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'fail@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    // Wait for error message
    await screen.findByText(/login failed/i);
    expect(screen.getByText(/login failed/i)).toBeInTheDocument();
  });
}); 