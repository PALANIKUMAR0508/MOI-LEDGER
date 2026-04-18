// Simple Tamil transliteration using Google Input Tools API
export async function transliterateToTamil(text) {
  if (!text || text.trim() === '') return '';
  
  try {
    const url = 'https://inputtools.google.com/request?text=' + 
                encodeURIComponent(text) + 
                '&itc=ta-t-i0-und&num=1&cp=0&cs=1&ie=utf-8&oe=utf-8&app=demopage';
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data && data[0] === 'SUCCESS' && data[1] && data[1][0] && data[1][0][1]) {
      return data[1][0][1][0];
    }
    return text; // Return original if transliteration fails
  } catch (error) {
    console.error('Transliteration error:', error);
    return text; // Return original text on error
  }
}

// Debounce function to avoid too many API calls
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
