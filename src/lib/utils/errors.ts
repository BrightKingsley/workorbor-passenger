import axios from 'axios';

// Error handling setup
export const handleError = (error: any) => {
  console.error('Error:', error.message || error);
  // Return a user-friendly message based on the error type
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Server responded with an error
      return `Error: ${error.response.status} - ${error.response.data.message}`;
    } else if (error.request) {
      // No response from server
      return 'Network error: Please check your connection.';
    }
  } else if (error.code === 'E_PERMISSION_MISSING') {
    return 'Location permissions denied. Please enable them in settings.';
  }
  return 'An unexpected error occurred. Please try again.';
};
