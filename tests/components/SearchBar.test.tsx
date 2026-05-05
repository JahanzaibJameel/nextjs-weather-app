import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import SearchBar from '@/components/SearchBar';

describe('SearchBar', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  it('renders search input and button', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    expect(document.querySelector('input[placeholder*="city"]')).toBeInTheDocument();
    expect(document.querySelector('button')).toBeInTheDocument();
  });

  it('calls onSearch when button is clicked with valid input', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = document.querySelector('input[placeholder*="city"]');
    const button = document.querySelector('button');
    
    await user.type(input, 'London');
    await user.click(button);
    
    expect(mockOnSearch).toHaveBeenCalledWith('London');
    expect(input).toHaveValue('');
  });

  it('calls onSearch when Enter key is pressed', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = document.querySelector('input[placeholder*="city"]');
    
    await user.type(input, 'Paris{enter}');
    
    expect(mockOnSearch).toHaveBeenCalledWith('Paris');
    expect(input).toHaveValue('');
  });

  it('does not call onSearch with empty input', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const button = document.querySelector('button');
    await user.click(button);
    
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('shows loading state when isLoading is true', () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading={true} />);
    
    const button = document.querySelector('button');
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Searching...');
  });

  it('shows placeholder text correctly', () => {
    render(<SearchBar onSearch={mockOnSearch} placeholder="Custom placeholder" />);
    
    const input = document.querySelector('input[placeholder="Custom placeholder"]');
    expect(input).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = document.querySelector('input[role="search"]');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-label', /search for weather by city or country/i);
    
    const button = document.querySelector('button');
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });
});
