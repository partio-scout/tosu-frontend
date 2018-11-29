let root = 'http://localhost:3001'
 root = 'https://suunnittelu.beta.partio-ohjelma.fi:3002'

const hostname = window && window.location && window.location.hostname;

export const POF_ROOT = 'https://suunnittelu.partio-ohjelma.fi:3002'

if (hostname === 'suunnittelu.beta.partio-ohjelma.fi') {
  root = 'https://suunnittelu.beta.partio-ohjelma.fi:3002'
} else if (hostname === 'suunnittelu.partio-ohjelma.fi'){
  root = 'https://suunnittelu.partio-ohjelma.fi:3002'
}

export const API_ROOT = root

export default { API_ROOT, POF_ROOT }
