/**
 * N'autorise qu'un chemin relatif interne ("/commande/xyz") — jamais une URL absolue ni un
 * chemin protocole-relatif ("//evil.com"), qui permettrait une redirection ouverte via le
 * paramètre ?redirect= porté par le lien achat → inscription/connexion.
 */
export function safeRedirectPath(value: string | undefined | null): string | null {
  if (!value) return null;
  if (!value.startsWith("/") || value.startsWith("//")) return null;
  return value;
}
