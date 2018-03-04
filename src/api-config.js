let backendHost;

const hostname = window && window.location && window.location.hostname;

if (hostname === 'suunnittelu.partio-ohjelma.fi') {
  backendHost = 'https://suunnittelu.partio-ohjelma.fi:3001';
} else {
  backendHost = 'http://localhost:3001';
}

export const API_ROOT = `${backendHost}`;