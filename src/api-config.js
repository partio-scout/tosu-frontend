let root = 'https://suunnittelu.partio-ohjelma.fi:3001';

const hostname = window && window.location && window.location.hostname;

export const POF_ROOT = 'https://suunnittelu.partio-ohjelma.fi:3002'

if (hostname === 'suunnittelu.partio-ohjelma.fi') {
  root = 'https://suunnittelu.partio-ohjelma.fi:3001';
} else {
   //root = 'http://localhost:3001';
  //root = 'https://cors-anywhere.herokuapp.com/https://suunnittelu.partio-ohjelma.fi:3001';
  root = 'https://suunnittelu.partio-ohjelma.fi:3001';
}

export const API_ROOT = root

export default { API_ROOT, POF_ROOT }
