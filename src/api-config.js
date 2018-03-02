let backendHost;

const hostname = window && window.location && window.location.hostname;

if(hostname === 'https://suunnittelu.partio-ohjelma.fi') {
  backendHost = 'https://suunnittelu.partio-ohjelma.fi:3001';
} else {
  backendHost = process.env.REACT_APP_BACKEND_HOST || 'http://localhost:3001';
}

export const API_ROOT = `${backendHost}`;