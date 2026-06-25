# API Contracts — findMe (L3)

Toutes les routes sont préfixées par `/api` et servies par le **mock server Nitro**
(`server/`). Les réponses sont en JSON. L'authentification se fait par jeton Bearer
(`Authorization: Bearer <token>`) ou cookie `findme-token`.

## Conventions d'erreur

```jsonc
// 422 — validation
{ "statusCode": 422, "statusMessage": "Validation échouée.",
  "data": { "fields": { "email": "Adresse email invalide." } } }

// 401 / 403 / 404 / 409
{ "statusCode": 401, "statusMessage": "Authentification requise." }
```

| Code | Signification |
| --- | --- |
| 401 | Non authentifié |
| 403 | Authentifié mais droits insuffisants (admin requis) |
| 409 | Conflit (email déjà utilisé, limite de 4 adresses, doublon) |
| 422 | Erreurs de validation par champ |

---

## Authentification

### `POST /api/auth/register`
Body : `{ fullName, email, password }` — mot de passe ≥ 8 car., 1 majuscule, 1 chiffre.
→ `200 { user, token }` · `409` email pris · `422` validation.

### `POST /api/auth/login`
Body : `{ email, password }` → `200 { user, token }` · `401` identifiants invalides.

### `GET /api/auth/me` 🔒
→ `200 { user }` · `401`.

### `POST /api/auth/forgot-password`
Body : `{ email }` → `200 { message, devResetToken? }`
(*`devResetToken` exposé uniquement en mock pour la démo — partirait par email en prod*).

### `POST /api/auth/reset-password`
Body : `{ token, password }` → `200 { message }` · `400` token invalide/expiré.

---

## Adresses 🔒

Ressource `Address` :
```ts
{ id, userId, code, country, city, district, street, houseNumber,
  postalCode?, lat, lng, photoUrl?, status, createdAt, updatedAt }
```

### `GET /api/addresses`
→ `200 { items: Address[], count, max: 4 }`

### `POST /api/addresses`
Body : `{ country, city, district, street, houseNumber, postalCode?, lat, lng, photoUrl? }`
→ `200 { address }` · `409` (limite de 4 / doublon) · `422`.

### `GET /api/addresses/:id`
→ `200 { address }` · `403` (pas le propriétaire) · `404`.

### `PUT /api/addresses/:id`
Body identique à la création → `200 { address }` · `403` · `409` · `422`.

### `DELETE /api/addresses/:id`
→ `200 { success: true }` · `403` · `404`.

---

## Support

### `POST /api/support`
Body : `{ name, email, message }` (message ≥ 10 car.) → `200 { success, id }` · `422`.

---

## Administration 🔒👑 (`role: admin`)

### `GET /api/admin/stats`
→ `{ users, addresses, support, supportPending, byCity: [{ city, count }] }`

### `GET /api/admin/users?search=&city=&page=`
→ `{ items: [{ ...user, addressCount }], total, page, pages }` (10/page).

### `GET /api/admin/addresses?search=&country=&city=&district=&page=`
→ `{ items: [{ ...address, ownerName, ownerEmail }], total, page, pages }`.

### `GET /api/admin/support?status=` (`''|pending|handled`)
→ `{ items: SupportMessage[], total }`.

### `PATCH /api/admin/support/:id`
Body : `{ handled?: boolean }` (toggle si absent) → `{ message }`.

---

## Comptes de démonstration (seedés au démarrage)

| Rôle | Email | Mot de passe |
| --- | --- | --- |
| Utilisateur | `demo@findme.africa` | `Demo1234` |
| Administrateur | `admin@findme.africa` | `Admin123` |
