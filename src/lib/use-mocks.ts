/**
 * Fichier séparé et sans aucune dépendance : importé aussi bien par lib/api-client.ts que par
 * les fichiers client-safe (client-fetch.ts et ses consommateurs). Si USE_MOCKS vivait dans
 * api-client.ts, importer ne serait-ce que cette constante suffirait à entraîner tout le module
 * — y compris son import dynamique de backend-fetch.ts (`next/headers`) — dans le bundle
 * client, ce que Next.js refuse même derrière un import dynamique.
 */
export const USE_MOCKS = true;
