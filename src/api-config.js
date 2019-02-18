let root = 'http://localhost:3001'

const hostname = window && window.location && window.location.hostname

if (hostname === 'suunnittelu.beta.partio-ohjelma.fi') {
  root = 'https://suunnittelu.beta.partio-ohjelma.fi:3002'
}

export const API_ROOT = root
export const POF_ROOT = 'https://suunnittelu.beta.partio-ohjelma.fi:3002'

export default { API_ROOT, POF_ROOT }
