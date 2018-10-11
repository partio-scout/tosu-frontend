let root = 'https://suunnittelu.beta.partio-ohjelma.fi';

const hostname = window && window.location && window.location.hostname;

export const POF_ROOT = 'https://suunnittelu.beta.partio-ohjelma.fi'

if (hostname === 'suunnittelu.partio-ohjelma.fi') {
  root = 'https://suunnittelu.partio-ohjelma.fi:3001';
} else {
   //root = 'http://localhost:3001';
  //root = 'https://cors-anywhere.herokuapp.com/https://suunnittelu.partio-ohjelma.fi:3001';
  root = 'https://suunnittelu.beta.partio-ohjelma.fi';
}

export const API_ROOT = root

export default { API_ROOT, POF_ROOT }
